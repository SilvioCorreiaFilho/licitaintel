import json
import os
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Union

import databutton as db
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Define the API router
router = APIRouter()

class SupabaseConfig(BaseModel):
    url: str
    anon_key: str

@router.get("/supabase-config")
def get_supabase_config() -> SupabaseConfig:
    """Get Supabase configuration for frontend authentication."""
    try:
        # Get Supabase URL and anon key from secrets
        url = db.secrets.get("SUPABASE_URL")
        anon_key = db.secrets.get("SUPABASE_ANON_KEY")
        
        # Verify they exist and have expected format
        if not url or not url.startswith("https://"):
            raise HTTPException(status_code=500, detail="Invalid Supabase URL configuration")
            
        if not anon_key or not anon_key.startswith("ey"):
            raise HTTPException(status_code=500, detail="Invalid Supabase anonymous key format")
        
        return SupabaseConfig(url=url, anon_key=anon_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve Supabase configuration: {str(e)}")


# Supabase configuration
SUPABASE_URL = "https://nwuduzhrrhmjlwigabex.supabase.co"

# Safe way to get the secret with fallback
try:
    SUPABASE_KEY = db.secrets.get("SUPABASE_SERVICE_KEY")
    print("Successfully loaded SUPABASE_SERVICE_KEY from secrets")
except Exception as e:
    print(f"Warning: Error accessing SUPABASE_SERVICE_KEY: {e}")
    # Use anonymous key as fallback (read-only)
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dWR1emhycmhtamx3aWdhYmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDk5OTksImV4cCI6MjA1OTg4NTk5OX0.mpgy-WI8z3GkI5tXwAB5UGICGiWzkuEUsWc4Dygf8cA"
    print("Using anonymous key instead")

# Postgres API headers
POSTGREST_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

class SupabaseClient:
    def __init__(self):
        self.url = SUPABASE_URL
        self.key = SUPABASE_KEY
        self.headers = POSTGREST_HEADERS
        
        # Configure httpx client with better error handling and connection management
        self.client = httpx.Client(
            timeout=httpx.Timeout(connect=5.0, read=30.0, write=30.0, pool=5.0),
            limits=httpx.Limits(max_keepalive_connections=5, max_connections=10),
            # http2=True,  # Removed HTTP/2 support to avoid dependency issues
            follow_redirects=True
        )

    def _handle_response(self, response):
        """Handle the API response, raising exceptions for non-200 responses.
        
        Provides detailed error information including the request URL and method.
        
        Args:
            response: The httpx response object
            
        Returns:
            Parsed JSON response
            
        Raises:
            HTTPException: If the response status code is 400 or higher
        """
        if response.status_code >= 400:
            # Extract request details for better debugging
            req_url = str(response.request.url) if response.request else "Unknown URL"
            req_method = response.request.method if response.request else "Unknown method"
            
            # Try to parse error response as JSON
            try:
                error_json = response.json()
                error_detail = error_json.get('message', error_json.get('error', error_json))
            except Exception:
                error_detail = response.text
                
            # Create detailed error message
            error_msg = f"Supabase API error: {response.status_code} - {error_detail} | {req_method} {req_url}"
            print(error_msg)
            
            # Return appropriate HTTP exception with context
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail=f"Resource not found: {req_url}")
            elif response.status_code == 403:
                raise HTTPException(status_code=403, detail="Permission denied. Check your Supabase API key permissions.")
            elif response.status_code == 401:
                raise HTTPException(status_code=401, detail="Authentication failed. Check your Supabase API key.")
            elif response.status_code == 409:
                raise HTTPException(status_code=409, detail="Conflict with existing data. The operation would violate constraints.")
            else:
                raise HTTPException(status_code=response.status_code, detail=error_msg)
                
        return response.json()

    def select(self, table: str, select: str = "*", filters: Optional[Dict] = None, limit: Optional[int] = None, offset: Optional[int] = None, order: Optional[str] = None) -> List[Dict]:
        """Select data from a table with optional filters, pagination and ordering.
        
        Args:
            table: The name of the table to select from
            select: The columns to select (comma-separated)
            filters: Dictionary of column-value pairs for filtering
            limit: Maximum number of rows to return
            offset: Number of rows to skip
            order: Column to order by, e.g. "created_at.desc" or "id.asc"
            
        Returns:
            List of dictionaries representing the rows
        """
        url = f"{self.url}/rest/v1/{table}?select={select}"
        
        # Add filters
        if filters:
            for key, value in filters.items():
                operator = "eq"
                if isinstance(value, str) and value.startswith("like."):
                    operator = "like"
                    value = value[5:]  # Remove 'like.' prefix
                url += f"&{key}={operator}.{value}"
        
        # Add pagination
        if limit is not None:
            url += f"&limit={limit}"
        if offset is not None:
            url += f"&offset={offset}"
        
        # Add ordering
        if order:
            url += f"&order={order}"
        
        try:
            response = self.client.get(url, headers=self.headers)
            return self._handle_response(response)
        except Exception as e:
            print(f"Error selecting from {table}: {e}")
            raise

    def select_by_id(self, table: str, id_value: Union[str, int], select: str = "*") -> Dict:
        """Select a single row by ID."""
        url = f"{self.url}/rest/v1/{table}?id=eq.{id_value}&select={select}"
        response = self.client.get(url, headers=self.headers)
        result = self._handle_response(response)
        if not result:
            raise HTTPException(status_code=404, detail=f"Item with id {id_value} not found in {table}")
        return result[0]

    def insert(self, table: str, data: Union[Dict, List[Dict]]) -> Dict:
        """Insert data into a table."""
        url = f"{self.url}/rest/v1/{table}"
        response = self.client.post(url, headers=self.headers, json=data)
        return self._handle_response(response)

    def update(self, table: str, id_value: Union[str, int], data: Dict) -> Dict:
        """Update data in a table."""
        url = f"{self.url}/rest/v1/{table}?id=eq.{id_value}"
        response = self.client.patch(url, headers=self.headers, json=data)
        result = self._handle_response(response)
        if not result:
            raise HTTPException(status_code=404, detail=f"Item with id {id_value} not found in {table}")
        return result[0]

    def delete(self, table: str, id_value: Union[str, int]) -> Dict:
        """Delete data from a table."""
        url = f"{self.url}/rest/v1/{table}?id=eq.{id_value}"
        response = self.client.delete(url, headers=self.headers)
        if response.status_code == 204:
            return {"success": True}
        return self._handle_response(response)

    def query(self, query: str, variables: Optional[Dict] = None) -> Dict:
        """Get information about database schema.
        
        This is a replacement for direct SQL execution which isn't available
        without creating a custom RPC function in Supabase.
        
        The method now queries information_schema instead of trying to use
        a custom RPC function that doesn't exist.
        
        Args:
            query: SQL-like query string (will actually query information_schema)
            variables: Optional variables for parameterized queries (not used)
            
        Returns:
            List of table information or empty list
        """
        try:
            # Extract table info from information_schema
            if "information_schema.tables" in query.lower():
                url = f"{self.url}/rest/v1/information_schema/tables?select=table_name,table_schema"
                # Only get public tables
                url += "&table_schema=eq.public"
                response = self.client.get(url, headers=self.headers)
                return self._handle_response(response)
                
            # For all other queries, we return limited information
            print(f"WARNING: Direct SQL execution is not supported. Query was: {query}")
            if "select table_name" in query.lower() and "information_schema.tables" in query.lower():
                # Try to use the REST API to list tables
                url = f"{self.url}/rest/v1/information_schema/tables?select=table_name&table_schema=eq.public"
                response = self.client.get(url, headers=self.headers)
                return self._handle_response(response)
            
            # Fallback for when we can't execute the query
            return []
        except Exception as e:
            print(f"Error executing query: {e}")
            # Return empty result instead of failing
            return []
        
    def close(self):
        """Close the HTTP client and release resources.
        
        This method should be called when the client is no longer needed,
        typically at application shutdown.
        """
        if self.client:
            try:
                self.client.close()
                print("Supabase HTTP client closed successfully")
            except Exception as e:
                print(f"Error closing Supabase HTTP client: {e}")
                
    def __del__(self):
        """Destructor to ensure client is closed when the object is garbage collected."""
        self.close()

