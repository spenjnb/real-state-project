from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RenovationBase(BaseModel):
    property_id: int
    renovation_type: str
    description: str
    cost: float
    start_date: datetime
    end_date: datetime
    status: str

class RenovationCreate(RenovationBase):
    pass

class RenovationUpdate(BaseModel):
    property_id: Optional[int] = None
    renovation_type: Optional[str] = None
    description: Optional[str] = None
    cost: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None

class Renovation(RenovationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True