from datetime import datetime, timedelta
import random
import logging
from sqlalchemy.orm import Session
from app.models.property import Property
from app.models.sale import Sale
from app.models.renovation import Renovation
from app.database import Base, engine, SessionLocal

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Realistic property data ranges for Seattle area
PROPERTY_TYPES = ["Single Family", "Condo", "Townhouse", "Apartment"]
CITIES = ["Seattle", "Bellevue", "Redmond", "Kirkland", "Sammamish", "Mercer Island", "Issaquah"]
STATES = ["WA"]
ZIP_CODES = {
    "Seattle": ["98101", "98102", "98103", "98104", "98105", "98106", "98107", "98108", "98109", "98112", "98115", "98116", "98117", "98118", "98119", "98121", "98122", "98125", "98126", "98133", "98136", "98144", "98146", "98148", "98155", "98177", "98178", "98188", "98195", "98199"],
    "Bellevue": ["98004", "98005", "98006", "98007", "98008"],
    "Redmond": ["98052", "98053"],
    "Kirkland": ["98033", "98034"],
    "Sammamish": ["98074", "98075"],
    "Mercer Island": ["98040"],
    "Issaquah": ["98027", "98029"]
}

# Price ranges by property type (in thousands) - Based on 2024 Seattle area market
PRICE_RANGES = {
    "Single Family": (800, 3500),  # $800k - $3.5M
    "Condo": (400, 1200),         # $400k - $1.2M
    "Townhouse": (600, 1500),     # $600k - $1.5M
    "Apartment": (300, 800)       # $300k - $800k
}

# Square footage ranges by property type
SQFT_RANGES = {
    "Single Family": (1500, 5000),
    "Condo": (600, 2000),
    "Townhouse": (1200, 2800),
    "Apartment": (500, 1500)
}

# Lot size ranges by property type (in acres)
LOT_SIZE_RANGES = {
    "Single Family": (0.1, 0.5),
    "Condo": (0.05, 0.1),
    "Townhouse": (0.08, 0.15),
    "Apartment": (0.05, 0.1)
}

# Renovation types and their cost ranges (2024 Seattle area costs)
RENOVATION_TYPES = {
    "Kitchen Remodel": (30000, 80000),      # Mid-range to high-end
    "Bathroom Remodel": (15000, 35000),     # Full remodel
    "Flooring": (8000, 25000),              # Hardwood/LVP
    "Paint": (5000, 12000),                 # Interior/exterior
    "Roof Replacement": (20000, 45000),     # Asphalt to premium materials
    "HVAC Replacement": (12000, 30000),     # Full system replacement
    "Window Replacement": (15000, 40000),   # Energy efficient windows
    "Landscaping": (8000, 25000)            # Basic to premium
}

def generate_property():
    property_type = random.choice(PROPERTY_TYPES)
    city = random.choice(CITIES)
    min_price, max_price = PRICE_RANGES[property_type]
    min_sqft, max_sqft = SQFT_RANGES[property_type]
    min_lot, max_lot = LOT_SIZE_RANGES[property_type]
    
    # Adjust price based on city
    city_multiplier = {
        "Seattle": 1.0,
        "Bellevue": 1.2,
        "Mercer Island": 1.3,
        "Kirkland": 1.1,
        "Redmond": 1.1,
        "Sammamish": 1.15,
        "Issaquah": 1.05
    }
    
    base_price = random.randint(min_price, max_price) * 1000
    purchase_price = base_price * city_multiplier[city]
    current_value = purchase_price * random.uniform(1.05, 1.25)  # 5-25% appreciation
    
    return {
        "property_type": property_type,
        "address": f"{random.randint(100, 9999)} {random.choice(['Main', 'Oak', 'Maple', 'Pine', 'Cedar', 'Lake', 'Park', 'View', 'Hill'])} {random.choice(['St', 'Ave', 'Blvd', 'Dr', 'Way', 'Pl'])}",
        "city": city,
        "state": random.choice(STATES),
        "zip_code": random.choice(ZIP_CODES[city]),
        "bedrooms": random.randint(1, 5),
        "bathrooms": random.uniform(1, 4.5),
        "square_feet": random.randint(min_sqft, max_sqft),
        "lot_size": round(random.uniform(min_lot, max_lot), 2),
        "year_built": random.randint(1950, 2024),
        "purchase_price": purchase_price,
        "current_value": current_value
    }

def generate_sale(property_id, purchase_price):
    sale_price = purchase_price * random.uniform(1.1, 1.3)  # 10-30% profit
    days_on_market = random.randint(30, 180)
    sale_date = datetime.now() - timedelta(days=random.randint(1, 365))
    
    return {
        "property_id": property_id,
        "sale_price": sale_price,
        "sale_date": sale_date,
        "days_on_market": days_on_market,
        "buyer_name": f"Buyer {random.randint(1, 100)}",
        "buyer_email": f"buyer{random.randint(1, 100)}@example.com",
        "buyer_phone": f"206-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
        "agent_name": f"Agent {random.randint(1, 50)}",
        "agent_email": f"agent{random.randint(1, 50)}@example.com",
        "agent_phone": f"206-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
    }

def generate_renovation(property_id):
    renovation_type = random.choice(list(RENOVATION_TYPES.keys()))
    min_cost, max_cost = RENOVATION_TYPES[renovation_type]
    cost = random.randint(min_cost, max_cost)
    duration = random.randint(7, 60)
    start_date = datetime.now() - timedelta(days=random.randint(1, 365))
    end_date = start_date + timedelta(days=duration)
    
    return {
        "property_id": property_id,
        "renovation_type": renovation_type,
        "description": f"Complete {renovation_type.lower()}",
        "cost": cost,
        "start_date": start_date,
        "end_date": end_date,
        "duration": duration,
        "status": random.choice(["Completed", "In Progress", "Planned"])
    }

def seed_database():
    logger.info("Starting database seeding process...")
    
    # Create tables
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Create a session
    db = SessionLocal()
    
    try:
        # Clear existing data
        logger.info("Clearing existing data...")
        db.query(Renovation).delete()
        db.query(Sale).delete()
        db.query(Property).delete()
        db.commit()
        
        # Generate and insert properties
        logger.info("Generating and inserting properties...")
        properties = []
        for i in range(50):  # Generate 50 properties
            property_data = generate_property()
            property = Property(**property_data)
            db.add(property)
            properties.append(property)
            if (i + 1) % 10 == 0:
                logger.info(f"Created {i + 1} properties")
        db.commit()
        logger.info(f"Successfully created {len(properties)} properties")
        
        # Generate sales for each property
        logger.info("Generating sales data...")
        sales_count = 0
        for property in properties:
            if random.random() < 0.7:  # 70% chance of having a sale
                sale_data = generate_sale(property.id, property.purchase_price)
                sale = Sale(**sale_data)
                db.add(sale)
                sales_count += 1
        db.commit()
        logger.info(f"Successfully created {sales_count} sales")
        
        # Generate renovations for each property
        logger.info("Generating renovation data...")
        renovations_count = 0
        for property in properties:
            num_renovations = random.randint(0, 3)  # 0-3 renovations per property
            for _ in range(num_renovations):
                renovation_data = generate_renovation(property.id)
                renovation = Renovation(**renovation_data)
                db.add(renovation)
                renovations_count += 1
        db.commit()
        logger.info(f"Successfully created {renovations_count} renovations")
        
        logger.info("Database seeding completed successfully!")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

def clear_database(db: Session):
    """Clear all data from the database"""
    db.query(Renovation).delete()
    db.query(Sale).delete()
    db.query(Property).delete()
    db.commit() 