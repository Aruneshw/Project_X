import os
import logging
from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END

# Import the actual agents and pipelines
from agents.evidence_verification_agent.db_lookup import DBLookupAgent
from agents.customer_interaction_agent.clv_analyzer import CLVAnalyzer
from agents.resolution_strategy_agent.calculator import ResolutionCalculator
from services.rag_service import rag_service
from integrations.erp.client import MockERPClient
from integrations.shipping.client import MockShippingClient

try:
    from pipelines.cv_pipeline import CVPipeline
    cv_pipeline = CVPipeline()
except ImportError:
    cv_pipeline = None

try:
    from agents.evidence_verification_agent.ocr_extractor import OCRExtractor
    ocr_extractor = OCRExtractor(use_gpu=False)
except ImportError:
    ocr_extractor = None

logger = logging.getLogger(__name__)

# State definition for LangGraph matching Phase 3 proposal
class ClaimState(TypedDict):
    claim_id: str
    order_id: str
    description: str
    image_b64: Optional[str]
    invoice_b64: Optional[str]
    
    db_verified: bool
    fraud_score: int
    ocr_match: bool
    policy_context: str
    
    clv_data: dict
    final_decision: str
    rationale: str
    refund_amount: float
    self_healing_action: Optional[str]


class AgentOrchestrator:
    """
    The unified LangGraph engine that orchestrates the real agents and pipelines.
    """
    def __init__(self):
        self.db_agent = DBLookupAgent()
        self.clv_analyzer = CLVAnalyzer()
        self.calculator = ResolutionCalculator()
        self.erp_client = MockERPClient()
        self.shipping_client = MockShippingClient()
        
        self.graph = self._build_graph()

    def _build_graph(self):
        workflow = StateGraph(ClaimState)

        # 1. Add Nodes
        workflow.add_node("verify_database", self._node_verify_database)
        workflow.add_node("extract_documents", self._node_extract_documents)
        workflow.add_node("detect_fraud", self._node_detect_fraud)
        workflow.add_node("retrieve_policy", self._node_retrieve_policy)
        workflow.add_node("calculate_resolution", self._node_calculate_resolution)
        workflow.add_node("execute_settlement", self._node_execute_settlement)
        
        # 2. Edges
        workflow.set_entry_point("verify_database")
        
        workflow.add_conditional_edges(
            "verify_database",
            lambda s: "extract_documents" if s.get("db_verified") else END
        )
        
        workflow.add_edge("extract_documents", "detect_fraud")
        
        workflow.add_conditional_edges(
            "detect_fraud",
            lambda s: "retrieve_policy" if s.get("fraud_score", 0) >= 50 else END
        )
        
        workflow.add_edge("retrieve_policy", "calculate_resolution")
        
        workflow.add_conditional_edges(
            "calculate_resolution",
            lambda s: "execute_settlement" if s.get("final_decision") == "Auto-Resolve Approved" else END
        )
        
        workflow.add_edge("execute_settlement", END)

        return workflow.compile()

    # --- Node Implementations ---
    async def _node_verify_database(self, state: ClaimState) -> dict:
        logger.info("Node: verify_database")
        db_result = await self.db_agent.verify_order(order_number=state["order_id"])
        
        if not db_result["verified"]:
            return {
                "db_verified": False,
                "final_decision": "Reject",
                "rationale": db_result.get("error", "Order not found."),
                "self_healing_action": "Please check your order number and try again."
            }
            
        return {
            "db_verified": True,
            "rationale": "Order verified in DB. "
        }

    def _node_extract_documents(self, state: ClaimState) -> dict:
        logger.info("Node: extract_documents")
        ocr_match = False
        rationale_append = ""
        
        if state.get("invoice_b64") and ocr_extractor:
            ocr_result = ocr_extractor.process_invoice(state["invoice_b64"])
            if ocr_result.get("success") and ocr_result["data"].get("order_id") == state["order_id"]:
                ocr_match = True
                rationale_append = "OCR perfectly matched Order ID. "
            else:
                rationale_append = "OCR could not match Order ID. "
                
        return {
            "ocr_match": ocr_match,
            "rationale": state.get("rationale", "") + rationale_append
        }

    def _node_detect_fraud(self, state: ClaimState) -> dict:
        logger.info("Node: detect_fraud")
        fraud_score = 92
        rationale_append = ""
        self_healing = None
        decision = state.get("final_decision", "")
        
        if state.get("image_b64") and cv_pipeline:
            cv_result = cv_pipeline.process_image(state["image_b64"])
            fraud_score = cv_result["fraud_score"]
            if fraud_score < 50:
                decision = "Reject"
                rationale_append = f"YOLOv8 CV Detection flagged potential fraud. {cv_result['details']}"
                self_healing = "Please upload a genuine, live photograph."
        else:
            # Mock fallback if no image provided or no pipeline
            desc_lower = state.get("description", "").lower()
            if "fake" in desc_lower or "stock" in desc_lower:
                fraud_score = 12
                decision = "Reject"
                rationale_append = "Text analysis flagged potential fraud (mock fallback)."
                self_healing = "Please upload a genuine, live photograph."

        return {
            "fraud_score": fraud_score,
            "final_decision": decision,
            "rationale": state.get("rationale", "") + rationale_append,
            "self_healing_action": self_healing
        }

    def _node_retrieve_policy(self, state: ClaimState) -> dict:
        logger.info("Node: retrieve_policy")
        rag_result = rag_service.query_policies(state["description"])
        policy = ""
        if rag_result.get("policy_match"):
            for p in rag_result.get("applicable_policies", []):
                policy += f"Applicable Policy: {p['document']} {p['section']}\n"
        else:
            policy = "Standard Return Policy."
            
        return {"policy_context": policy}

    def _node_calculate_resolution(self, state: ClaimState) -> dict:
        logger.info("Node: calculate_resolution")
        # Generate mock CLV data for now based on simple params
        clv_data = self.clv_analyzer.analyze_customer(
            total_spend=500,
            purchase_frequency=4,
            active_months=24,
            recent_disputes=1
        )
        
        refund_data = self.calculator.calculate_refund(
            order_total=100.0,  # mock total
            months_owned=1,
            reason="defective",
            customer_tier=clv_data["churn_risk_category"]
        )
        
        decision = refund_data["resolution_type"]
        if decision == "Full Refund":
            decision = "Auto-Resolve Approved"
            
        return {
            "clv_data": clv_data,
            "final_decision": decision,
            "refund_amount": refund_data["final_refund"],
            "rationale": state.get("rationale", "") + f" Refund logic applied: {refund_data['rationale']}"
        }

    def _node_execute_settlement(self, state: ClaimState) -> dict:
        logger.info("Node: execute_settlement")
        # Actually call the integrations
        erp_res = self.erp_client.update_order_status(state["order_id"], "Refunded")
        ship_res = self.shipping_client.generate_return_label(state["order_id"])
        
        rationale_append = f" ERP Status: {erp_res['status']}. Return label generated."
        
        return {
            "rationale": state.get("rationale", "") + rationale_append
        }

    async def run_claim(self, initial_state: dict):
        """Entry point for processing a claim through the real pipeline"""
        return await self.graph.ainvoke(initial_state)
