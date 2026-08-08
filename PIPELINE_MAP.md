# Final Architecture: PIPELINE_MAP (Connected State)

## 1. Call Graph (Live Agentic Workflow)

```mermaid
flowchart TD
    %% Frontend Entrypoints
    subindex[frontend: home/index.js]
    subclaims[frontend: claims/claims.js]
    subadmin[frontend: admin/adminDashboard.js]

    %% API Routes
    route_claims[api/routes/claims.py : /process]
    route_rag[api/routes/rag.py : /chat]
    route_policies[api/routes/policies.py]
    
    %% Dead Routes
    route_integrations[api/routes/integrations.py]:::dead
    route_analytics[api/routes/analytics.py]:::dead

    %% Orchestrator
    orchestrator{orchestrator/agent_orchestrator.py}

    %% Orchestrator Nodes & Internal Tools
    db_lookup[Node: verify_database<br>(DBLookupAgent)]
    doc_extract[Node: extract_documents<br>(OCRExtractor)]
    cv_fraud[Node: detect_fraud<br>(YOLO CVPipeline)]
    policy_rag[Node: retrieve_policy<br>(RAGService)]
    resolution[Node: calculate_resolution<br>(CLVAnalyzer, ResolutionCalculator)]
    settlement[Node: execute_settlement<br>(ERPClient, ShippingClient)]
    analytics_service[services/analytics_service.py]
    negotiation_agent[agents...negotiation.py]

    %% Databases (Via DatabaseRouter)
    postgres[(Postgres DB)]
    qdrant[(Qdrant Vector DB)]
    elasticsearch[(Elasticsearch)]

    %% Unused Legacy Code (Orphaned/Deprecated)
    legacy_cv[agents/cv_object_detection_agent/]:::orphan
    legacy_fraud[agents/anti_fraud_challenge_agent/]:::orphan
    doc_pipe[pipelines/document_pipeline/main.py]:::orphan

    %% Connections
    subindex -- fetch('/api/v1/claims/process') --> route_claims
    subclaims -- fetch('/api/v1/rag/chat') --> route_rag
    subadmin -- fetch('/api/v1/policies/') --> route_policies

    %% Route to Orchestrator
    route_claims --> orchestrator
    orchestrator --> db_lookup
    orchestrator --> doc_extract
    orchestrator --> cv_fraud
    orchestrator --> policy_rag
    orchestrator --> resolution
    orchestrator --> settlement

    %% Post-Orchestrator Logic
    route_claims --> negotiation_agent
    route_claims --> analytics_service
    route_claims --> postgres

    %% Database Router Connections
    db_lookup --> postgres
    policy_rag --> qdrant
    route_rag --> policy_rag
    route_policies --> policy_rag
    analytics_service --> elasticsearch
    settlement --> |Simulated API Call| erp_api[External ERP/Shipping APIs]

    %% Styling
    classDef dead fill:#ffebee,stroke:#c62828,stroke-width:2px,stroke-dasharray: 5 5;
    classDef orphan fill:#fff3e0,stroke:#e65100,stroke-width:2px,stroke-dasharray: 5 5;
```

## 2. Final Gap Analysis Status

*   **RESOLVED**: `backend/orchestrator/agent_orchestrator.py` is no longer orphaned. It is the central nervous system powering the primary `/api/v1/claims/process` endpoint.
*   **RESOLVED**: The CV logic is completely wired. We integrated the actual `Yolo` repository as `pipelines/cv_pipeline`, built an adapter (`cv_interface.py`), and the orchestrator dynamically invokes it on every image payload.
*   **RESOLVED**: Database boundaries are respected. `VectorStoreManager` and `DBLookupAgent` both pull their connections securely from `DatabaseRouter` instead of bypassing it.
*   **RESOLVED**: `backend/integrations/erp/client.py` and `shipping/client.py` are no longer orphaned. They are actively invoked by the orchestrator's `execute_settlement` node whenever an Auto-Resolution is approved.
*   **REMAINING ORPHANS (Deprecated)**: 
    *   The raw agents in `backend/agents/cv_object_detection_agent/` and `backend/agents/anti_fraud_challenge_agent/` remain completely disconnected. This is intentional: they are obsolete now that the actual YOLO `CVPipeline` handles image fraud. 
    *   `backend/pipelines/document_pipeline/main.py` is orphaned. The pipeline orchestrator natively uses `OCRExtractor` directly for text analysis rather than utilizing a redundant pipeline wrapper.
*   **REMAINING DEAD-ENDS**: `backend/api/routes/integrations.py` and `backend/api/routes/analytics.py` remain as untouched API stubs. The frontend does not currently query them, but they can be kept for future expansion or deleted.
