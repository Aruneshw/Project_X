import asyncio
import json
import logging
from aiokafka import AIOKafkaConsumer
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class KafkaWebsocketStreamer:
    """
    Consumes events from Kafka and broadcasts them to connected WebSocket clients.
    """
    def __init__(self, bootstrap_servers="localhost:9092", topic="agent-events"):
        self.bootstrap_servers = bootstrap_servers
        self.topic = topic
        self.consumer = None
        self.active_connections: list[WebSocket] = []
        self._task = None

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket Client connected. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info("WebSocket Client disconnected.")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to send to websocket: {e}")
                self.disconnect(connection)

    async def start_kafka_consumer(self):
        """Starts the aiokafka consumer loop as a background task."""
        try:
            self.consumer = AIOKafkaConsumer(
                self.topic,
                bootstrap_servers=self.bootstrap_servers,
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                group_id="cx-websocket-group"
            )
            await self.consumer.start()
            logger.info(f"Kafka Consumer started, listening to topic: {self.topic}")
            
            async for msg in self.consumer:
                # When a message arrives from Kafka, broadcast it to all WebSocket clients
                logger.debug(f"Received Kafka event: {msg.value}")
                await self.broadcast(msg.value)
                
        except Exception as e:
            logger.error(f"Kafka Consumer error: {e}")
        finally:
            if self.consumer:
                await self.consumer.stop()

    def start_background_task(self):
        """Spawns the consumer in the asyncio event loop."""
        self._task = asyncio.create_task(self.start_kafka_consumer())

    def stop_background_task(self):
        if self._task:
            self._task.cancel()

# Global singleton instance
streamer = KafkaWebsocketStreamer()
