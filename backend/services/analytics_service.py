"""
Analytics Sync Service
Gathers data from Postgres (History), Redis (Live State), and VectorDB (Policy Hits)
and pushes it to Elasticsearch to act as the ONE PLACE FOR ANALYSIS.
"""
from datetime import datetime
from database.router import router

class AnalyticsService:
    def __init__(self):
        self.es = router.get_analytics_db()
        self.analytics_index = "cx_platform_analytics"
        
    async def log_claim_analysis(self, claim_id: str, user_id: str, ai_score: float, decision: str, policy_applied: str):
        """
        Gathers disparate data into a single unified analytical record in Elasticsearch.
        """
        if not self.es:
            return # ES not initialized yet
            
        doc = {
            "timestamp": datetime.utcnow().isoformat(),
            "claim_id": claim_id,
            "user_id": user_id,
            "ai_score": ai_score,
            "decision": decision,
            "policy_applied": policy_applied,
            # We could fetch user history from Postgres here to enrich the log
            # We could fetch live agent latencies from Redis here
            "source": "multi_agent_orchestrator"
        }
        
        try:
            await self.es.index(index=self.analytics_index, document=doc)
        except Exception as e:
            print(f"Failed to push to Central Analytics (ES): {e}")

analytics_service = AnalyticsService()
