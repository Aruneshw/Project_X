import uuid
import random
from typing import Dict, Any

class MockShippingClient:
    """
    Simulates a Logistics/Shipping API (e.g. FedEx/UPS API).
    """
    
    def generate_return_label(self, order_id: str, address: Dict[str, str]) -> Dict[str, str]:
        tracking_number = f"1Z{random.randint(1000000000000000, 9999999999999999)}"
        label_url = f"https://shipping.cxplatform.internal/labels/{tracking_number}.pdf"
        
        print(f"[SHIPPING] Generated return label for {order_id}. Tracking: {tracking_number}")
        
        return {
            "tracking_number": tracking_number,
            "label_url": label_url,
            "carrier": "UPS",
            "status": "label_created"
        }
        
    def get_shipment_status(self, tracking_number: str) -> str:
        statuses = ["in_transit", "delivered", "exception", "label_created"]
        return random.choice(statuses)
