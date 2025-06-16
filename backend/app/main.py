from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.api import propertyAPI, saleAPI, renovationAPI
from app.api.endpoints import analytics
from app.database import engine, get_db
from app.models import Base
from app.models.property import Property
from app.models.sale import Sale
from app.models.renovation import Renovation
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Real Estate Analytics API",
    description="API for real estate property management and analytics",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(propertyAPI.router, prefix="/api/properties", tags=["properties"])
app.include_router(saleAPI.router, prefix="/api/sales", tags=["sales"])
app.include_router(renovationAPI.router, prefix="/api/renovations", tags=["renovations"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Real Estate Analytics API"}

@app.get("/api/test-data")
def test_data(db: Session = Depends(get_db)):
    """Test endpoint to verify data in the database"""
    try:
        properties_count = db.query(Property).count()
        sales_count = db.query(Sale).count()
        renovations_count = db.query(Renovation).count()
        
        logger.info(f"Database contains: {properties_count} properties, {sales_count} sales, {renovations_count} renovations")
        
        return {
            "properties_count": properties_count,
            "sales_count": sales_count,
            "renovations_count": renovations_count,
            "sample_property": db.query(Property).first().__dict__ if properties_count > 0 else None,
            "sample_sale": db.query(Sale).first().__dict__ if sales_count > 0 else None,
            "sample_renovation": db.query(Renovation).first().__dict__ if renovations_count > 0 else None
        }
    except Exception as e:
        logger.error(f"Error in test endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))