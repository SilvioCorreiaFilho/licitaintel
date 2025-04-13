from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from app.apis.supabase_helper import supabase

router = APIRouter(prefix="/prices", tags=["prices"])

# Pydantic models for price history operations
class PriceHistoryBase(BaseModel):
    codigo_item: str
    descricao_item: str
    data_licitacao: datetime
    orgao: str
    valor_unitario: float
    quantidade: int
    vencedor: Optional[str] = None
    regiao: Optional[str] = None
    uf: Optional[str] = None

class PriceHistoryCreate(PriceHistoryBase):
    pass

class PriceHistoryResponse(PriceHistoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Pydantic models for price projection operations
class PriceProjectionBase(BaseModel):
    codigo_item: str
    preco_estimado: float
    intervalo_min: float
    intervalo_max: float
    confianca: float
    contexto: str

class PriceProjectionCreate(PriceProjectionBase):
    pass

class PriceProjectionResponse(PriceProjectionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Get price history for an item
@router.get("/history/{codigo_item}", response_model=List[PriceHistoryResponse])
def get_price_history(codigo_item: str, limit: Optional[int] = Query(20, ge=1, le=100)):
    """
    Get price history for a specific item code.
    """
    filters = {"codigo_item": codigo_item}
    price_history = supabase.select("price_history", filters=filters)
    
    # Sort by date (newest first) and apply limit
    price_history.sort(key=lambda x: x.get("data_licitacao", ""), reverse=True)
    return price_history[:limit] if limit else price_history

# Get price projection for an item
@router.get("/projection/{codigo_item}", response_model=PriceProjectionResponse)
def get_price_projection(codigo_item: str, contexto: str = Query(..., description="Context for the projection")):
    """
    Get price projection for a specific item code with context.
    """
    filters = {
        "codigo_item": codigo_item,
        "contexto": contexto
    }
    
    # Try to get existing projection
    projections = supabase.select("price_projections", filters=filters)
    
    if projections:
        return projections[0]
    else:
        # No projection found, calculate a new one
        # This would typically call a machine learning model
        # For now, we'll just create a mock projection based on price history
        
        # Get price history for this item
        price_history = supabase.select("price_history", filters={"codigo_item": codigo_item})
        
        if not price_history:
            raise HTTPException(status_code=404, detail=f"No price history found for item {codigo_item}")
        
        # Calculate average price and confidence interval
        prices = [item["valor_unitario"] for item in price_history]
        avg_price = sum(prices) / len(prices)
        
        # Simple confidence interval based on min/max prices
        price_range = max(prices) - min(prices)
        confidence = 0.85  # Mock confidence level
        
        # Create new projection
        projection = {
            "codigo_item": codigo_item,
            "preco_estimado": avg_price,
            "intervalo_min": avg_price - (price_range * 0.1),
            "intervalo_max": avg_price + (price_range * 0.1),
            "confianca": confidence,
            "contexto": contexto,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Save projection to database
        result = supabase.insert("price_projections", projection)
        return result[0]

# Add a new price history entry
@router.post("/history", response_model=PriceHistoryResponse, status_code=201)
def create_price_history(price_history: PriceHistoryCreate):
    """
    Add a new price history entry.
    """
    # Convert Pydantic model to dict
    price_data = price_history.model_dump()
    
    # Add timestamp
    price_data["created_at"] = datetime.utcnow().isoformat()
    
    # Insert into database
    result = supabase.insert("price_history", price_data)
    return result[0]

# Get price statistics
@router.get("/stats/{codigo_item}")
def get_price_stats(codigo_item: str):
    """
    Get price statistics for a specific item code.
    """
    filters = {"codigo_item": codigo_item}
    price_history = supabase.select("price_history", filters=filters)
    
    if not price_history:
        raise HTTPException(status_code=404, detail=f"No price history found for item {codigo_item}")
    
    # Extract prices and calculate statistics
    prices = [item["valor_unitario"] for item in price_history]
    avg_price = sum(prices) / len(prices)
    min_price = min(prices)
    max_price = max(prices)
    
    # Calculate trend (simple version based on most recent vs. average)
    # In a real app, this would use more sophisticated time series analysis
    price_history.sort(key=lambda x: x.get("data_licitacao", ""), reverse=True)
    recent_price = price_history[0]["valor_unitario"]
    
    if recent_price > avg_price * 1.05:
        trend = "alta"
    elif recent_price < avg_price * 0.95:
        trend = "baixa"
    else:
        trend = "estável"
    
    # Get regions with lowest and highest prices
    regions = {}
    for item in price_history:
        region = item.get("regiao")
        if region:
            if region not in regions:
                regions[region] = []
            regions[region].append(item["valor_unitario"])
    
    region_avg_prices = {}
    for region, region_prices in regions.items():
        region_avg_prices[region] = sum(region_prices) / len(region_prices)
    
    lowest_region = min(region_avg_prices.items(), key=lambda x: x[1], default=(None, None))
    highest_region = max(region_avg_prices.items(), key=lambda x: x[1], default=(None, None))
    
    return {
        "codigo_item": codigo_item,
        "media": avg_price,
        "minimo": min_price,
        "maximo": max_price,
        "desvio_padrao": calculate_std_dev(prices),
        "tendencia": trend,
        "regiao_menor_preco": lowest_region[0],
        "regiao_maior_preco": highest_region[0],
        "num_registros": len(prices)
    }

# Helper function to calculate standard deviation
def calculate_std_dev(numbers):
    if not numbers:
        return 0
    
    mean = sum(numbers) / len(numbers)
    variance = sum((x - mean) ** 2 for x in numbers) / len(numbers)
    return variance ** 0.5  # square root of variance
