# CX Platform: Unified Data Architecture

To ensure the backend databases operate independently but can be analyzed from **one central place**, the architecture is strictly segmented by domain roles, utilizing the `DatabaseRouter` (`backend/database/router.py`).

## 1. Database Domain Mapping

| Database | Role / Purpose | Data Types Handled |
| :--- | :--- | :--- |
| **PostgreSQL** | **User History & State (Source of Truth)** | `User Data`, `Order History`, `Claim/Dispute Records`, `Customer Profiles` |
| **Vector DB (Qdrant)** | **RAG Knowledge Base (Semantic Memory)** | `Enterprise Policies`, `Terms of Service`, `Chunked PDF Embeddings` |
| **Redis** | **Live Caching & Agent State (Volatile)** | `Session States`, `WebRTC Locks`, `Rate Limiting`, `Agent Latency Stats` |
| **Elasticsearch** | **Central Analytics (The Gathering Place)** | `Unified Audit Logs`, `AI Rationale Traces`, `Aggregated Performance Metrics` |

---

## 2. The Unified Analytics Gatherer (`analytics_service.py`)

Instead of making your frontend dashboard query all four databases simultaneously (which is slow and inefficient), we gather the data at **one place for analysis**: Elasticsearch.

When a dispute is resolved by the 13-Agent Orchestrator, the **Analytics Sync Service** performs the following:
1. Pulls the structural claim outcome from **PostgreSQL**.
2. Identifies which policy was cited from the **Vector DB**.
3. Grabs the execution time/latency metrics from **Redis**.
4. Packages all this context together and pushes it to **Elasticsearch**.

### Why Elasticsearch for Analysis?
Your **Analytics & RL Insights Dashboard** now only has to query **Elasticsearch** to build charts, graphs, and calculate the overall automated resolution success rate. 

## 3. How to Access in Code
If you need to fetch user data vs RAG data, use the newly created centralized router:

```python
from database.router import router

# 1. Get User Data / History
postgres_db = router.get_user_history_db()

# 2. Get RAG Policies
rag_db = router.get_rag_db()

# 3. Get Live Dashboard Analytics (The Unified Pool)
analytics_db = router.get_analytics_db()
```
