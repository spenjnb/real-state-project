from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PropertyTypeDistribution(BaseModel):
    property_type: str
    count: int
    total_value: float
    avg_value: float

class LocationDistribution(BaseModel):
    city: str
    state: str
    count: int
    avg_price: float
    total_value: float

class PropertyAnalytics(BaseModel):
    property_type_distribution: List[PropertyTypeDistribution]
    location_distribution: List[LocationDistribution]
    avg_bedrooms: float
    avg_bathrooms: float
    avg_square_feet: float
    min_square_feet: float
    max_square_feet: float
    total_properties: int
    total_value: float
    avg_property_value: float

class SaleAnalytics(BaseModel):
    total_sales: int
    total_revenue: float
    avg_sale_price: float
    min_sale_price: float
    max_sale_price: float
    avg_days_on_market: float
    sales_by_month: List[dict]
    sales_by_property_type: List[dict]
    roi_by_property_type: List[dict]

class RenovationAnalytics(BaseModel):
    total_renovations: int
    total_cost: float
    avg_cost: float
    avg_duration: float
    renovations_by_type: List[dict]
    cost_by_property_type: List[dict]
    roi_by_renovation_type: List[dict]

class MarketTrends(BaseModel):
    avg_price_trend: List[dict]
    sales_volume_trend: List[dict]
    days_on_market_trend: List[dict]
    price_per_sqft_trend: List[dict]

class InvestmentMetrics(BaseModel):
    total_investment: float
    current_value: float
    total_roi: float
    annualized_roi: float
    cash_flow: float
    cap_rate: float
    property_performance: List[dict] 