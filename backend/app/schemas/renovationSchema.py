from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RenovationBase(BaseModel):
    property_id: int
    renovation_type: str
    cost: float
    completion_date: datetime
    description: str

class RenovationCreate(RenovationBase):
    pass

class RenovationUpdate(BaseModel):
    property_id: Optional[int] = None
    renovation_type: Optional[str] = None
    cost: Optional[float] = None
    completion_date: Optional[datetime] = None
    description: Optional[str] = None

class Renovation(RenovationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True