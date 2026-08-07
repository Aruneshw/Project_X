import redis.asyncio as redis
from core.config import settings
from core.logging import get_logger

logger = get_logger("redis")
redis_client = None

async def init_redis():
    global redis_client
    logger.info(f"Connecting to Redis at {settings.REDIS_URL}")
    redis_client = redis.from_url(
        settings.REDIS_URL,
        decode_responses=True,
        encoding="utf-8"
    )
    # Ping to check connection
    try:
        await redis_client.ping()
        logger.info("Successfully connected to Redis.")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")

async def close_redis():
    global redis_client
    if redis_client:
        logger.info("Closing Redis connection...")
        await redis_client.close()

def get_redis():
    """Dependency for FastAPI to get Redis connection."""
    return redis_client
