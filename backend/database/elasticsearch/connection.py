from elasticsearch import AsyncElasticsearch
from core.config import settings
from core.logging import get_logger

logger = get_logger("elasticsearch")
es_client = None

async def init_es():
    global es_client
    logger.info(f"Connecting to Elasticsearch at {settings.ELASTICSEARCH_URL}")
    es_client = AsyncElasticsearch(settings.ELASTICSEARCH_URL)
    try:
        if await es_client.ping():
            logger.info("Successfully connected to Elasticsearch.")
        else:
            logger.warning("Elasticsearch ping failed, but client created.")
    except Exception as e:
        logger.error(f"Elasticsearch connection failed: {e}")

async def close_es():
    global es_client
    if es_client:
        logger.info("Closing Elasticsearch connection...")
        await es_client.close()

def get_es():
    """Dependency for FastAPI to get Elasticsearch connection."""
    return es_client
