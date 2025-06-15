from sqlalchemy.orm import Session
from app.models.property import Property
from app.models.sale import Sale
from app.models.renovation import Renovation
from datetime import datetime, timedelta
import random

def seed_database(db: Session):
    # Clear existing data
    db.query(Renovation).delete()
    db.query(Sale).delete()
    db.query(Property).delete()
    db.commit()

    # Create test properties
    properties = [
        Property(
            address="123 Main St",
            city="New York",
            state="NY",
            zip_code="10001",
            property_type="Single Family",
            bedrooms=3,
            bathrooms=2,
            square_feet=2000
        ),
        Property(
            address="456 Park Ave",
            city="New York",
            state="NY",
            zip_code="10022",
            property_type="Apartment",
            bedrooms=2,
            bathrooms=1,
            square_feet=1200
        ),
        Property(
            address="789 Ocean Dr",
            city="Miami",
            state="FL",
            zip_code="33139",
            property_type="Condo",
            bedrooms=4,
            bathrooms=3,
            square_feet=2500
        ),
        Property(
            address="321 Lake View",
            city="Chicago",
            state="IL",
            zip_code="60601",
            property_type="Townhouse",
            bedrooms=3,
            bathrooms=2.5,
            square_feet=1800
        ),
        Property(
            address="654 Mountain Rd",
            city="Denver",
            state="CO",
            zip_code="80202",
            property_type="Single Family",
            bedrooms=5,
            bathrooms=3,
            square_feet=3000
        )
    ]
    db.add_all(properties)
    db.commit()

    # Create test sales
    sales = []
    for property in properties:
        sale_date = datetime.now() - timedelta(days=random.randint(1, 365))
        sales.append(Sale(
            property_id=property.id,
            sale_price=random.randint(300000, 1000000),
            sale_date=sale_date,
            buyer_name=f"Buyer {property.id}",
            buyer_email=f"buyer{property.id}@example.com",
            buyer_phone=f"555-{random.randint(1000, 9999)}",
            agent_name=f"Agent {property.id}",
            agent_email=f"agent{property.id}@example.com",
            agent_phone=f"555-{random.randint(1000, 9999)}",
            days_on_market=random.randint(30, 180)
        ))
    db.add_all(sales)
    db.commit()

    # Create test renovations
    renovations = []
    renovation_types = ["Kitchen Remodel", "Bathroom Update", "Roof Replacement", "Flooring", "Paint"]
    statuses = ["completed", "in_progress", "pending"]
    
    for property in properties:
        # Add 1-3 renovations per property
        for _ in range(random.randint(1, 3)):
            start_date = datetime.now() - timedelta(days=random.randint(1, 180))
            end_date = start_date + timedelta(days=random.randint(7, 60))
            renovations.append(Renovation(
                property_id=property.id,
                renovation_type=random.choice(renovation_types),
                description=f"Renovation project for {property.address}",
                cost=random.randint(5000, 50000),
                start_date=start_date,
                end_date=end_date,
                status=random.choice(statuses)
            ))
    db.add_all(renovations)
    db.commit()

def clear_database(db: Session):
    """Clear all data from the database"""
    db.query(Renovation).delete()
    db.query(Sale).delete()
    db.query(Property).delete()
    db.commit() 