# Create a singleton instance for reuse
supabase = SupabaseClient()

# Database table requirements and checking
"""
NOTE: The following tables must exist in Supabase:

1. bids - Stores bid information
2. monitorings - Stores monitoring configurations
3. price_history - Stores historical price data
4. price_projections - Stores price projections
5. profiles - Stores user profiles

See the Supabase SQL Editor to create these tables if they don't exist.
"""

def check_table_exists(table_name: str) -> bool:
    """Check if a table exists in the Supabase database by attempting to query it.
    
    This method tries to select a single row from the table rather than
    querying information_schema, which is more reliable with Supabase's
    permission system.
    
    Args:
        table_name: The name of the table to check
        
    Returns:
        True if the table exists, False otherwise
    """
    try:
        # Try to select a single row from the table with a simple query
        url = f"{supabase.url}/rest/v1/{table_name}?limit=1"
        response = supabase.client.get(url, headers=supabase.headers)
        
        # We consider a table to exist if we get a 200 OK response or a 400/406
        # which might happen if the query is invalid but the table exists
        if response.status_code in [200, 206, 400, 406]:
            print(f"Table '{table_name}' exists")
            return True
            
        # 404 means the table doesn't exist
        if response.status_code == 404:
            print(f"Table '{table_name}' does not exist")
            return False
            
        # For any other status code, we check more carefully
        try:
            error_json = response.json()
            error_message = error_json.get('message', str(error_json))
            # If the error doesn't mention table not found, assume table exists but has permission issues
            if 'not found' not in error_message.lower() and 'does not exist' not in error_message.lower():
                print(f"Table '{table_name}' likely exists but has permission issues: {error_message}")
                return True
        except Exception:
            # If we can't parse the error, assume table doesn't exist
            pass
            
        print(f"Table '{table_name}' does not exist or is not accessible: {response.status_code}")
        return False
    except Exception as e:
        print(f"Error checking if table '{table_name}' exists: {e}")
        return False

