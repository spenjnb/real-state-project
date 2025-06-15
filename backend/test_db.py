from app.database import SessionLocal
from app.models.property import Property
from sqlalchemy import text

def test_db_connection():
    try:
        # Create a session
        db = SessionLocal()
        
        # Test raw connection
        result = db.execute(text("SELECT 1"))
        print("Database connection successful!")
        
        # Test Property model
        properties = db.query(Property).all()
        print(f"Found {len(properties)} properties in the database")
        
        # Print property details
        for prop in properties:
            print(f"Property: {prop.address}, {prop.city}, {prop.state}")
            
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    test_db_connection() 