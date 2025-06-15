from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SaleBase(BaseModel):
    property_id: int
    sale_price: float
    sale_date: datetime
    days_on_market: int

class SaleCreate(SaleBase):
    pass

class SaleUpdate(BaseModel):
    property_id: Optional[int] = None
    sale_price: Optional[float] = None
    sale_date: Optional[datetime] = None
    days_on_market: Optional[int] = None

class Sale(SaleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True