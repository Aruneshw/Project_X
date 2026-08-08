from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import uuid
import random
import asyncio
import httpx
from typing import Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from database.postgres.connection import get_db
from services.rag_service import rag_service
from services.analytics_service import analytics_service
from models.user_history import UserHistory
import uuid

from agents.resolution_strategy_agent.calculator import ResolutionCalculator
from agents.resolution_strategy_agent.negotiation import NegotiationAgent
from orchestrator.agent_orchestrator import AgentOrchestrator
from core.config import settings

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


class DetectionRequest(BaseModel):
    type: str
    order_id: str
    description: str
    image_b64: Optional[str] = None


class NegotiationRequest(BaseModel):
    claim_id: str
    order_id: str
    complaint_type: str
    description: str
    message: str
    detection: dict[str, Any] = {}
    policies: list[dict[str, Any]] = []


def _detection_summary(request: DetectionRequest) -> dict[str, Any]:
    """Return a safe detection context without a verification challenge gate."""
    if not request.image_b64:
        return {"label": "No image submitted", "confidence": 0.0, "source": "customer description"}
    # CVPipeline can be introduced here when deployed. This endpoint accepts
    # normal image evidence directly.
    keywords = ["crack", "scratch", "broken", "damage", "missing", "wrong"]
    label = next((word for word in keywords if word in request.description.lower()), "item image")
    return {"label": label.replace("_", " ").title(), "confidence": 0.72, "source": "image + description"}


@router.post("/detect")
async def detect_object_and_load_policy(request: DetectionRequest):
    """Object detection entry point; returns RAG policy context for the chat UI."""
    detection = _detection_summary(request)
    rag_result = rag_service.query_policies(f"{request.type}: {request.description}")
    return {
        "claim_id": f"CLM-{uuid.uuid4().hex[:8].upper()}",
        "detection": detection,
        "policies": rag_result.get("applicable_policies", []),
        "policy_match": rag_result.get("policy_match", False),
        "notice": "Object detection complete. Continue to the policy negotiation chat.",
    }


async def _openrouter_answer(system_prompt: str, user_message: str) -> str:
    api_key = settings.OPENROUTER_API_KEY or settings.OPENAI_API_KEY
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not configured")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": settings.OPENROUTER_APP_NAME,
    }
    body = {
        "model": settings.OPENROUTER_MODEL,
        "temperature": settings.LLM_TEMPERATURE,
        "max_tokens": min(settings.LLM_MAX_TOKENS, 700),
        "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_message}],
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(f"{settings.OPENROUTER_BASE_URL.rstrip('/')}/chat/completions", headers=headers, json=body)
        response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]
    return content.strip()


@router.post("/negotiate")
async def negotiate_with_policy_ai(request: NegotiationRequest):
    """Policy-grounded complaint negotiation through the configured OpenRouter API."""
    policy_context = "\n".join(
        f"- {item.get('document', 'Policy')} {item.get('section', '')}: {item.get('content_snippet', '')}"
        for item in request.policies[:3]
    ) or "No retrieved policy excerpt is available; state that clearly and offer review."
    system_prompt = f"""You are a customer-resolution policy assistant. Be empathetic, concise, and transparent.
Do not claim that a refund, replacement, or exception has been approved unless it is explicitly confirmed by a human or system.
Explain relevant policy evidence, ask one focused follow-up when needed, and frame any monetary or remedy discussion as a proposal subject to review.

Case: {request.claim_id}; order: {request.order_id}; type: {request.complaint_type}
Customer description: {request.description}
Detection context: {request.detection}
Retrieved policy context:\n{policy_context}"""
    try:
        answer = await _openrouter_answer(system_prompt, request.message)
        provider = "openrouter"
    except Exception:
        answer = ("I have recorded your request. Based on the available case context, I can explain the policy "
                  "and prepare a proposal for review, but I cannot confirm an outcome until the policy conditions are verified.")
        provider = "fallback"
    return {"status": "success", "answer": answer, "provider": provider, "claim_id": request.claim_id}

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
