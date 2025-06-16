from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.renovation import Renovation
from app.models.sale import Sale
from app.models.property import Property
from sqlalchemy import func, desc
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/renovations")
def get_renovation_analytics(db: Session = Depends(get_db)):
    # Calculate average cost and duration
    avg_metrics = db.query(
        func.avg(Renovation.cost).label('avg_cost'),
        func.avg(Renovation.duration).label('avg_duration'),
        func.count(Renovation.id).label('total_renovations')
    ).first()

    # Get cost by property type
    cost_by_type = db.query(
        Property.property_type,
        func.avg(Renovation.cost).label('avg_cost'),
        func.sum(Renovation.cost).label('total_cost')
    ).join(Property).group_by(Property.property_type).all()

    # Get ROI by renovation type
    roi_by_type = db.query(
        Renovation.renovation_type,
        func.avg(Renovation.roi).label('avg_roi')
    ).group_by(Renovation.renovation_type).all()

    return {
        "avg_cost": avg_metrics.avg_cost or 0,
        "avg_duration": avg_metrics.avg_duration or 0,
        "total_renovations": avg_metrics.total_renovations or 0,
        "cost_by_property_type": [
            {
                "property_type": item.property_type,
                "avg_cost": item.avg_cost or 0,
                "total_cost": item.total_cost or 0
            }
            for item in cost_by_type
        ],
        "roi_by_renovation_type": [
            {
                "renovation_type": item.renovation_type,
                "avg_roi": item.avg_roi or 0
            }
            for item in roi_by_type
        ]
    }

@router.get("/sales")
def get_sales_analytics(db: Session = Depends(get_db)):
    # Calculate average sale price and days on market
    avg_metrics = db.query(
        func.avg(Sale.sale_price).label('avg_sale_price'),
        func.avg(Sale.days_on_market).label('avg_days_on_market'),
        func.count(Sale.id).label('total_sales')
    ).first()

    # Get ROI by property type
    roi_by_type = db.query(
        Property.property_type,
        func.avg(Sale.roi).label('avg_roi')
    ).join(Property).group_by(Property.property_type).all()

    # Get market trends (last 12 months)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)
    
    monthly_avg_prices = db.query(
        func.date_trunc('month', Sale.sale_date).label('month'),
        func.avg(Sale.sale_price).label('avg_price')
    ).filter(
        Sale.sale_date >= start_date
    ).group_by(
        func.date_trunc('month', Sale.sale_date)
    ).order_by(
        func.date_trunc('month', Sale.sale_date)
    ).all()

    monthly_sales_volume = db.query(
        func.date_trunc('month', Sale.sale_date).label('month'),
        func.count(Sale.id).label('sales_count')
    ).filter(
        Sale.sale_date >= start_date
    ).group_by(
        func.date_trunc('month', Sale.sale_date)
    ).order_by(
        func.date_trunc('month', Sale.sale_date)
    ).all()

    return {
        "avg_sale_price": avg_metrics.avg_sale_price or 0,
        "avg_days_on_market": avg_metrics.avg_days_on_market or 0,
        "total_sales": avg_metrics.total_sales or 0,
        "roi_by_property_type": [
            {
                "property_type": item.property_type,
                "avg_roi": item.avg_roi or 0
            }
            for item in roi_by_type
        ],
        "market_trends": {
            "monthly_avg_prices": [
                {
                    "month": item.month.strftime("%Y-%m"),
                    "avg_price": item.avg_price or 0
                }
                for item in monthly_avg_prices
            ],
            "monthly_sales_volume": [
                {
                    "month": item.month.strftime("%Y-%m"),
                    "sales_count": item.sales_count or 0
                }
                for item in monthly_sales_volume
            ]
        }
    }