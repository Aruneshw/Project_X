import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import agent_monitor
from services.kafka_streamer import streamer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start the Kafka background consumer loop
    logger.info("Starting up FastAPI. Initializing Kafka WebSocket Streamer...")
    streamer.start_background_task()
    yield
    # Shutdown: Stop the Kafka consumer
    logger.info("Shutting down FastAPI. Stopping Kafka Streamer...")
    streamer.stop_background_task()

app = FastAPI(title="CX Platform API", lifespan=lifespan)

# Allow CORS for the Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(agent_monitor.router, prefix="/api/monitor", tags=["Monitoring"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "CX Platform API is running"}
