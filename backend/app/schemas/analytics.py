from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

class PropertyTypeDistribution(BaseModel):
    property_type: str
    count: int
    total_value: float
    avg_value: float

class PropertyAnalytics(BaseModel):
    property_type_distribution: List[PropertyTypeDistribution]
    avg_bedrooms: float
    avg_bathrooms: float
    avg_square_feet: float
    avg_lot_size: float

class MarketTrends(BaseModel):
    monthly_avg_prices: List[Dict[str, Any]]
    monthly_sales_volume: List[Dict[str, Any]]

class SaleAnalytics(BaseModel):
    avg_sale_price: float
    avg_days_on_market: float
    total_sales: int
    roi_by_property_type: List[Dict[str, Any]]
    market_trends: MarketTrends

class RenovationAnalytics(BaseModel):
    avg_cost: float
    avg_duration: float
    total_renovations: int
    cost_by_property_type: List[Dict[str, Any]]
    roi_by_renovation_type: List[Dict[str, Any]]

class InvestmentMetrics(BaseModel):
    total_investment: float
    current_value: float
    total_roi: float
    annualized_roi: float
    cash_flow: float
    cap_rate: float
    property_performance: List[dict] 