from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.apis.supabase_helper import (
    initialize_database,
    check_database_tables,  # Replaced create_tables with check_database_tables
    create_sample_bids,
    create_sample_price_history,
    supabase
)

router = APIRouter(prefix="/db-management", tags=["db-management"])

class DatabaseStatusResponse(BaseModel):
    status: str
    message: str
    tables: list

@router.get("/status", response_model=DatabaseStatusResponse)
def get_db_status():
    """
    Get the current status of the database.
    """
    try:
        # Check database tables status directly with our helper function
        table_status = check_database_tables()
        
        return {
            "status": "connected",
            "message": f"Successfully connected to database. Found {len(table_status['existing'])} tables.",
            "tables": table_status['existing']
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error connecting to database: {str(e)}",
            "tables": []
        }

@router.post("/init")
def init_database():
    """
    Check database tables and report which ones exist and which are missing.
    This endpoint is safe to call multiple times.
    """
    try:
        # Check which tables exist
        table_status = check_database_tables()
        
        if table_status["missing"]:
            return {
                "status": "warning",
                "message": f"Some required tables are missing: {', '.join(table_status['missing'])}",
                "existing_tables": table_status["existing"],
                "missing_tables": table_status["missing"]
            }
        else:
            return {
                "status": "success", 
                "message": "All required database tables exist.",
                "existing_tables": table_status["existing"],
                "missing_tables": []
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking database tables: {str(e)}") from e

@router.post("/sample-data")
def load_sample_data():
    """
    Load sample data into the database.
    This endpoint is safe to call multiple times - it will not create duplicates.
    """
    try:
        # Call individual sample data creation functions
        create_sample_bids()
        create_sample_price_history()
        return {"status": "success", "message": "Sample data loaded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading sample data: {str(e)}") from e

@router.post("/full-init")
def full_initialization():
    """
    Initialize the database schema and load sample data.
    This is a convenience endpoint that combines checking tables and loading sample data.
    """
    try:
        # Initialize database and get the result
        init_result = initialize_database()
        
        # Load sample data if initialization was successful
        if init_result.get("status") == "Incomplete database initialization":
            return {
                "status": "warning",
                "message": init_result.get("message", "Some tables are missing"),
                "note": init_result.get("note", "Please check database configuration"),
                "details": init_result
            }
            
        # Try to load sample data regardless of missing tables
        # This will automatically skip tables that don't exist
        try:
            create_sample_bids()
            create_sample_price_history()
            sample_data_msg = "Sample data loaded successfully."
        except Exception as sample_error:
            sample_data_msg = f"Warning: Could not load all sample data: {str(sample_error)}"
        
        return {
            "status": "success", 
            "message": f"Database initialization completed. {sample_data_msg}",
            "details": init_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in full initialization: {str(e)}") from e
