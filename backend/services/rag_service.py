import os
import json
from typing import List, Dict, Any
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

FAISS_INDEX_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "faiss_index")
POLICIES_META_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "policies_meta.json")

class RAGService:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vectorstore = None
        self.metadata_store = []
        self._load_or_create_index()
        self._load_metadata()

    def _load_or_create_index(self):
        os.makedirs(os.path.dirname(FAISS_INDEX_PATH), exist_ok=True)
        if os.path.exists(FAISS_INDEX_PATH):
            try:
                self.vectorstore = FAISS.load_local(FAISS_INDEX_PATH, self.embeddings, allow_dangerous_deserialization=True)
                return
            except Exception as e:
                print(f"Error loading FAISS index: {e}")
        
        # Create empty vectorstore
        empty_doc = Document(page_content="empty", metadata={"id": "empty"})
        self.vectorstore = FAISS.from_documents([empty_doc], self.embeddings)
        # We don't save the empty one immediately to avoid overwriting valid ones if it was a transient error, 
        # but for fresh starts it's fine.

    def _load_metadata(self):
        if os.path.exists(POLICIES_META_PATH):
            with open(POLICIES_META_PATH, "r") as f:
                self.metadata_store = json.load(f)

    def _save_metadata(self):
        with open(POLICIES_META_PATH, "w") as f:
            json.dump(self.metadata_store, f)

    def ingest_pdf(self, file_path: str, document_id: str, document_name: str, policy_type: str, version: str):
        loader = PyMuPDFLoader(file_path)
        docs = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        chunks = text_splitter.split_documents(docs)
        
        for i, chunk in enumerate(chunks):
            chunk.metadata.update({
                "document_id": document_id,
                "document_name": document_name,
                "policy_type": policy_type,
                "version": version,
                "chunk_id": f"{document_id}_{i}"
            })
            
        self.vectorstore.add_documents(chunks)
        self.vectorstore.save_local(FAISS_INDEX_PATH)
        
        policy_meta = {
            "document_id": document_id,
            "document_name": document_name,
            "policy_type": policy_type,
            "version": version,
            "chunks_count": len(chunks)
        }
        self.metadata_store.append(policy_meta)
        self._save_metadata()
        
        return policy_meta

    def query_policies(self, query: str, top_k: int = 3) -> Dict[str, Any]:
        if not self.vectorstore:
            return {"policy_match": False, "applicable_policies": [], "policy_match_score": 0.0}
            
        # Using similarity_search_with_score to get the FAISS L2 distance
        results = self.vectorstore.similarity_search_with_score(query, k=top_k)
        
        applicable_policies = []
        best_score = 0.0
        
        for doc, score in results:
            if doc.metadata.get("id") == "empty": continue
            
            # Convert FAISS L2 distance to a mock "confidence/match score" (0 to 1)
            # Smaller distance = higher match. Let's just mock a rough conversion.
            match_score = max(0.0, 1.0 - (score / 2.0)) 
            if match_score > best_score:
                best_score = match_score
                
            applicable_policies.append({
                "document": doc.metadata.get("document_name", "Unknown Document"),
                "section": f"Page {doc.metadata.get('page', 1)}",
                "page": doc.metadata.get('page', 1),
                "version": doc.metadata.get("version", "1.0"),
                "content_snippet": doc.page_content[:200] + "...",
                "relevance_score": round(match_score * 100, 1),
                "reason": f"Content matches the query intent."
            })
            
        is_match = len(applicable_policies) > 0 and best_score > 0.3
        
        return {
            "policy_match": is_match,
            "policy_match_score": round(best_score * 100, 1),
            "applicable_policies": applicable_policies,
            "conflict_detected": False, # Mock conflict logic
            "policy_reasoning": "Retrieved relevant sections based on semantic similarity.",
        }

    def get_all_policies(self):
        return self.metadata_store

rag_service = RAGService()
