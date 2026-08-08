import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_rag_chat_endpoint():
    payload = {
        "query": "What is the return policy?",
        "order_id": "ORD-12345"
    }
    
    response = client.post("/api/v1/rag/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "sources" in data
    assert data["status"] == "success"

def test_rag_reindex():
    response = client.post("/api/v1/rag/reindex")
    assert response.status_code == 200
    assert response.json()["status"] == "success"
