import asyncio
import uuid
from datetime import datetime, timezone
from database.postgres.connection import engine, Base
from models.order import Order
from models.customer import Customer
from sqlalchemy.ext.asyncio import AsyncSession

async def seed_database():
    """
    Seeds the PostgreSQL database with initial schemas and mock data for testing 
    actual database lookups during order & document verification.
    """
    print("Creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        
    print("Inserting mock data...")
    async with AsyncSession(engine) as session:
        # Create mock customer
        customer_id = uuid.uuid4()
        customer = Customer(
            id=customer_id,
            email="jane@example.com",
            full_name="Jane Doe",
            phone_number="+1555019283",
            loyalty_tier="Gold"
        )
        session.add(customer)

        # Create mock order for verification
        order = Order(
            id=uuid.uuid4(),
            customer_id=customer_id,
            order_number="ORD-7742-X9", # Specifically matching the demo order
            total_amount=1299.00,
            status="delivered",
            purchase_date=datetime(2026, 8, 1, 10, 0, tzinfo=timezone.utc)
        )
        session.add(order)

        await session.commit()
    print("Database seeding complete. Ready for production verification lookups.")

if __name__ == "__main__":
    asyncio.run(seed_database())
