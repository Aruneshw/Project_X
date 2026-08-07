# Enterprise CX Platform — Codebase Overview & Implementation Blueprint

## Summary

The repository `https://github.com/Aruneshw/Project_X` implements an **enterprise-grade autonomous customer resolution platform** ("cxplatform") built on a 13-agent Agentic AI architecture, with a novel **Anti-Fabrication Evidence System** (camera-only capture, gallery blocking, dynamic physical challenges) and an **Isolated Dual-Pipeline scoring** model. The backend is implemented with **FastAPI + Python 3.11**, with the React frontend deferred to a later PR from another account. A **base UI** (customer dashboard) matching the supplied design is included as a visual reference for the backend API contract.

---

## Architecture

### Primary Pattern
**Multi-Agent Orchestration** with shared vector memory, layered on a **FastAPI** REST backend. The system is event-driven: a customer interaction flows through evidence capture (two isolated pipelines) → parallel agent processing → isolated score evaluation → threshold-based routing (>80% auto-resolve, 50–80% human escalation, <50% reject as fraud) → workflow execution → reinforcement learning feedback.

### Major Subsystems
1. **Multi-Agent Layer (13 agents)** — Specialized agents grouped as:
   - *Conversation:* Customer Interaction (1)
   - *Evidence / Anti-Fraud (novel):* Evidence Capture (2), CV Object Detection (3), Anti-Fraud Challenge (4), Evidence Verification (5)
   - *Reasoning:* Policy Intelligence (6), Fraud Detection (7), Score Evaluation (8), Resolution Strategy (9)
   - *Execution:* Workflow Execution (10), Escalation (11)
   - *Memory/Learning (novel):* Memory/RAG (12), Learning (13)
2. **Orchestrator** — `agent_orchestrator`, `task_decomposer`, `memory_manager`, `context_preserver`
3. **Dual Pipelines** — Pipeline A (CV camera-only, gallery blocked) and Pipeline B (sandboxed document upload). Fully isolated; merged only at Score Evaluation Agent.
4. **API Gateway** — FastAPI with auth (JWT), rate limiting, logging middleware; routes: customer, admin, agent_monitor, resolution, analytics, webhooks.
5. **Services** — auth, notification, analytics, audit.
6. **Data Layer** — PostgreSQL (primary), Redis (cache/queue), Elasticsearch (search/logs), Vector DB (RAG/memory), MinIO/S3 (evidence storage).

### The 13 Agents

| # | Agent | Novel? | Core Role |
|---|---|---|---|
| 1 | Customer Interaction | | Intent classification, sentiment, multilingual |
| 2 | Evidence Capture | ✅ | Blocks gallery; forces camera-only live capture |
| 3 | CV Object Detection | ✅ | 3-layer video analysis (hand+object → product identity → damage region) |
| 4 | Anti-Fraud Challenge | ✅ | Dynamic physical challenges (LED pen, 360°, session codes) |
| 5 | Evidence Verification | | OCR + document parsing for Pipeline B |
| 6 | Policy Intelligence | | RAG policy lookup, versioning, compliance |
| 7 | Fraud Detection | | Behavioral analytics, risk scoring, anomaly detection |
| 8 | Score Evaluation | ✅ | Isolated pipeline merging CV + document scores |
| 9 | Resolution Strategy | | Decision optimization, negotiation |
| 10 | Workflow Execution | | Refunds, replacements, API orchestration |
| 11 | Escalation | | Human handoff for 50–80 score, no bypass allowed |
| 12 | Memory / RAG | ✅ | Shared vector memory across all agents |
| 13 | Learning | | RL feedback from outcomes + human corrections |

### Technology Stack
- **Backend:** FastAPI, Python 3.11+, SQLAlchemy, Pydantic v2, Celery (async agent tasks), WebSocket for real-time status
- **AI/ML:** LangGraph (preferred for orchestration), OpenAI-compatible LLM API, OpenCV + YOLO + MediaPipe (CV agents), spaCy/Transformers (NLP), LangChain + vector DB (RAG), Stable-Baselines3 (RL placeholder)
- **Infra:** Docker, docker-compose, GitHub Actions (CI/CD), Prometheus/Grafana, OpenTelemetry, ELK

---

## Key Abstractions

### BaseAgent
- **File:** `backend/agents/base_agent.py`
- **Responsibility:** Common lifecycle for all 13 agents: `run(context)` → returns `AgentResult`; exposes `memory` (from Memory/RAG Agent) and LLM client.
- **Interface:** `async run(ctx: CaseContext) -> AgentResult`; `name`, `version` class attrs.
- **Used by:** Every agent package inherits this.

