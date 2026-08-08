from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import uuid
import random
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from database.postgres.connection import get_db
from services.rag_service import rag_service
from services.analytics_service import analytics_service
from models.user_history import UserHistory
import uuid

from agents.resolution_strategy_agent.calculator import ResolutionCalculator
from agents.resolution_strategy_agent.negotiation import NegotiationAgent
from orchestrator.agent_orchestrator import AgentOrchestrator

try:
    from agents.evidence_verification_agent.ocr_extractor import OCRExtractor
    ocr_extractor = OCRExtractor(use_gpu=False)
except ImportError:
    ocr_extractor = None

try:
    from pipelines.cv_pipeline import CVPipeline
    cv_pipeline = CVPipeline()
except ImportError as e:
    print(f"Failed to load CVPipeline: {e}")
    cv_pipeline = None

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
    negotiation_offer: str = None

# Instantiate stateless agents and orchestrator
negotiation_agent = NegotiationAgent()
orchestrator = AgentOrchestrator()

@router.post("/process", response_model=ClaimResponse)
async def process_claim(request: ClaimRequest, session: AsyncSession = Depends(get_db)):
    claim_id = f"CLM-{random.randint(3000, 9999)}"
    desc_lower = request.description.lower()
    
    # Execute the unified LangGraph orchestrator
    initial_state = {
        "claim_id": claim_id,
        "order_id": request.order,
        "description": request.description,
        "image_b64": request.image_b64,
        "invoice_b64": request.invoice_b64,
        "db_verified": False,
        "fraud_score": 0,
        "ocr_match": False,
        "policy_context": "",
        "clv_data": {},
        "final_decision": "Pending",
        "rationale": "",
        "refund_amount": 0.0,
        "self_healing_action": None
    }
    
    final_state = await orchestrator.run_claim(initial_state)
    
    # Negotiation Agent (Emotion Aware)
    # Detect basic sentiment from description
    sentiment = "frustrated" if "angry" in desc_lower or "frustrat" in desc_lower or "unacceptable" in desc_lower else "neutral"
    
    # We only negotiate if a refund was offered
    negotiation_offer = None
    if final_state.get("refund_amount", 0.0) > 0:
        negotiation_offer = negotiation_agent.generate_offer(
            clv_data=final_state.get("clv_data", {}),
            sentiment=sentiment,
            base_refund=final_state.get("refund_amount", 0.0)
        )
    
    # Push unified data to Analytics
    asyncio.create_task(
        analytics_service.log_claim_analysis(
            claim_id=claim_id,
            user_id="customer_123",
            ai_score=final_state.get("fraud_score", 0),
            decision=final_state.get("final_decision", ""),
            policy_applied=final_state.get("policy_context", "Standard Policy")
        )
    )
    
    # Store history in Supabase table
    user_uuid = uuid.uuid4()
    new_history = UserHistory(
        user_id=user_uuid,
        claim_id=claim_id,
        issue_type=request.type,
        description=request.description,
        ai_score=final_state.get("fraud_score", 0),
        status=final_state.get("final_decision", "")
    )
    session.add(new_history)
    try:
        await session.commit()
    except Exception as e:
        await session.rollback()
        print(f"Failed to save to user_history: {e}")
    
    return ClaimResponse(
        claim_id=claim_id,
        status="Success",
        ai_score=final_state.get("fraud_score", 0),
        decision=final_state.get("final_decision", ""),
        rationale=final_state.get("rationale", ""),
        policy_applied=final_state.get("policy_context", ""),
        self_healing_action=final_state.get("self_healing_action"),
        negotiation_offer=negotiation_offer
    )

from sqlalchemy import select

@router.get("/history")
async def get_claim_history(session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(UserHistory))
    history = result.scalars().all()
    return {
        "history": [
            {
                "id": str(h.id),
                "user_id": str(h.user_id),
                "claim_id": h.claim_id,
                "issue_type": h.issue_type,
                "description": h.description,
                "ai_score": h.ai_score,
                "status": h.status
            }
            for h in history
        ]
    }