def check_database_tables() -> Dict[str, List[str]]:
    """Check if all required tables exist in the database.
    
    Returns:
        Dictionary with 'existing' and 'missing' lists of table names
    """
    required_tables = ["bids", "monitorings", "price_history", "price_projections", "profiles"]
    existing_tables = []
    missing_tables = []
    
    for table in required_tables:
        if check_table_exists(table):
            existing_tables.append(table)
        else:
            missing_tables.append(table)
    
    if missing_tables:
        print(f"WARNING: Missing tables: {', '.join(missing_tables)}")
        print("Please create these tables in Supabase using the SQL Editor")
    else:
        print("All required tables exist")
    
    return {
        "existing": existing_tables,
        "missing": missing_tables
    }

# Helper functions for sample data creation
def create_sample_bids():
    """Create and insert sample bids data.
    
    NOTE: The bids table must exist before calling this function.
    """
    # First check if the table exists
    if not check_table_exists("bids"):
        print("ERROR: Cannot create sample bids because the bids table does not exist")
        return False
        
    # Sample bids data
    sample_bids = [
        {
            "title": "Aquisição de Equipamentos de Informática",
            "description": "Compra de computadores e impressoras para o departamento de saúde.",
            "orgao": "Ministério da Saúde",
            "data_abertura": "2025-01-15T10:00:00Z",
            "data_encerramento": "2025-01-30T18:00:00Z",
            "valor_estimado": 75000.50,
            "modalidade": "Pregão Eletrônico",
            "status": "aberta",
            "numero_processo": "MS-2025-0123",
            "objeto": "Aquisição de computadores e impressoras para melhorar a infraestrutura de TI do departamento de saúde pública.",
            "link_edital": "https://comprasnet.gov.br/edital/MS-2025-0123"
        },
        {
            "title": "Serviços de Manutenção Predial",
            "description": "Contratação de empresa especializada em manutenção predial para o Tribunal Regional Federal.",
            "orgao": "Tribunal Regional Federal da 4ª Região",
            "data_abertura": "2025-02-10T14:00:00Z",
            "data_encerramento": "2025-02-28T18:00:00Z",
            "valor_estimado": 150000.00,
            "modalidade": "Concorrência",
            "status": "aberta",
            "numero_processo": "TRF4-2025-0045",
            "objeto": "Contratação de serviços contínuos de manutenção predial preventiva e corretiva para as instalações do Tribunal Regional Federal da 4ª Região.",
            "link_edital": "https://comprasnet.gov.br/edital/TRF4-2025-0045"
        },
        {
            "title": "Fornecimento de Material de Escritório",
            "description": "Fornecimento contínuo de material de escritório para o Ministério da Educação.",
            "orgao": "Ministério da Educação",
            "data_abertura": "2025-01-20T09:00:00Z",
            "data_encerramento": "2025-02-05T18:00:00Z",
            "valor_estimado": 42000.75,
            "modalidade": "Pregão Eletrônico",
            "status": "aberta",
            "numero_processo": "MEC-2025-0078",
            "objeto": "Fornecimento contínuo de materiais de escritório, papelaria e afins para atender as necessidades administrativas do Ministério da Educação.",
            "link_edital": "https://comprasnet.gov.br/edital/MEC-2025-0078"
        },
        {
            "title": "Construção de Escola Municipal",
            "description": "Construção de escola municipal de ensino fundamental no município de Curitiba.",
            "orgao": "Prefeitura Municipal de Curitiba",
            "data_abertura": "2025-03-05T10:00:00Z",
            "data_encerramento": "2025-03-30T18:00:00Z",
            "valor_estimado": 2500000.00,
            "modalidade": "Concorrência Pública",
            "status": "aberta",
            "numero_processo": "PMC-2025-0012",
            "objeto": "Execução de obras de construção de escola municipal de ensino fundamental com 12 salas de aula, laboratório de informática, biblioteca e quadra poliesportiva coberta no bairro Portão, Curitiba/PR.",
            "link_edital": "https://comprasnet.gov.br/edital/PMC-2025-0012"
        },
        {
            "title": "Aquisição de Medicamentos",
            "description": "Compra de medicamentos para a rede municipal de saúde.",
            "orgao": "Secretaria Municipal de Saúde de São Paulo",
            "data_abertura": "2025-01-10T09:00:00Z",
            "data_encerramento": "2025-01-25T18:00:00Z",
            "valor_estimado": 350000.00,
            "modalidade": "Pregão Eletrônico",
            "status": "encerrada",
            "numero_processo": "SMSSP-2025-0034",
            "objeto": "Aquisição de medicamentos antihipertensivos, antidiabéticos e antilípídicos para abastecimento das unidades básicas de saúde do município de São Paulo.",
            "link_edital": "https://comprasnet.gov.br/edital/SMSSP-2025-0034"
        }
    ]
    
    try:
        for bid in sample_bids:
            try:
                # Try to insert directly - if table doesn't exist, this might create it
                supabase.insert("bids", bid)
                print(f"Inserted bid: {bid['title']}")
            except Exception as e:
                print(f"Error inserting bid {bid['title']}: {e}")
        print("Sample bids processing complete")
    except Exception as e:
        print(f"Error processing sample bids: {e}")

