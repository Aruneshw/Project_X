"""
Enterprise CX Platform - Database Router
Clearly defines the architectural boundaries and responsibilities of the 4 independent databases.
"""
from typing import Dict, Any
from enum import Enum

from .postgres.connection import get_db, AsyncSessionLocal
from .redis.connection import get_redis
from .elasticsearch.connection import get_es
from .vector_db.connection import get_vector_db

class DatabaseRole(Enum):
    RELATIONAL_STATE = "POSTGRES"       # User Data, Order History, Claim Status (Core Truth)
    SEMANTIC_MEMORY = "VECTOR_DB"       # RAG, Enterprise Policies, Unstructured Context
    VOLATILE_CACHE = "REDIS"            # Rate Limiting, Live Agent States, WebSocket Locks
    CENTRAL_ANALYTICS = "ELASTICSEARCH" # Unified Analytics, Multi-Agent Audit Logs

class DatabaseRouter:
    """
    Central router that provides the correct database connection 
    based on the domain of the data being accessed.
    """
    
    @staticmethod
    def get_user_history_db():
        """Returns Postgres Session for structured User Data and Claim History"""
        return AsyncSessionLocal()
        
    @staticmethod
    def get_rag_db():
        """Returns Qdrant/FAISS Client for Policy Knowledge Base"""
        return get_vector_db()
        
    @staticmethod
    def get_live_state_db():
        """Returns Redis Client for volatile session/agent state"""
        return get_redis()
        
    @staticmethod
    def get_analytics_db():
        """Returns Elasticsearch Client for the central analysis pool"""
        return get_es()

router = DatabaseRouter()
