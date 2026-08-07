"""
Enterprise CX Platform — FastAPI Main Entry Point
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from core.logging import setup_logging, get_logger
from database.redis.connection import init_redis, close_redis
from database.elasticsearch.connection import init_es, close_es
from database.vector_db.connection import vector_db

from api.routes import agent_monitor
from api.routes import claims
from api.routes import policies
from api.routes import auth
from services.kafka_streamer import streamer
from prometheus_fastapi_instrumentator import Instrumentator

setup_logging()
logger = get_logger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Databases and Kafka
    logger.info("Starting up FastAPI. Initializing services...")
    await init_redis()
    await init_es()
    vector_db.connect()
    
    streamer.start_background_task()
    yield
    # Shutdown: Close connections
    logger.info("Shutting down FastAPI. Stopping services...")
    streamer.stop_background_task()
    await close_redis()
    await close_es()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router, prefix="/api/v1/auth/admin", tags=["Admin Auth"])
app.include_router(agent_monitor.router, prefix="/api/monitor", tags=["Monitoring"])
app.include_router(claims.router, prefix="/api/v1/claims", tags=["Claims Orchestration"])
app.include_router(policies.router, prefix="/api/v1/policies", tags=["Policy Administration"])

# Add Prometheus Metrics Exporter
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "status": "online"
    }

@app.get(f"{settings.API_PREFIX}/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
