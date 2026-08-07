from sqlalchemy import Column, String, Float, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class Order(Base):
    __tablename__ = 'orders'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey('customers.id'), nullable=False)
    order_number = Column(String(100), unique=True, nullable=False, index=True)
    product_name = Column(String(255), nullable=False)
    product_category = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(50), default="delivered")
    
    purchase_date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
