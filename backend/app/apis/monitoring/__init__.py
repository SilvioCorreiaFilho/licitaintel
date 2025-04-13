from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, Field

from app.apis.supabase_helper import supabase

router = APIRouter(prefix="/monitoring", tags=["monitoring"])

# Pydantic models for monitoring operations
class MonitoringBase(BaseModel):
    keywords: List[str] = Field(default_factory=list)
    categorias: List[str] = Field(default_factory=list)
    orgaos: List[str] = Field(default_factory=list)
    valor_min: Optional[float] = None
    valor_max: Optional[float] = None
    is_active: bool = True

class MonitoringCreate(MonitoringBase):
    pass

class MonitoringUpdate(BaseModel):
    keywords: Optional[List[str]] = None
    categorias: Optional[List[str]] = None
    orgaos: Optional[List[str]] = None
    valor_min: Optional[float] = None
    valor_max: Optional[float] = None
    is_active: Optional[bool] = None

class MonitoringResponse(MonitoringBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Helper function to extract user ID from bearer token
def get_user_id(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    token = authorization.replace("Bearer ", "")
    try:
        # Verify token and get user info
        response = supabase.client.get(
            f"{supabase.url}/auth/v1/user",
            headers={
                "apikey": supabase.key,
                "Authorization": f"Bearer {token}",
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        
        user_data = response.json()
        return user_data.get("id")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication error: {str(e)}") from e

# Get all monitorings for the current user
@router.get("", response_model=List[MonitoringResponse])
def get_monitorings(user_id: str = Depends(get_user_id)):
    """
    Get all monitoring configurations for the current user.
    """
    filters = {"user_id": user_id}
    monitorings = supabase.select("monitorings", filters=filters)
    return monitorings

# Get a specific monitoring by ID
@router.get("/{monitoring_id}", response_model=MonitoringResponse)
def get_monitoring(monitoring_id: int, user_id: str = Depends(get_user_id)):
    """
    Get a specific monitoring configuration by its ID.
    """
    try:
        monitoring = supabase.select_by_id("monitorings", monitoring_id)
        
        # Ensure the monitoring belongs to the current user
        if monitoring["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="You don't have permission to access this resource")
        
        return monitoring
    except HTTPException as e:
        if e.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Monitoring with ID {monitoring_id} not found") from e
        raise e from None

# Create a new monitoring
@router.post("", response_model=MonitoringResponse, status_code=201)
def create_monitoring(monitoring: MonitoringCreate, user_id: str = Depends(get_user_id)):
    """
    Create a new monitoring configuration for the current user.
    """
    # Convert Pydantic model to dict
    monitoring_data = monitoring.model_dump()
    
    # Add user ID and timestamps
    now = datetime.utcnow().isoformat()
    monitoring_data["user_id"] = user_id
    monitoring_data["created_at"] = now
    monitoring_data["updated_at"] = now
    
    # Insert into database
    result = supabase.insert("monitorings", monitoring_data)
    return result[0]

# Update an existing monitoring
@router.put("/{monitoring_id}", response_model=MonitoringResponse)
def update_monitoring(monitoring_id: int, monitoring: MonitoringUpdate, user_id: str = Depends(get_user_id)):
    """
    Update an existing monitoring configuration by its ID.
    """
    # First check if the monitoring exists and belongs to the user
    try:
        existing = supabase.select_by_id("monitorings", monitoring_id)
        
        # Ensure the monitoring belongs to the current user
        if existing["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="You don't have permission to modify this resource")
            
    except HTTPException as e:
        if e.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Monitoring with ID {monitoring_id} not found") from e
        raise e from None
    
    # Convert Pydantic model to dict, removing None values
    monitoring_data = {k: v for k, v in monitoring.model_dump().items() if v is not None}
    
    # Update timestamp
    monitoring_data["updated_at"] = datetime.utcnow().isoformat()
    
    # Update in database
    result = supabase.update("monitorings", monitoring_id, monitoring_data)
    return result

# Delete a monitoring
@router.delete("/{monitoring_id}", status_code=200)
def delete_monitoring(monitoring_id: int, user_id: str = Depends(get_user_id)):
    """
    Delete a monitoring configuration by its ID.
    """
    # First check if the monitoring exists and belongs to the user
    try:
        existing = supabase.select_by_id("monitorings", monitoring_id)
        
        # Ensure the monitoring belongs to the current user
        if existing["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="You don't have permission to delete this resource")
            
    except HTTPException as e:
        if e.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Monitoring with ID {monitoring_id} not found") from e
        raise e from None
    
    # Delete from database
    supabase.delete("monitorings", monitoring_id)
    return {"success": True, "message": f"Monitoring with ID {monitoring_id} deleted successfully"}
