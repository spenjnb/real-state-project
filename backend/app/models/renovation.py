from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base

class Renovation(Base):
    __tablename__ = "renovations"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    renovation_type = Column(String)  # e.g., "Kitchen", "Bathroom", "Roof"
    cost = Column(Float)
    completion_date = Column(DateTime)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    property = relationship("Property", back_populates="renovations")

    def __repr__(self):
        return f"<Renovation {self.renovation_type} at {self.cost}>" 