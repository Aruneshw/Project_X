import os
import sys
from dotenv import load_dotenv

# Load env variables including OPENAI_API_KEY
load_dotenv()

from langchain_core.messages import HumanMessage
from orchestrator.agent_orchestrator import AgentOrchestrator

def run_test():
    print("Initializing LangGraph Agent Orchestrator...")
    orchestrator = AgentOrchestrator()
    
    print("\n--- Test Case 1: High Confidence Visual Claim (Score > 80) ---")
    state_high = {
        "claim_id": "test_123",
        "messages": [HumanMessage(content="My laptop arrived with a cracked screen. I've attached a video.")],
        "evidence_type": "visual",
        "cv_score": 95.0, # Anti-Fabrication layer passed with flying colors
        "doc_score": 0.0,
        "final_score": 0.0,
        "customer_intent": "",
        "policy_context": "",
        "decision": "",
        "rationale": ""
    }
    
    print("Running Pipeline...")
    result_high = orchestrator.run_claim_pipeline(state_high)
    print(f"Customer Intent Extracted (via LLM): {result_high['customer_intent']}")
    print(f"Final Decision (via Agent 8): {result_high['decision'].upper()}")
    print(f"Rationale: {result_high['rationale']}")
    
    print("\n--- Test Case 2: Borderline Claim (Score 50-80) ---")
    state_med = {
        "claim_id": "test_456",
        "messages": [HumanMessage(content="The box was open and my phone is missing.")],
        "evidence_type": "visual",
        "cv_score": 65.0, # Optical flow looked a bit suspicious, score lowered
        "doc_score": 0.0,
        "final_score": 0.0,
        "customer_intent": "",
        "policy_context": "",
        "decision": "",
        "rationale": ""
    }
    
    print("Running Pipeline...")
    result_med = orchestrator.run_claim_pipeline(state_med)
    print(f"Final Decision: {result_med['decision'].upper()}")
    print(f"Rationale: {result_med['rationale']}")

if __name__ == "__main__":
    # Mocking Qdrant for the test since we don't have local qdrant up right now
    from unittest.mock import patch
    with patch('agents.memory_rag_agent.VectorStoreManager') as MockVectorStore:
        run_test()
