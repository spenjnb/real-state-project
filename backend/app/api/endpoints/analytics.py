from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...database import get_db
from ...services.analytics_service import AnalyticsService
from ...schemas.analytics import (
    PropertyAnalytics,
    SaleAnalytics,
    RenovationAnalytics,
    MarketTrends,
    InvestmentMetrics
)

router = APIRouter()

@router.get("/properties", response_model=PropertyAnalytics)
def get_property_analytics(db: Session = Depends(get_db)):
    """
    Get analytics for properties including:
    - Property type distribution
    - Location distribution
    - Average metrics (bedrooms, bathrooms, square feet)
    - Total and average property values
    """
    service = AnalyticsService(db)
    return service.get_property_analytics()

@router.get("/sales", response_model=SaleAnalytics)
def get_sale_analytics(db: Session = Depends(get_db)):
    """
    Get analytics for sales including:
    - Total sales and revenue
    - Average, min, and max sale prices
    - Sales by month
    - Sales by property type
    - ROI by property type
    """
    service = AnalyticsService(db)
    return service.get_sale_analytics()

@router.get("/renovations", response_model=RenovationAnalytics)
def get_renovation_analytics(db: Session = Depends(get_db)):
    """
    Get analytics for renovations including:
    - Total renovations and costs
    - Average renovation cost and duration
    - Renovations by type
    - Cost by property type
    - ROI by renovation type
    """
    service = AnalyticsService(db)
    return service.get_renovation_analytics() 