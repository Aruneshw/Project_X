import uuid
from typing import Dict, Any

class MockCRMClient:
    """
    Simulates an Enterprise CRM (Customer Relationship Management) system (e.g. Salesforce/Hubspot).
    """
    
    def get_customer_profile(self, customer_id: str) -> Dict[str, Any]:
        return {
            "customer_id": customer_id,
            "name": "Jane Doe",
            "email": "jane@example.com",
            "loyalty_tier": "Gold",
            "lifetime_value": 4500.00,
            "churn_risk": "low"
        }
        
    def log_interaction(self, customer_id: str, interaction_type: str, notes: str) -> str:
        interaction_id = str(uuid.uuid4())
        print(f"[CRM] Logged {interaction_type} for {customer_id}. ID: {interaction_id}")
        return interaction_id