def create_sample_price_history():
    """Create and insert sample price history data.
    
    NOTE: The price_history table must exist before calling this function.
    """
    # First check if the table exists
    if not check_table_exists("price_history"):
        print("ERROR: Cannot create sample price history because the price_history table does not exist")
        return False
        
    # Sample price history data
    sample_price_history = [
        {
            "codigo_item": "TI-PC-001",
            "descricao_item": "Computador Desktop i5 16GB RAM 512GB SSD",
            "data_licitacao": "2024-11-10T00:00:00Z",
            "orgao": "Ministério da Saúde",
            "valor_unitario": 4800.00,
            "quantidade": 50,
            "vencedor": "Tech Solutions Ltda",
            "regiao": "Sudeste",
            "uf": "SP"
        },
        {
            "codigo_item": "TI-PC-001",
            "descricao_item": "Computador Desktop i5 16GB RAM 512GB SSD",
            "data_licitacao": "2024-08-15T00:00:00Z",
            "orgao": "Tribunal Regional Federal",
            "valor_unitario": 5100.00,
            "quantidade": 30,
            "vencedor": "Informática Brasil S.A.",
            "regiao": "Sul",
            "uf": "PR"
        },
        {
            "codigo_item": "TI-PC-001",
            "descricao_item": "Computador Desktop i5 16GB RAM 512GB SSD",
            "data_licitacao": "2024-05-20T00:00:00Z",
            "orgao": "Ministério da Educação",
            "valor_unitario": 4950.00,
            "quantidade": 100,
            "vencedor": "Tech Solutions Ltda",
            "regiao": "Centro-Oeste",
            "uf": "DF"
        },
        {
            "codigo_item": "TI-IMP-002",
            "descricao_item": "Impressora Multifuncional Laser Colorida",
            "data_licitacao": "2024-10-05T00:00:00Z",
            "orgao": "Ministério da Saúde",
            "valor_unitario": 2300.00,
            "quantidade": 20,
            "vencedor": "Office Supplies Brasil",
            "regiao": "Sudeste",
            "uf": "SP"
        },
        {
            "codigo_item": "TI-IMP-002",
            "descricao_item": "Impressora Multifuncional Laser Colorida",
            "data_licitacao": "2024-07-12T00:00:00Z",
            "orgao": "Prefeitura Municipal de Porto Alegre",
            "valor_unitario": 2450.00,
            "quantidade": 15,
            "vencedor": "Tech Print Ltda",
            "regiao": "Sul",
            "uf": "RS"
        }
    ]
    
    try:
        for item in sample_price_history:
            try:
                # Try to insert directly
                supabase.insert("price_history", item)
                print(f"Inserted price history for item: {item['codigo_item']}")
            except Exception as e:
                print(f"Error inserting price history for {item['codigo_item']}: {e}")
        print("Sample price history processing complete")
    except Exception as e:
        print(f"Error processing sample price history: {e}")

# Function to initialize database
def initialize_database():
    """Check database tables and insert sample data if possible."""
    # Check which tables exist
    table_status = check_database_tables()
    
    # Only insert sample data if the tables exist
    if "bids" in table_status["existing"]:
        create_sample_bids()
    
    if "price_history" in table_status["existing"]:
        create_sample_price_history()
    
    # Return appropriate status message
    if table_status["missing"]:
        return {
            "status": "Incomplete database initialization",
            "message": f"Missing tables: {', '.join(table_status['missing'])}",
            "note": "Please create missing tables in Supabase using the SQL Editor."
        }
    else:
        return {"status": "Database initialized successfully"}

