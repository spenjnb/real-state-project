from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Renovation(Base):
    __tablename__ = "renovations"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), index=True)
    renovation_type = Column(String, index=True)
    description = Column(String)
    cost = Column(Float)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    duration = Column(Integer)  
    status = Column(String, index=True)  # pending, in_progress, completed, cancelled
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relationship
    property = relationship("Property", back_populates="renovations")

    def __repr__(self):
        return f"<Renovation {self.renovation_type} at {self.cost}>" 