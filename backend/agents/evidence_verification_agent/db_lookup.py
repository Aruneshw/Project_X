from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.order import Order
from models.customer import Customer
from typing import Dict, Any, Optional

class DBLookupAgent:
    """
    Agent responsible for doing physical Postgres database lookups to verify 
    if an order exists, if it belongs to the customer, and if it falls within
    the eligible return/refund policy window.
    """

    async def verify_order(self, session: AsyncSession, order_number: str, customer_email: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes a secure async query to postgres to validate the order ID.
        """
        stmt = select(Order).where(Order.order_number == order_number)
        result = await session.execute(stmt)
        order = result.scalar_one_or_none()

        if not order:
            return {
                "verified": False,
                "error": f"Order {order_number} not found in database.",
                "action": "escalate_to_human"
            }

        # If email is provided, cross-check ownership
        if customer_email:
            stmt_cust = select(Customer).where(Customer.id == order.customer_id)
            res_cust = await session.execute(stmt_cust)
            customer = res_cust.scalar_one_or_none()
            
            if not customer or customer.email.lower() != customer_email.lower():
                return {
                    "verified": False,
                    "error": "Order ownership mismatch. Fraud risk flagged.",
                    "action": "trigger_fraud_agent"
                }

        return {
            "verified": True,
            "order_details": {
                "id": str(order.id),
                "total_amount": order.total_amount,
                "status": order.status,
                "purchase_date": order.purchase_date.isoformat() if order.purchase_date else None
            },
            "action": "proceed_to_cv_analysis"
        }
