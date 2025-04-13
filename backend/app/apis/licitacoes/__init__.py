from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel

# Import the models and functions from the bids API
from app.apis.bids import BidBase, BidCreate, BidUpdate, BidResponse, get_bids, get_bid, create_bid, update_bid, delete_bid

# Create a router for the licitacoes API
router = APIRouter(prefix="", tags=["licitacoes"])

# Get all licitacoes with optional filtering
@router.get("/licitacoes", response_model=List[BidResponse])
def get_licitacoes(
    limit: Optional[int] = Query(50, ge=1, le=100), 
    status: Optional[str] = None,
    orgao: Optional[str] = None,
    search: Optional[str] = None,
):
    """
    Get all licitações (bids) with optional filtering by status, organization, or search term.
    This endpoint is a wrapper around the /bids endpoint to provide a more domain-specific API.
    """
    return get_bids(limit=limit, status=status, orgao=orgao, search=search)

# Get a specific licitacao by ID
@router.get("/licitacoes/{licitacao_id}", response_model=BidResponse)
def get_licitacao(licitacao_id: int):
    """
    Get a specific licitação (bid) by its ID.
    This endpoint is a wrapper around the /bids/{bid_id} endpoint to provide a more domain-specific API.
    """
    return get_bid(bid_id=licitacao_id)
