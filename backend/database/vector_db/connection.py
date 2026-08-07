from qdrant_client import QdrantClient
from core.config import settings
from core.logging import get_logger

logger = get_logger("vector_db")

class VectorDBManager:
    def __init__(self):
        self.client = None
        self.collection_name = settings.VECTOR_DB_COLLECTION
        
    def connect(self):
        try:
            logger.info(f"Connecting to Qdrant at {settings.VECTOR_DB_URL}")
            # If the user is running Qdrant via Docker on localhost:6333
            # We map VECTOR_DB_URL to Qdrant format or just use memory/local for testing
            # Example uses memory if it fails, or tries the URL directly.
            self.client = QdrantClient(url=settings.VECTOR_DB_URL)
            logger.info("Successfully connected to Vector DB.")
        except Exception as e:
            logger.error(f"Vector DB connection failed: {e}. Falling back to in-memory Qdrant.")
            self.client = QdrantClient(":memory:")

vector_db = VectorDBManager()

def get_vector_db():
    """Dependency for FastAPI to get Vector DB connection."""
    if not vector_db.client:
        vector_db.connect()
    return vector_db.client
