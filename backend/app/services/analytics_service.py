from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict
from datetime import datetime, timedelta
from ..models import Property, Sale, Renovation
from ..schemas.analytics import (
    PropertyAnalytics,
    SaleAnalytics,
    RenovationAnalytics,
    MarketTrends,
    InvestmentMetrics
)

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_property_analytics(self) -> PropertyAnalytics:
        # Get property type distribution
        property_types = self.db.query(
            Property.property_type,
            func.count(Property.id).label('count'),
            func.sum(Property.current_value).label('total_value'),
            func.avg(Property.current_value).label('avg_value')
        ).group_by(Property.property_type).all()

        # Get location distribution
        locations = self.db.query(
            Property.city,
            Property.state,
            func.count(Property.id).label('count'),
            func.avg(Property.current_value).label('avg_price'),
            func.sum(Property.current_value).label('total_value')
        ).group_by(Property.city, Property.state).all()

        # Get property statistics
        stats = self.db.query(
            func.avg(Property.bedrooms).label('avg_bedrooms'),
            func.avg(Property.bathrooms).label('avg_bathrooms'),
            func.avg(Property.square_feet).label('avg_square_feet'),
            func.min(Property.square_feet).label('min_square_feet'),
            func.max(Property.square_feet).label('max_square_feet'),
            func.count(Property.id).label('total_properties'),
            func.sum(Property.current_value).label('total_value'),
            func.avg(Property.current_value).label('avg_property_value')
        ).first()

        return PropertyAnalytics(
            property_type_distribution=[
                {
                    "property_type": pt.property_type,
                    "count": pt.count,
                    "total_value": float(pt.total_value),
                    "avg_value": float(pt.avg_value)
                }
                for pt in property_types
            ],
            location_distribution=[
                {
                    "city": loc.city,
                    "state": loc.state,
                    "count": loc.count,
                    "avg_price": float(loc.avg_price),
                    "total_value": float(loc.total_value)
                }
                for loc in locations
            ],
            avg_bedrooms=float(stats.avg_bedrooms),
            avg_bathrooms=float(stats.avg_bathrooms),
            avg_square_feet=float(stats.avg_square_feet),
            min_square_feet=float(stats.min_square_feet),
            max_square_feet=float(stats.max_square_feet),
            total_properties=stats.total_properties,
            total_value=float(stats.total_value),
            avg_property_value=float(stats.avg_property_value)
        )

    def get_sale_analytics(self) -> SaleAnalytics:
        # Get basic sale statistics
        stats = self.db.query(
            func.count(Sale.id).label('total_sales'),
            func.sum(Sale.sale_price).label('total_revenue'),
            func.avg(Sale.sale_price).label('avg_sale_price'),
            func.min(Sale.sale_price).label('min_sale_price'),
            func.max(Sale.sale_price).label('max_sale_price'),
            func.avg(Sale.days_on_market).label('avg_days_on_market')
        ).first()

        # Get sales by month
        sales_by_month = self.db.query(
            func.date_trunc('month', Sale.sale_date).label('month'),
            func.count(Sale.id).label('count'),
            func.sum(Sale.sale_price).label('total')
        ).group_by('month').order_by('month').all()

        # Get sales by property type
        sales_by_type = self.db.query(
            Property.property_type,
            func.count(Sale.id).label('count'),
            func.sum(Sale.sale_price).label('total'),
            func.avg(Sale.sale_price).label('avg_price')
        ).join(Property).group_by(Property.property_type).all()

        return SaleAnalytics(
            total_sales=stats.total_sales,
            total_revenue=float(stats.total_revenue),
            avg_sale_price=float(stats.avg_sale_price),
            min_sale_price=float(stats.min_sale_price),
            max_sale_price=float(stats.max_sale_price),
            avg_days_on_market=float(stats.avg_days_on_market),
            sales_by_month=[
                {
                    "month": month.strftime("%Y-%m"),
                    "count": count,
                    "total": float(total)
                }
                for month, count, total in sales_by_month
            ],
            sales_by_property_type=[
                {
                    "property_type": pt.property_type,
                    "count": pt.count,
                    "total": float(pt.total),
                    "avg_price": float(pt.avg_price)
                }
                for pt in sales_by_type
            ],
            roi_by_property_type=self._calculate_roi_by_property_type()
        )

    def _calculate_roi_by_property_type(self) -> List[Dict]:
        # Calculate ROI for each property type
        roi_data = self.db.query(
            Property.property_type,
            func.avg(
                (Sale.sale_price - Property.purchase_price) / Property.purchase_price * 100
            ).label('avg_roi')
        ).join(Sale).group_by(Property.property_type).all()

        return [
            {
                "property_type": pt.property_type,
                "avg_roi": float(pt.avg_roi)
            }
            for pt in roi_data
        ]

    def get_renovation_analytics(self) -> RenovationAnalytics:
        # Get basic renovation statistics
        stats = self.db.query(
            func.count(Renovation.id).label('total_renovations'),
            func.sum(Renovation.cost).label('total_cost'),
            func.avg(Renovation.cost).label('avg_cost'),
            func.avg(Renovation.duration).label('avg_duration')
        ).first()

        # Get renovations by type
        renovations_by_type = self.db.query(
            Renovation.renovation_type,
            func.count(Renovation.id).label('count'),
            func.sum(Renovation.cost).label('total_cost'),
            func.avg(Renovation.cost).label('avg_cost')
        ).group_by(Renovation.renovation_type).all()

        return RenovationAnalytics(
            total_renovations=stats.total_renovations,
            total_cost=float(stats.total_cost),
            avg_cost=float(stats.avg_cost),
            avg_duration=float(stats.avg_duration),
            renovations_by_type=[
                {
                    "renovation_type": rt.renovation_type,
                    "count": rt.count,
                    "total_cost": float(rt.total_cost),
                    "avg_cost": float(rt.avg_cost)
                }
                for rt in renovations_by_type
            ],
            cost_by_property_type=self._calculate_renovation_cost_by_property_type(),
            roi_by_renovation_type=self._calculate_renovation_roi()
        )

    def _calculate_renovation_cost_by_property_type(self) -> List[Dict]:
        return self.db.query(
            Property.property_type,
            func.sum(Renovation.cost).label('total_cost'),
            func.avg(Renovation.cost).label('avg_cost')
        ).join(Renovation).group_by(Property.property_type).all()

    def _calculate_renovation_roi(self) -> List[Dict]:
        # Calculate ROI for each renovation type
        return self.db.query(
            Renovation.renovation_type,
            func.avg(
                (Property.current_value - Property.purchase_price - Renovation.cost) / 
                (Property.purchase_price + Renovation.cost) * 100
            ).label('avg_roi')
        ).join(Property).group_by(Renovation.renovation_type).all() 