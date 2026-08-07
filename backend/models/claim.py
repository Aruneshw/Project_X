from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Float, JSON, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class Claim(Base):
    """
    The core entity of the platform. Represents a customer's dispute or request.
    """
    __tablename__ = 'claims'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey('customers.id'), nullable=False)
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.id'), nullable=False)
    
    issue_type = Column(String(100), nullable=False) # e.g., 'damage', 'missing_item', 'refund'
    description = Column(Text, nullable=False)
    
    # AI Scoring
    ai_confidence_score = Column(Float)  # 0 to 100
    ai_fraud_score = Column(Float)       # 0 to 100
    ai_resolution_recommendation = Column(JSON) # e.g., {"action": "refund", "amount": 100}
    
    # State tracking
    status = Column(String(50), default="open") # open, processing, escalated, resolved, rejected
    resolution_rationale = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
