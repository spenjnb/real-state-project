from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.property import Property as PropertyModel
from app.schemas.propertySchema import Property, PropertyCreate, PropertyUpdate

router = APIRouter()

@router.get("/", response_model=List[Property])
def get_properties(
    skip: Optional[int] = Query(0, ge=0),
    limit: Optional[int] = Query(10, ge=1, le=100),
    city: Optional[str] = None,
    property_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get a list of properties with optional filtering.
    """
    query = db.query(PropertyModel)
    
    if city:
        query = query.filter(PropertyModel.city.ilike(f"%{city}%"))
    if property_type:
        query = query.filter(PropertyModel.property_type == property_type)
    
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=Property)
def create_property(property: PropertyCreate, db: Session = Depends(get_db)):
    """
    Create a new property.
    """
    db_property = PropertyModel(**property.model_dump())
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property

@router.get("/{property_id}", response_model=Property)
def get_property(property_id: int, db: Session = Depends(get_db)):
    """
    Get a specific property by ID.
    """
    property = db.query(PropertyModel).filter(PropertyModel.id == property_id).first()
    if property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

@router.put("/{property_id}", response_model=Property)
def update_property(
    property_id: int,
    property_update: PropertyUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a property.
    """
    db_property = db.query(PropertyModel).filter(PropertyModel.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    
    update_data = property_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_property, field, value)
    
    db.commit()
    db.refresh(db_property)
    return db_property

@router.delete("/{property_id}")
def delete_property(property_id: int, db: Session = Depends(get_db)):
    """
    Delete a property.
    """
    db_property = db.query(PropertyModel).filter(PropertyModel.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    
    db.delete(db_property)
    db.commit()
    return {"message": "Property deleted successfully"} 