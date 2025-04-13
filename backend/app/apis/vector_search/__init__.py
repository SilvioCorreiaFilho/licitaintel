import os
from typing import List, Optional

import httpx
import numpy as np
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.apis.supabase_helper import supabase

router = APIRouter(prefix="/vector-search", tags=["vector-search"])

# Pydantic models for vector search
class BidVectorBase(BaseModel):
    bid_id: int
    content: str
    embedding: Optional[List[float]] = None

class BidVectorResponse(BaseModel):
    bid_id: int
    content: str
    similarity: float

class SearchResult(BaseModel):
    results: List[BidVectorResponse]
    total: int

# OpenAI embedding model configuration
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "dummy_key_for_dev")
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 1536  # OpenAI text-embedding-3-small uses 1536 dimensions

# Initialize vector store in Supabase
def initialize_vector_store():
    """
    Initialize the vector store tables and extensions in Supabase.
    This only needs to be run once to set up the pgvector extension.
    """
    try:
        # Enable pgvector extension
        supabase.query("CREATE EXTENSION IF NOT EXISTS vector;")
        
        # Create bid_vectors table
        create_table_sql = f"""
        CREATE TABLE IF NOT EXISTS bid_vectors (
            id SERIAL PRIMARY KEY,
            bid_id INTEGER NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            embedding vector({EMBEDDING_DIMENSIONS}),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        """
        supabase.query(create_table_sql)
        
        # Create index for vector similarity search
        create_index_sql = """
        CREATE INDEX IF NOT EXISTS bid_vectors_embedding_idx 
        ON bid_vectors 
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
        """
        supabase.query(create_index_sql)
        
        return {"status": "success", "message": "Vector store initialized successfully"}
    except Exception as e:
        return {"status": "error", "message": f"Error initializing vector store: {str(e)}"}

# Function to generate embeddings using OpenAI
async def get_embedding(text: str) -> List[float]:
    """
    Get the embedding for a given text using OpenAI's API.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/embeddings",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "input": text,
                    "model": EMBEDDING_MODEL
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                # For development, return a random embedding if API call fails
                print(f"Error calling OpenAI API: {response.text}")
                if OPENAI_API_KEY == "dummy_key_for_dev":
                    # Return random embedding for development
                    return list(np.random.uniform(-1, 1, EMBEDDING_DIMENSIONS))
                raise HTTPException(status_code=500, detail=f"Error from OpenAI API: {response.text}")
            
            embedding = response.json()["data"][0]["embedding"]
            return embedding
    except Exception as e:
        # For development, return a random embedding if API call fails
        if OPENAI_API_KEY == "dummy_key_for_dev":
            return list(np.random.uniform(-1, 1, EMBEDDING_DIMENSIONS))
        raise HTTPException(status_code=500, detail=f"Error generating embedding: {str(e)}") from e

# Function to create bid vectors for all bids
@router.post("/index-bids")
async def index_bids():
    """
    Index all bids in the database by creating vector embeddings.
    This should be run after database initialization and whenever new bids are added.
    """
    try:
        # Initialize vector store first
        init_result = initialize_vector_store()
        
        # Get all bids that don't have vectors
        bids = supabase.select("bids")
        indexed_count = 0
        
        for bid in bids:
            # Check if this bid already has a vector
            existing = supabase.select("bid_vectors", filters={"bid_id": bid["id"]})
            
            if not existing:
                # Create content from bid fields for embedding
                content = f"{bid['title']} {bid['description'] or ''} {bid['objeto'] or ''} {bid['orgao']} {bid['modalidade']}"
                
                # Generate embedding
                embedding = await get_embedding(content)
                
                # Insert into bid_vectors table
                vector_data = {
                    "bid_id": bid["id"],
                    "content": content,
                    "embedding": embedding
                }
                
                supabase.insert("bid_vectors", vector_data)
                indexed_count += 1
        
        return {
            "status": "success", 
            "message": f"Successfully indexed {indexed_count} bids",
            "total_indexed": indexed_count,
            "total_bids": len(bids)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error indexing bids: {str(e)}") from e

# Endpoint for semantic search of bids
@router.get("/search", response_model=SearchResult)
async def search_bids(
    query: str = Query(..., min_length=2),
    limit: int = Query(10, ge=1, le=50),
    threshold: float = Query(0.6, ge=0, le=1)
):
    """
    Search bids using semantic vector similarity.
    """
    try:
        # Generate embedding for the query
        query_embedding = await get_embedding(query)
        
        # Query Supabase for similar vectors
        similarity_query = f"""
        SELECT 
            bv.bid_id, 
            bv.content,
            1 - (bv.embedding <=> $1) as similarity
        FROM 
            bid_vectors bv
        WHERE 
            1 - (bv.embedding <=> $1) > $2
        ORDER BY 
            similarity DESC
        LIMIT $3
        """
        
        variables = {
            "1": query_embedding,
            "2": threshold,
            "3": limit
        }
        
        results = supabase.query(similarity_query, variables)
        
        # Format results
        search_results = [
            BidVectorResponse(
                bid_id=result["bid_id"],
                content=result["content"],
                similarity=result["similarity"]
            )
            for result in results
        ]
        
        return SearchResult(results=search_results, total=len(search_results))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching bids: {str(e)}") from e

# Get bid details with similar bids
@router.get("/similar-bids/{bid_id}")
async def get_similar_bids(
    bid_id: int,
    limit: int = Query(5, ge=1, le=20)
):
    """
    Get bids similar to a specific bid.
    """
    try:
        # First check if the bid exists
        bid = supabase.select_by_id("bids", bid_id)
        
        # Check if this bid has a vector
        bid_vectors = supabase.select("bid_vectors", filters={"bid_id": bid_id})
        
        if not bid_vectors:
            # This bid hasn't been indexed yet, so create the vector
            content = f"{bid['title']} {bid['description'] or ''} {bid['objeto'] or ''} {bid['orgao']} {bid['modalidade']}"
            embedding = await get_embedding(content)
            
            vector_data = {
                "bid_id": bid["id"],
                "content": content,
                "embedding": embedding
            }
            
            bid_vector = supabase.insert("bid_vectors", vector_data)[0]
            embedding = bid_vector["embedding"]
        else:
            embedding = bid_vectors[0]["embedding"]
        
        # Find similar bids
        similarity_query = f"""
        SELECT 
            bv.bid_id, 
            b.title,
            b.orgao,
            b.modalidade,
            b.status,
            1 - (bv.embedding <=> $1) as similarity
        FROM 
            bid_vectors bv
        JOIN
            bids b ON bv.bid_id = b.id
        WHERE 
            bv.bid_id != $2
        ORDER BY 
            similarity DESC
        LIMIT $3
        """
        
        variables = {
            "1": embedding,
            "2": bid_id,
            "3": limit
        }
        
        similar_bids = supabase.query(similarity_query, variables)
        
        return {
            "bid": bid,
            "similar_bids": similar_bids
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting similar bids: {str(e)}") from e
