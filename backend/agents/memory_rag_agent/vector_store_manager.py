import os
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import uuid
import logging

logger = logging.getLogger(__name__)

class VectorStoreManager:
    """
    Manages the connection to Qdrant Cloud.
    Stores enterprise policies, SLAs, and previous resolved claims as vector embeddings.
    """
    def __init__(self):
        # Using the Qdrant keys provided in .env
        self.qdrant_url = os.getenv("QDRANT_URL")
        self.qdrant_api_key = os.getenv("QDRANT_API_KEY")
        
        self.client = QdrantClient(
            url=self.qdrant_url, 
            api_key=self.qdrant_api_key
        )
        
        self.policy_collection = "enterprise_policies"
        self._ensure_collection_exists(self.policy_collection)

    def _ensure_collection_exists(self, collection_name: str):
        """Creates the collection if it doesn't exist (assuming 1536 dims for OpenAI embeddings)"""
        try:
            collections = self.client.get_collections().collections
            if not any(c.name == collection_name for c in collections):
                self.client.create_collection(
                    collection_name=collection_name,
                    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
                )
                logger.info(f"Created Qdrant collection: {collection_name}")
        except Exception as e:
            logger.error(f"Error checking/creating Qdrant collection: {e}")

    def insert_policy(self, text: str, embedding: list, metadata: dict):
        """Inserts a policy document into the vector database."""
        point_id = str(uuid.uuid4())
        
        # Include original text in payload so we can retrieve it
        payload = {"text": text}
        payload.update(metadata)
        
        self.client.upsert(
            collection_name=self.policy_collection,
            points=[PointStruct(id=point_id, vector=embedding, payload=payload)]
        )
        
    def search_policies(self, query_embedding: list, limit: int = 3) -> list:
        """Searches for relevant policies using vector similarity."""
        search_result = self.client.search(
            collection_name=self.policy_collection,
            query_vector=query_embedding,
            limit=limit
        )
        return [hit.payload for hit in search_result]