### AgentOrchestrator
- **File:** `backend/orchestrator/agent_orchestrator.py`
- **Responsibility:** Routes cases through the orchestration flow; decomposes tasks, preserves context, coordinates parallel processing.
- **Lifecycle:** Created at app startup; per-case `execute(case_id)`.

### ScoreEvaluationAgent (Agent 8 — isolated)
- **Responsibility:** Merges Pipeline A (CV) + Pipeline B (document) scores → single 0–100 score; routes: `>80` auto-resolve, `50–80` human review, `<50` fraud-reject.
- **Contract:** `evaluate(cv_score, doc_score, fraud_score, policy_score) -> RoutingDecision(case_id, score, action)`.

### AntiFraudChallengeAgent (Agent 4 — novel)
- **Responsibility:** Generates dynamic physical challenges (LED pen, 360° rotation, shadow/light test, random 4-digit session code); validates completion via CV.
- **Contract:** `generate_challenge(case_id) -> Challenge(task, instructions)`; `validate(case_id, frames) -> ChallengeResult(passed: bool)`.

### MemoryRAGAgent (Agent 12 — novel)
- **Responsibility:** Owns the shared vector store; indexes policies; injects context into all other agents; persists resolved cases/conflicts.
- **Contract:** `index_policy(doc)`, `retrieve(query, k)`, `inject_case_context(agent_ctx)`.

### SQLAlchemy Models
- `Claim`: customer_id, order_id, type, description, status (processing/auto_resolved/in_review/rejected), confidence_score, routing_result.
- `Evidence`: claim_id, pipeline (A/B), media_path, cv_score, doc_score, challenge_passed, flags.
- `Policy`: title, clauses (JSON), vector_id, version, region, effective dates.
- `Audit`: case_id, agent_id, decision, rationale, version — powers the Explainability Framework.

---

## Data Flow

1. **Customer submits complaint** → `POST /api/v1/customer/claims` → Auth → `CustomerInteractionAgent` classifies intent (one of 9 issue types) and gathers context.
2. **Evidence collection (parallel, isolated):**
   - Path A: `POST /api/v1/customer/claims/{id}/evidence/camera` — opens WebRTC session; server validates live stream; CV agent runs 3-layer analysis; on suspicion, Anti-Fraud Challenge issues physical task; on pass, CV score produced.
   - Path B: `POST /api/v1/customer/claims/{id}/evidence/documents` — sandboxed upload (invoice/PDF/photo) → OCR → document score.
3. **Parallel processing** (Celery tasks): Policy Intelligence (RAG lookup), Fraud Detection (behavioral + CV signals), Memory/RAG context injection.
4. **Score Evaluation (isolated)** → merges scores → routing decision.
5. **Outcome:** auto-resolve → WorkflowExecutionAgent (refund/replacement/notification); 50–80 → EscalationAgent assigns human reviewer with full AI transparency; <50 → fraud flag → notification → case closed.
6. **Learning feedback:** `LearningAgent` records outcome + human corrections → RL weight update → Score Evaluation thresholds self-adjust.

---

## Non-Obvious Behaviors & Design Decisions

- **Anti-Fabrication by Design:** Gallery/file picker is *blocked* for visual evidence — camera-only. This is the platform's core differentiator.
- **Isolated Scoring:** Pipeline A and B data cannot cross-contaminate until the Score Evaluation Agent merge. Implement as separate service boundaries/queues.
- **No bypass of human review:** Scores 50–80% *must* route to human approval; enforce in `EscalationAgent.human_router` + DB constraint.
- **Explainability is mandatory:** Every decision must return: rationale, policy references, confidence score, fraud assessment, evidence summary, resolution justification, human-override recommendation, execution log.
- **Dynamic challenges are session-unique:** generate per session; randomness ensures a pre-generated video can never contain the challenge code.
- **3-layer CV is ALL-or-pass:** all three layers must pass for a valid evidence score; failure triggers additional challenge.
- **RL is a feedback loop, not a first-class runtime dependency:** store outcomes + human corrections; threshold weights update asynchronously; keep a stub/interface for Stable-Baselines3.
- **Scoring thresholds (80/50) should be config** (`core/config.py`), centrally adjustable.

---

## Execution Entry Point

`backend/app/main.py` — creates FastAPI app, registers middleware + routers, initializes DB, and starts the orchestrator. The runtime loop: HTTP request → route → orchestrator → agent chain → synchronous response with `case_id` + async processing via Celery/WebSocket updates.
