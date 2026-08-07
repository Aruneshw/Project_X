from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
from langchain_core.messages import HumanMessage
import random

# In a real environment, you would import the orchestrator:
# from backend.orchestrator.agent_orchestrator import AgentOrchestrator
# Since the LLM keys might not be present, we implement a self-healing mock that dynamically evaluates the text & image properties.

router = APIRouter()

class ClaimRequest(BaseModel):
    type: str
    order: str
    description: str
    image_b64: str = None
    invoice_b64: str = None

class ClaimResponse(BaseModel):
    claim_id: str
    status: str
    ai_score: int
    decision: str
    rationale: str
    policy_applied: str
    self_healing_action: str = None

@router.post("/process", response_model=ClaimResponse)
async def process_claim(request: ClaimRequest):
    claim_id = f"CLM-{random.randint(3000, 9999)}"
    
    desc_lower = request.description.lower()
    
    # 1. Simulate RAG Policy Retrieval
    policy = "Standard 30-day return policy applies."
    if "warranty" in desc_lower:
        policy = "Warranty Terms v1.8: Covers manufacturer defects for 1 year. Requires clear photographic evidence of structural failure."
    elif "shipping" in desc_lower or "late" in desc_lower:
        policy = "Delivery SLA Agreement v3.1: Refunds issued for delays exceeding 5 business days."
    
    # 2. Simulate CNN / RNN Object Detection & Fake Image analysis
    # If the description mentions "fake", or if the image size/properties indicate fabrication
    is_fake = "fake" in desc_lower or "stock" in desc_lower or (request.image_b64 and len(request.image_b64) < 100)
    
    # 3. Score Evaluation & Self-Healing Callback Logic
    ai_score = 92
    decision = "Refund"
    rationale = "Image validation passed CV segmentation. Intent aligns with standard refund policy."
    self_healing = None
    
    if is_fake:
        ai_score = 12
        decision = "Reject"
        rationale = "CNN Object Detection flagged the uploaded image as digitally fabricated (Replay/Moire pattern detected)."
        policy = "Anti-Fraud Policy v4.0: Fabricated evidence results in immediate claim denial."
        self_healing = "Please upload a genuine, live photograph using the WebRTC Camera Gate instead of a downloaded image."
    elif "blur" in desc_lower or "unclear" in desc_lower:
        ai_score = 55
        decision = "Escalate"
        rationale = "Image too blurry for definitive CV extraction. Esculating to human review."
        self_healing = "Your image was blurry. Would you like to re-take the photo now to expedite the process?"
        
    return ClaimResponse(
        claim_id=claim_id,
        status="Success",
        ai_score=ai_score,
        decision=decision,
        rationale=rationale,
        policy_applied=policy,
        self_healing_action=self_healing
    )
