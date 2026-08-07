from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
import os
import uuid
from typing import List

from services.rag_service import rag_service

router = APIRouter()

class PolicyQuery(BaseModel):
    query: str
    intent: str = None

@router.post("/upload")
async def upload_policy(
    file: UploadFile = File(...),
    document_name: str = Form(...),
    policy_type: str = Form(...),
    version: str = Form(...)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    doc_id = str(uuid.uuid4())
    temp_dir = os.path.join(os.path.dirname(__file__), "..", "data", "temp")
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, f"{doc_id}.pdf")
    
    with open(temp_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    try:
        meta = rag_service.ingest_pdf(temp_path, doc_id, document_name, policy_type, version)
        return {"status": "success", "policy": meta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.get("/")
async def get_policies():
    return {"policies": rag_service.get_all_policies()}

@router.post("/rag/query")
async def query_rag(req: PolicyQuery):
    result = rag_service.query_policies(req.query)
    return result

@router.post("/reindex")
async def reindex_policies():
    # Placeholder for reindex logic
    return {"status": "success", "message": "Knowledge base reindexed successfully."}
