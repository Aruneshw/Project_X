from fastapi import APIRouter
from pydantic import BaseModel
from integrations.crm.client import MockCRMClient
from integrations.erp.client import MockERPClient
from integrations.shipping.client import MockShippingClient
from agents.customer_interaction_agent.multilingual import MultilingualAgent

router = APIRouter(prefix="/integrations", tags=["External Integrations"])

crm_client = MockCRMClient()
erp_client = MockERPClient()
shipping_client = MockShippingClient()
multilingual_agent = MultilingualAgent()

class TranslationRequest(BaseModel):
    text: str

class TranslationResponse(BaseModel):
    original_text: str
    detected_language: str
    english_translation: str

@router.post("/translate")
async def translate_text(req: TranslationRequest) -> TranslationResponse:
    """
    Multilingual conversation integration. Detects language and translates to English.
    """
    result = multilingual_agent.process_incoming(req.text)
    return TranslationResponse(**result)

@router.get("/crm/customer/{customer_id}")
async def get_customer(customer_id: str):
    """
    Fetch enterprise CRM profile for a given customer.
    """
    return crm_client.get_customer_profile(customer_id)

@router.get("/erp/order/{order_id}")
async def get_order(order_id: str):
    """
    Fetch ERP order details including purchase date and pricing.
    """
    return erp_client.get_order_details(order_id)

@router.post("/shipping/return-label")
async def generate_return_label(order_id: str):
    """
    Generate a mock FedEx/UPS return label via the Logistics API.
    """
    return shipping_client.generate_return_label(order_id, {"address": "123 Main St, NY, USA"})
