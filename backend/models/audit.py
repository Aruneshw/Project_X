from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class AuditLog(Base):
    """
    Immutable ledger of every AI decision and human override for Explainability Framework.
    """
    __tablename__ = 'audit_logs'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id = Column(UUID(as_uuid=True), ForeignKey('claims.id'), nullable=False)
    
    agent_name = Column(String(100), nullable=False) # e.g., 'ScoreEvaluationAgent', 'EscalationAgent'
    action_taken = Column(String(255), nullable=False)
    
    decision_payload = Column(JSON) # Full dump of the reasoning, policy citations, and math
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
