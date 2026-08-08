from sqlalchemy import Column, String, Text, DateTime, Float, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class UserHistory(Base):
    __tablename__ = 'user_history'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), default=uuid.uuid4) # Fake or from user
    claim_id = Column(String(50))
    issue_type = Column(String(100))
    description = Column(Text)
    ai_score = Column(Float)
    status = Column(String(50))
