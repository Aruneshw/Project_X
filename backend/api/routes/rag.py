from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import os
import shutil

router = APIRouter(prefix="/rag", tags=["Knowledge Base RAG"])

# In a real production system, this connects to Milvus/Pinecone.
# For now, we simulate the Vector DB connection.
VECTOR_DB_DIR = "./vector_storage"
os.makedirs(VECTOR_DB_DIR, exist_ok=True)

@router.post("/upload")
async def upload_policy_document(
    file: UploadFile = File(...),
    doc_name: str = Form(...),
    doc_type: str = Form(...),
    version: str = Form(...)
):
    """
    Ingests a PDF document, chunks it, and vectorizes it using embeddings.
    (Agent #12: Memory & RAG Agent)
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF documents are supported for RAG.")

    # Save the file locally (simulate ingestion)
    file_path = os.path.join(VECTOR_DB_DIR, f"{doc_name.replace(' ', '_')}_{version}.pdf")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # TODO: Implement actual LangChain chunking + embedding here
    # Example:
    # 1. loader = PyPDFLoader(file_path)
    # 2. pages = loader.load_and_split(RecursiveCharacterTextSplitter())
    # 3. vector_db.add_documents(pages)

    return {
        "status": "success",
        "message": f"Document '{doc_name}' ({version}) successfully vectorized and added to knowledge base.",
        "chunks_indexed": 42, # Mock chunk count
        "agent": "Agent #12 (RAG & Memory)"
    }

@router.get("/policies")
async def list_indexed_policies():
    """
    Returns a list of all active policies currently in the Vector Database.
    """
    # Mock return - normally fetches metadata from Milvus/Pinecone
    return {
        "status": "success",
        "policies": [
            {"icon": "📋", "name": "Return & Refund Policy", "version": "v2.4", "status": "active"},
            {"icon": "🛡️", "name": "Warranty Terms", "version": "v1.8", "status": "active"},
            {"icon": "🚚", "name": "Delivery SLA Agreement", "version": "v3.1", "status": "active"},
        ]
    }

@router.post("/reindex")
async def trigger_full_reindex():
    """
    Triggers Agent #12 to do a full sweep and re-vectorize all stored knowledge.
    """
    return {
        "status": "success",
        "message": "Full re-indexing job queued.",
        "estimated_time_seconds": 30
    }

class ChatRequest(BaseModel):
    query: str
    order_id: Optional[str] = None
    claim_id: Optional[str] = None

@router.post("/chat")
async def rag_chat(request: ChatRequest):
    """
    Answers user questions using the RAG Service.
    """
    from services.rag_service import rag_service
    
    rag_result = rag_service.query_policies(request.query)
    
    context = ""
    if rag_result["policy_match"]:
        for p in rag_result["applicable_policies"]:
            context += f"- {p['document']} ({p['section']}): {p['content_snippet']}\n"
    
    order_context = f"Regarding Order {request.order_id}: " if request.order_id else ""
    claim_context = f"For Claim {request.claim_id}, " if request.claim_id else ""
    
    if not context:
        response_text = f"{claim_context}{order_context}I could not find specific policies matching your query in our knowledge base. Please contact human support."
    else:
        response_text = f"{claim_context}{order_context}Based on our policies:\n{context}\nIf you need further clarification, our Escalation Agent can review this manually."

    return {
        "status": "success",
        "answer": response_text,
        "sources": [p['document'] for p in rag_result.get("applicable_policies", [])]
    }
