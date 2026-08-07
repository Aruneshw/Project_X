from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.kafka_streamer import streamer

router = APIRouter()

@router.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for the frontend to receive real-time Kafka events.
    The Multi-Agent Monitoring Console connects here.
    """
    await streamer.connect(websocket)
    try:
        while True:
            # We don't expect messages from the client right now, just keeping connection open.
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        streamer.disconnect(websocket)
