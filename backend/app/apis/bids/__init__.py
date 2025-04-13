from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from app.apis.supabase_helper import supabase, initialize_database

router = APIRouter(prefix="/bids", tags=["bids"])

# Pydantic models for bid operations
class BidBase(BaseModel):
    title: str
    description: Optional[str] = None
    orgao: str
    data_abertura: datetime
    data_encerramento: Optional[datetime] = None
    valor_estimado: Optional[float] = None
    modalidade: str
    status: str
    numero_processo: str
    objeto: Optional[str] = None
    link_edital: Optional[str] = None

class BidCreate(BidBase):
    pass

class BidUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    orgao: Optional[str] = None
    data_abertura: Optional[datetime] = None
    data_encerramento: Optional[datetime] = None
    valor_estimado: Optional[float] = None
    modalidade: Optional[str] = None
    status: Optional[str] = None
    numero_processo: Optional[str] = None
    objeto: Optional[str] = None
    link_edital: Optional[str] = None

class BidResponse(BidBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Initialize database - only used during setup/migration
@router.post("/init", response_model=dict)
def init_database2():
    """
    Initialize the database with tables and sample data.
    This is typically used during setup or for testing.
    """
    return initialize_database()

# Get all bids with optional filtering
@router.get("", response_model=List[BidResponse])
def get_bids(
    limit: Optional[int] = Query(50, ge=1, le=100), 
    status: Optional[str] = None,
    orgao: Optional[str] = None,
    search: Optional[str] = None,
):
    """
    Get all bids with optional filtering by status, organization, or search term.
    """
    filters = {}
    if status:
        filters["status"] = status
    if orgao:
        filters["orgao"] = orgao
        
    # Get bids with applied filters
    bids = supabase.select("bids", filters=filters)
    
    # Apply text search if provided
    if search and bids:
        search = search.lower()
        bids = [bid for bid in bids if 
                search in bid.get("title", "").lower() or 
                search in bid.get("objeto", "").lower() or
                search in bid.get("orgao", "").lower()]
    
    # Apply limit
    return bids[:limit] if limit else bids

# Get a specific bid by ID
@router.get("/{bid_id}", response_model=BidResponse)
def get_bid(bid_id: int):
    """
    Get a specific bid by its ID.
    """
    try:
        return supabase.select_by_id("bids", bid_id)
    except HTTPException as e:
        if e.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Bid with ID {bid_id} not found") from e
        raise e from None

# Create a new bid
@router.post("", response_model=BidResponse, status_code=201)
def create_bid(bid: BidCreate):
    """
    Create a new bid.
    """
    # Convert Pydantic model to dict
    bid_data = bid.model_dump()
    
    # Add timestamps
    now = datetime.utcnow().isoformat()
    bid_data["created_at"] = now
    bid_data["updated_at"] = now
    
    # Insert into database
    result = supabase.insert("bids", bid_data)
    return result[0]

# Update an existing bid
@router.put("/{bid_id}", response_model=BidResponse)
def update_bid(bid_id: int, bid: BidUpdate):
    """
    Update an existing bid by its ID.
    """
    # Convert Pydantic model to dict, removing None values
    bid_data = {k: v for k, v in bid.model_dump().items() if v is not None}
    
    # Update timestamp
    bid_data["updated_at"] = datetime.utcnow().isoformat()
    
    # First check if the bid exists
    try:
        # Just check if it exists
        supabase.select_by_id("bids", bid_id)
    except HTTPException as e:
        if e.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Bid with ID {bid_id} not found") from e
        raise e from None
    
    # Update in database
    result = supabase.update("bids", bid_id, bid_data)
    return result

# Delete a bid
@router.delete("/{bid_id}", status_code=200)
def delete_bid(bid_id: int):
    """
    Delete a bid by its ID.
    """
    # First check if the bid exists
    try:
        # Just check if it exists
        supabase.select_by_id("bids", bid_id)
    except HTTPException as e:
        if e.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Bid with ID {bid_id} not found") from e
        raise e from None
    
    # Delete from database
    supabase.delete("bids", bid_id)
    return {"success": True, "message": f"Bid with ID {bid_id} deleted successfully"}
