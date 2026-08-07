import os
import logging
from typing import TypedDict, Annotated, Sequence
import operator

from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, END

from agents.memory_rag_agent import MemoryRAGAgent

logger = logging.getLogger(__name__)

# State definition for LangGraph
class ClaimState(TypedDict):
    claim_id: str
    customer_intent: str
    messages: Annotated[Sequence[BaseMessage], operator.add]
    evidence_type: str  # 'visual' or 'document'
    cv_score: float     # Pipeline A score (0-100)
    doc_score: float    # Pipeline B score (0-100)
    final_score: float  # Merged isolated score
    policy_context: str # RAG context
    decision: str       # 'approve', 'escalate', 'reject'
    rationale: str

class AgentOrchestrator:
    """
    The main LangGraph engine that ties the 13 agents together.
    Implements the core novelty: Isolated scoring pipelines and dynamic escalation.
    """
    def __init__(self):
        # OpenRouter configuration for OpenAI compatibility
        self.llm = ChatOpenAI(
            model="openai/gpt-4o-mini", # OpenRouter model mapping
            api_key=os.getenv("OPENAI_API_KEY"),
            base_url="https://openrouter.ai/api/v1"
        )
        self.memory_agent = MemoryRAGAgent()
        self.graph = self._build_graph()

    def _build_graph(self):
        workflow = StateGraph(ClaimState)

        # Add Nodes (The 13 Agents)
        workflow.add_node("agent_1_customer_interaction", self._node_customer_interaction)
        workflow.add_node("agent_8_score_evaluation", self._node_score_evaluation)
        workflow.add_node("agent_9_resolution_strategy", self._node_resolution_strategy)
        workflow.add_node("agent_11_escalation", self._node_escalation)
        
        # Define Edges (The Pipeline Flow)
        workflow.set_entry_point("agent_1_customer_interaction")
        
        # After understanding intent, evaluate the scores that came from Pipeline A (CV) or B (Docs)
        workflow.add_edge("agent_1_customer_interaction", "agent_8_score_evaluation")
        
        # Conditional Routing based on the isolated score
        workflow.add_conditional_edges(
            "agent_8_score_evaluation",
            self._route_based_on_score,
            {
                "approve": "agent_9_resolution_strategy",
                "escalate": "agent_11_escalation",
                "reject": END
            }
        )
        
        # End nodes
        workflow.add_edge("agent_9_resolution_strategy", END)
        workflow.add_edge("agent_11_escalation", END)

        return workflow.compile()

    # --- Node Implementations ---

    def _node_customer_interaction(self, state: ClaimState) -> dict:
        """Agent 1: Understands customer intent and reads policies (Agent 12 integration)"""
        logger.info("Running Agent 1: Customer Interaction")
        last_message = state['messages'][-1].content
        
        # Novelty: Call Agent 12 (RAG) to inject policy directly into the thought process
        policy = self.memory_agent.get_relevant_context(last_message, [0.0]*1536) # Mock embedding for now
        
        prompt = f"""
        You are the Customer Interaction Agent. Analyze the customer's complaint.
        Complaint: {last_message}
        Relevant Policy: {policy}
        Determine their core intent in one sentence.
        """
        response = self.llm.invoke([HumanMessage(content=prompt)])
        
        return {
            "customer_intent": response.content,
            "policy_context": policy
        }

    def _node_score_evaluation(self, state: ClaimState) -> dict:
        """
        Agent 8: Score Evaluation Agent (The Isolated Pipeline).
        Merges Pipeline A (CV/Anti-Fabrication) and Pipeline B (Documents).
        """
        logger.info("Running Agent 8: Score Evaluation (Isolated Pipeline)")
        
        # In production, these scores are passed from the WebRTC OpenCV agents
        # and the OCR document parsers.
        final_score = 0.0
        if state['evidence_type'] == 'visual':
            final_score = state.get('cv_score', 0.0)
        else:
            final_score = state.get('doc_score', 0.0)
            
        decision = "reject"
        if final_score >= 80:
            decision = "approve"
        elif final_score >= 50:
            decision = "escalate"
            
        return {
            "final_score": final_score,
            "decision": decision
        }

    def _route_based_on_score(self, state: ClaimState) -> str:
        """Routing logic based on Agent 8's output"""
        logger.info(f"Score routing decision: {state['decision']} (Score: {state['final_score']}%)")
        return state['decision']

    def _node_resolution_strategy(self, state: ClaimState) -> dict:
        """Agent 9: Generates the refund/replacement action"""
        logger.info("Running Agent 9: Resolution Strategy")
        return {"rationale": "Score > 80%. Automated resolution applied."}

    def _node_escalation(self, state: ClaimState) -> dict:
        """Agent 11: Prepares the package for human review (no bypass)"""
        logger.info("Running Agent 11: Escalation Agent")
        return {"rationale": "Score 50-80%. Requires human review."}

    def run_claim_pipeline(self, initial_state: dict):
        """Entry point for testing the pipeline"""
        state = ClaimState(**initial_state)
        return self.graph.invoke(state)
