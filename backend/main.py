"""
Enterprise CX Platform — FastAPI Main Entry Point
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.core.logging import setup_logging, get_logger

from api.routes import agent_monitor
from services.kafka_streamer import streamer

setup_logging()
logger = get_logger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start the Kafka background consumer loop
    logger.info("Starting up FastAPI. Initializing Kafka WebSocket Streamer...")
    streamer.start_background_task()
    yield
    # Shutdown: Stop the Kafka consumer
    logger.info("Shutting down FastAPI. Stopping Kafka Streamer...")
    streamer.stop_background_task()

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
app.include_router(agent_monitor.router, prefix="/api/monitor", tags=["Monitoring"])

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
