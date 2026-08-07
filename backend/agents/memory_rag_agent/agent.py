import logging
from .vector_store_manager import VectorStoreManager

logger = logging.getLogger(__name__)

class MemoryRAGAgent:
    """
    Agent 12: Memory / RAG Agent
    Acts as the shared intelligence layer. When other agents (like the Policy 
    Intelligence Agent or the Resolution Strategy Agent) need to know the rules, 
    they query this agent, ensuring 100% consistency across the platform.
    """
    def __init__(self):
        self.vector_store = VectorStoreManager()
        
    def get_relevant_context(self, query_text: str, query_embedding: list) -> str:
        """
        Retrieves the top policies related to the query and formats them 
        into a string block to be injected into an LLM prompt.
        """
        logger.info(f"Retrieving enterprise memory for query: '{query_text[:50]}...'")
        
        results = self.vector_store.search_policies(query_embedding, limit=3)
        
        if not results:
            return "No relevant enterprise policies found in memory."
            
        context_blocks = []
        for i, payload in enumerate(results):
            policy_type = payload.get("policy_type", "General Policy")
            text = payload.get("text", "")
            context_blocks.append(f"[Policy {i+1} - {policy_type}]: {text}")
            
        return "\n\n".join(context_blocks)
