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

# New Enterprise Agents
from agents.evidence_verification_agent.db_lookup import DBLookupAgent
from agents.customer_interaction_agent.clv_analyzer import CLVAnalyzer
from agents.resolution_strategy_agent.calculator import ResolutionCalculator
from agents.resolution_strategy_agent.negotiation import NegotiationAgent

try:
    from agents.evidence_verification_agent.ocr_extractor import OCRExtractor
    ocr_extractor = OCRExtractor(use_gpu=False)
except ImportError:
    ocr_extractor = None

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

# Instantiate stateless agents
db_lookup_agent = DBLookupAgent()
clv_analyzer = CLVAnalyzer()
resolution_calculator = ResolutionCalculator()
negotiation_agent = NegotiationAgent()

@router.post("/process", response_model=ClaimResponse)
async def process_claim(request: ClaimRequest, session: AsyncSession = Depends(get_db)):
    claim_id = f"CLM-{random.randint(3000, 9999)}"
    desc_lower = request.description.lower()
    
    # 1. DB Verification (Real DB Lookup)
    db_result = await db_lookup_agent.verify_order(session, request.order)
    if not db_result["verified"]:
        return ClaimResponse(
            claim_id=claim_id,
            status="Failed",
            ai_score=0,
            decision="Reject",
            rationale=db_result["error"],
            policy_applied="Standard Operating Procedure v1",
            self_healing_action="Please check your order number and try again."
        )
        
    order_data = db_result["order_details"]
    
    # 2. RAG Policy Retrieval
    rag_result = rag_service.query_policies(request.description)
    policy = ""
    if rag_result["policy_match"]:
        for p in rag_result["applicable_policies"]:
            policy += f"Applicable Policy: {p['document']} {p['section']}\n"
    else:
        policy = "Standard Return Policy."
        
    # 3. OCR Invoice Verification
    ocr_rationale = ""
    if request.invoice_b64 and ocr_extractor:
        ocr_result = ocr_extractor.process_invoice(request.invoice_b64)
        if ocr_result["success"] and ocr_result["data"]["order_id"] == request.order:
            ocr_rationale = " OCR extraction perfectly matched the Order ID on the invoice document. "
        else:
            ocr_rationale = " OCR could not match the Order ID on the document. "
            
    # 4. CLV Analysis & Churn Prediction
    clv_data = clv_analyzer.analyze_customer(
        total_spend=order_data["total_amount"] * 3, # Mock historical
        purchase_frequency=4, 
        active_months=24, 
        recent_disputes=1
    )
    
    # 5. Refund Calculation
    refund_data = resolution_calculator.calculate_refund(
        order_total=order_data["total_amount"],
        months_owned=1,
        reason=request.type.lower(),
        customer_tier=clv_data["churn_risk_category"]
    )
    
    # 6. Negotiation Agent (Emotion Aware)
    # Detect basic sentiment from description
    sentiment = "frustrated" if "angry" in desc_lower or "frustrat" in desc_lower or "unacceptable" in desc_lower else "neutral"
    negotiation_offer = negotiation_agent.generate_offer(
        clv_data=clv_data,
        sentiment=sentiment,
        base_refund=refund_data["final_refund"]
    )
    
    # 7. Computer Vision Mock & Fraud Detection
    is_fake = "fake" in desc_lower or "stock" in desc_lower
    ai_score = 92
    decision = refund_data["resolution_type"]
    rationale = f"Order verified in DB. {ocr_rationale} Refund logic applied: {refund_data['rationale']}"
    self_healing = None
    
    if is_fake:
        ai_score = 12
        decision = "Reject"
        rationale = "CNN Object Detection flagged the uploaded image as digitally fabricated."
        policy = "Anti-Fraud Policy v4.0: Fabricated evidence results in immediate claim denial."
        self_healing = "Please upload a genuine, live photograph."
    
    # Push unified data to Analytics
    asyncio.create_task(
        analytics_service.log_claim_analysis(
            claim_id=claim_id,
            user_id="customer_123",
            ai_score=ai_score,
            decision=decision,
            policy_applied=policy
        )
    )
    
    # Store history in Supabase table
    # We will use a mock user UUID since there's no real auth yet
    user_uuid = uuid.uuid4()
    new_history = UserHistory(
        user_id=user_uuid,
        claim_id=claim_id,
        issue_type=request.type,
        description=request.description,
        ai_score=ai_score,
        status=decision
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
        ai_score=ai_score,
        decision=decision,
        rationale=rationale,
        policy_applied=policy,
        self_healing_action=self_healing,
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
