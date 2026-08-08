import redis
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
import sys
import uuid

REDIS_URL = "redis://localhost:6379/0"
QDRANT_URL = "http://localhost:6333" # Using standard Qdrant port

def check_redis():
    print("Checking Redis connection...")
    try:
        r = redis.Redis.from_url(REDIS_URL, socket_timeout=2)
        r.ping()
        print("✅ Redis is running properly.")
        
        # Add duplicate data
        print("Adding sample session data to Redis...")
        r.set("session:user_123", "active")
        r.set("session:user_123_duplicate", "active")
        print("✅ Duplicate data added to Redis.")

        print("Adding RAG policy for electronics to Redis...")
        electronics_policy = """
Electronics Return & Replacement Policy:
- Mobile Phones: Eligible for return within 14 days if unboxed or damaged on delivery. Requires video proof of unboxing.
- Airbuds/Earphones: Eligible for replacement within 7 days if defective. No returns for hygiene reasons unless sealed.
- Chargers & Cables: 30-day replacement warranty for manufacturing defects. Not eligible for refund.
- Other Electronics: Standard 14-day return window, must include all original accessories and packaging.
        """
        r.set("rag_policy:electronics", electronics_policy.strip())
        print("✅ Electronics RAG policy added to Redis.")
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        print("Please ensure Redis is running (e.g. docker run -d -p 6379:6379 redis)")

def check_qdrant():
    print("\nChecking Qdrant (RAG Vector DB) connection...")
    try:
        client = QdrantClient(url=QDRANT_URL, timeout=3)
        collections = client.get_collections()
        print("✅ Qdrant is running properly.")
        
        collection_name = "cx_platform_knowledge"
        
        # Create collection if it doesn't exist
        try:
            client.get_collection(collection_name)
        except Exception:
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=3, distance=Distance.COSINE),
            )
            print(f"Created collection: {collection_name}")
            
        # Add duplicate policy data
        print("Adding duplicate policy vectors for RAG testing...")
        points = [
            PointStruct(id=1, vector=[0.1, 0.2, 0.3], payload={"policy": "Warranty v1.8", "duplicate": False}),
            PointStruct(id=2, vector=[0.1, 0.2, 0.3], payload={"policy": "Warranty v1.8 (Duplicate)", "duplicate": True}),
        ]
        client.upsert(
            collection_name=collection_name,
            points=points
        )
        print("✅ Duplicate policy data added to Qdrant.")
        
    except Exception as e:
        print(f"❌ Qdrant connection failed: {e}")
        print("Please ensure Qdrant is running (e.g. docker run -d -p 6333:6333 qdrant/qdrant)")

if __name__ == "__main__":
    print("=== Backend Database Verification ===\n")
    check_redis()
    check_qdrant()
    print("\n=== Verification Complete ===")
