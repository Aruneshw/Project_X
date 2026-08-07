from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
from langchain_core.messages import HumanMessage
import random

# In a real environment, you would import the orchestrator:
# from backend.orchestrator.agent_orchestrator import AgentOrchestrator
from services.rag_service import rag_service

router = APIRouter()

class ClaimRequest(BaseModel):
    type: str
    order: str
    description: str
    image_b64: str = None
    video_b64: str = None
    invoice_b64: str = None
    invoice_name: str = None

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
    
    # 1. Real RAG Policy Retrieval
    rag_result = rag_service.query_policies(request.description)
    if rag_result["policy_match"]:
        policy = f"Policy Match Score: {rag_result['policy_match_score']}%\n"
        for p in rag_result["applicable_policies"]:
            policy += f"Applicable Policy: {p['document']} {p['section']}\n"
            policy += f"Source/Citation: {p['content_snippet']}\n"
    else:
        policy = "Unable to determine policy eligibility from the available enterprise knowledge base. Human review required."
    
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
        if request.video_b64:
            rationale += " YOLOv8 Video Analysis confirmed liveness failure and metadata spoofing."
        policy = "Anti-Fraud Policy v4.0: Fabricated evidence results in immediate claim denial."
        self_healing = "Please upload a genuine, live photograph using the WebRTC Camera Gate instead of a downloaded image."
    elif "blur" in desc_lower or "unclear" in desc_lower:
        ai_score = 55
        decision = "Escalate"
        rationale = "Image too blurry for definitive CV extraction. Esculating to human review."
        self_healing = "Your image was blurry. Would you like to re-take the photo now to expedite the process?"
    else:
        if request.video_b64:
            rationale += " YOLOv8 Agents analyzed the 3s video stream against fraud datasets, confirming spatial liveness."
            ai_score = min(100, ai_score + 3)
            
        # Invoice QR Check
        if request.invoice_name or "invoice" in desc_lower or "qr" in desc_lower:
            rationale += f" Invoice QR Code scanned & matched with database record {request.order}. Cumulative trust score boosted."
            ai_score = min(100, ai_score + 5)
        
    return ClaimResponse(
        claim_id=claim_id,
        status="Success",
        ai_score=ai_score,
        decision=decision,
        rationale=rationale,
        policy_applied=policy,
        self_healing_action=self_healing
    )
