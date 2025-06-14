from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PropertyBase(BaseModel):
    address: str
    city: str
    state: str
    zip_code: str
    property_type: str
    bedrooms: int
    bathrooms: float
    square_feet: int
    lot_size: Optional[float] = None
    year_built: Optional[int] = None

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    property_type: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[int] = None
    lot_size: Optional[float] = None
    year_built: Optional[int] = None

class Property(PropertyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 