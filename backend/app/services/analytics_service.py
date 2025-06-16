from sqlalchemy.orm import Session
from sqlalchemy import func, desc, case, and_
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.models.property import Property
from app.models.sale import Sale
from app.models.renovation import Renovation
from app.schemas.analytics import (
    PropertyAnalytics,
    SaleAnalytics,
    RenovationAnalytics,
    PropertyTypeDistribution,
    MarketTrends
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

        property_type_distribution = [
            PropertyTypeDistribution(
                property_type=pt.property_type,
                count=pt.count,
                total_value=float(pt.total_value or 0),
                avg_value=float(pt.avg_value or 0)
            )
            for pt in property_types
        ]

        # Get average metrics
        avg_metrics = self.db.query(
            func.avg(Property.bedrooms).label('avg_bedrooms'),
            func.avg(Property.bathrooms).label('avg_bathrooms'),
            func.avg(Property.square_feet).label('avg_square_feet'),
            func.avg(Property.lot_size).label('avg_lot_size')
        ).first()

        return PropertyAnalytics(
            property_type_distribution=property_type_distribution,
            avg_bedrooms=float(avg_metrics.avg_bedrooms or 0),
            avg_bathrooms=float(avg_metrics.avg_bathrooms or 0),
            avg_square_feet=float(avg_metrics.avg_square_feet or 0),
            avg_lot_size=float(avg_metrics.avg_lot_size or 0)
        )

    def get_sale_analytics(self) -> SaleAnalytics:
        # Get sale metrics
        sale_metrics = self.db.query(
            func.avg(Sale.sale_price).label('avg_sale_price'),
            func.avg(Sale.days_on_market).label('avg_days_on_market'),
            func.count(Sale.id).label('total_sales')
        ).first()

        # Get ROI by property type
        roi_by_property_type = self._calculate_roi_by_property_type()

        # Get market trends
        market_trends = self._calculate_market_trends()

        return SaleAnalytics(
            avg_sale_price=float(sale_metrics.avg_sale_price or 0),
            avg_days_on_market=float(sale_metrics.avg_days_on_market or 0),
            total_sales=sale_metrics.total_sales or 0,
            roi_by_property_type=roi_by_property_type,
            market_trends=market_trends
        )

    def get_renovation_analytics(self) -> RenovationAnalytics:
        # Get renovation metrics
        renovation_metrics = self.db.query(
            func.avg(Renovation.cost).label('avg_cost'),
            func.avg(Renovation.duration).label('avg_duration'),
            func.count(Renovation.id).label('total_renovations')
        ).first()

        # Get cost by property type
        cost_by_property_type = self.db.query(
            Property.property_type,
            func.sum(Renovation.cost).label('total_cost'),
            func.avg(Renovation.cost).label('avg_cost')
        ).join(Renovation).group_by(Property.property_type).all()

        cost_by_property_type = [
            {
                "property_type": pt.property_type,
                "total_cost": float(pt.total_cost or 0),
                "avg_cost": float(pt.avg_cost or 0)
            }
            for pt in cost_by_property_type
        ]

        # Get ROI by renovation type
        roi_by_renovation_type = self.db.query(
            Renovation.renovation_type,
            func.avg(
                case(
                    (and_(
                        Property.purchase_price + Renovation.cost > 0,
                        Property.current_value > 0
                    ),
                    (Property.current_value - Property.purchase_price - Renovation.cost) / 
                    (Property.purchase_price + Renovation.cost) * 100),
                    else_=0
                )
            ).label('avg_roi')
        ).join(Property).group_by(Renovation.renovation_type).all()

        roi_by_renovation_type = [
            {
                "renovation_type": rt.renovation_type,
                "avg_roi": float(rt.avg_roi or 0)
            }
            for rt in roi_by_renovation_type
        ]

        return RenovationAnalytics(
            avg_cost=float(renovation_metrics.avg_cost or 0),
            avg_duration=float(renovation_metrics.avg_duration or 0),
            total_renovations=renovation_metrics.total_renovations or 0,
            cost_by_property_type=cost_by_property_type,
            roi_by_renovation_type=roi_by_renovation_type
        )

    def _calculate_roi_by_property_type(self) -> List[Dict[str, Any]]:
        roi_data = self.db.query(
            Property.property_type,
            func.avg(
                case(
                    (and_(
                        Property.purchase_price > 0,
                        Sale.sale_price > 0
                    ),
                    (Sale.sale_price - Property.purchase_price) / 
                    Property.purchase_price * 100),
                    else_=0
                )
            ).label('avg_roi')
        ).join(Sale).group_by(Property.property_type).all()

        return [
            {
                "property_type": pt.property_type,
                "avg_roi": float(pt.avg_roi or 0)
            }
            for pt in roi_data
        ]

    def _calculate_market_trends(self) -> MarketTrends:
        # Get sales data for the last 12 months
        twelve_months_ago = datetime.utcnow() - timedelta(days=365)
        monthly_sales = self.db.query(
            func.date_trunc('month', Sale.sale_date).label('month'),
            func.avg(Sale.sale_price).label('avg_price'),
            func.count(Sale.id).label('sales_count')
        ).filter(Sale.sale_date >= twelve_months_ago).group_by('month').order_by('month').all()

        return MarketTrends(
            monthly_avg_prices=[
                {
                    "month": sale.month.strftime("%Y-%m"),
                    "avg_price": float(sale.avg_price or 0)
                }
                for sale in monthly_sales
            ],
            monthly_sales_volume=[
                {
                    "month": sale.month.strftime("%Y-%m"),
                    "sales_count": sale.sales_count or 0
                }
                for sale in monthly_sales
            ]
        ) 