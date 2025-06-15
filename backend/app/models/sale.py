from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), index=True)
    sale_price = Column(Float)
    sale_date = Column(DateTime)
    buyer_name = Column(String)
    buyer_email = Column(String)
    buyer_phone = Column(String)
    agent_name = Column(String)
    agent_email = Column(String)
    agent_phone = Column(String)
    days_on_market = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    property = relationship("Property", back_populates="sales")

    def __repr__(self):
        return f"<Sale {self.sale_price} on {self.sale_date}>" 