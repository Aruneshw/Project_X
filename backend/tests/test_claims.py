import pytest
import asyncio
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_claims_process_auto_resolve():
    payload = {
        "type": "Order Dispute",
        "order": "ORD-12345",
        "description": "The item was severely damaged upon arrival.",
        "image_b64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/...",  # length > 1000
        "video_b64": "object_detection_deep_scan",
        "invoice_name": "receipt_ORD-12345.pdf"
    }
    
    response = client.post("/api/v1/claims/process", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "claim_id" in data
    assert data["ai_score"] >= 80
    assert "Auto-Resolve" in data["decision"]

def test_claims_process_fraud():
    payload = {
        "type": "Refund Request",
        "order": "ORD-99999",
        "description": "I didn't receive it.",
        "image_b64": "short_fake_data",  # length < 1000 will trigger CV fraud
        "video_b64": "",
        "invoice_name": "fraud_invoice.pdf"
    }
    
    response = client.post("/api/v1/claims/process", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["ai_score"] < 50
    assert "Reject" in data["decision"]
