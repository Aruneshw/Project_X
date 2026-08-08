import uuid
from typing import Dict, Any

class MockERPClient:
    """
    Simulates an Enterprise Resource Planning system (e.g. SAP/Oracle).
    """
    
    def get_order_details(self, order_id: str) -> Dict[str, Any]:
        return {
            "order_id": order_id,
            "status": "delivered",
            "purchase_date": "2026-08-01T10:00:00Z",
            "total_amount": 1299.00,
            "items": [
                {"sku": "LAPTOP-X1", "name": "ThinkPad X1", "price": 1299.00}
            ]
        }
        
    def process_refund(self, order_id: str, amount: float, reason: str) -> str:
        transaction_id = f"REF-{uuid.uuid4().hex[:8].upper()}"
        print(f"[ERP] Processed refund of ${amount} for order {order_id}. Trans: {transaction_id}")
        return transaction_id
