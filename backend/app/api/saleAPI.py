from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.sale import Sale as SaleModel
from app.schemas.saleSchema import Sale, SaleCreate, SaleUpdate
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[Sale])
def get_sales(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    property_id: Optional[int] = None,
    sale_price: Optional[float] = None,
    sale_date: Optional[datetime] = None,
    days_on_market: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get a list of sales with optional filtering.
    """
    query = db.query(SaleModel)

    if property_id:
        query = query.filter(SaleModel.property_id == property_id)
    if sale_price:
        query = query.filter(SaleModel.sale_price == sale_price)
    if sale_date:
        query = query.filter(SaleModel.sale_date == sale_date)
    if days_on_market:
        query = query.filter(SaleModel.days_on_market == days_on_market)

    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=Sale)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    """
    Create a new sale.
    """
    db_sale = SaleModel(**sale.model_dump())
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.get("/{sale_id}", response_model=Sale)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    """
    Get a specific sale by ID.
    """
    sale = db.query(SaleModel).filter(SaleModel.id == sale_id).first()
    if sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@router.put("/{sale_id}", response_model=Sale)
def update_sale(sale_id: int, sale_update: SaleUpdate, db: Session = Depends(get_db)):
    """
    Update a sale.
    """
    db_sale = db.query(SaleModel).filter(SaleModel.id == sale_id).first()
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    
    update_data = sale_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_sale, field, value)
    
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.delete("/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    """
    Delete a sale.
    """
    db_sale = db.query(SaleModel).filter(SaleModel.id == sale_id).first()
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    
    db.delete(db_sale)
    db.commit()
    return {"message": "Sale deleted successfully"}