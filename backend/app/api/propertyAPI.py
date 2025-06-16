from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.property import Property
from app.schemas.propertySchema import PropertyCreate, Property as PropertyResponse

router = APIRouter()

@router.get("/", response_model=List[PropertyResponse])
def get_properties(
    db: Session = Depends(get_db),
    property_type: Optional[str] = Query(None, description="Filter by property type (Single Family, Condo, Townhouse, Apartment)"),
    city: Optional[str] = Query(None, description="Filter by city"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    min_bedrooms: Optional[float] = Query(None, description="Minimum number of bedrooms"),
    max_bedrooms: Optional[float] = Query(None, description="Maximum number of bedrooms"),
    min_bathrooms: Optional[float] = Query(None, description="Minimum number of bathrooms"),
    max_bathrooms: Optional[float] = Query(None, description="Maximum number of bathrooms"),
    min_sqft: Optional[int] = Query(None, description="Minimum square footage"),
    max_sqft: Optional[int] = Query(None, description="Maximum square footage")
):
    """
    Get all properties with optional filtering.
    """
    query = db.query(Property)
    
    # Apply filters if provided
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if city:
        query = query.filter(Property.city == city)
    if min_price:
        query = query.filter(Property.current_value >= min_price)
    if max_price:
        query = query.filter(Property.current_value <= max_price)
    if min_bedrooms:
        query = query.filter(Property.bedrooms >= min_bedrooms)
    if max_bedrooms:
        query = query.filter(Property.bedrooms <= max_bedrooms)
    if min_bathrooms:
        query = query.filter(Property.bathrooms >= min_bathrooms)
    if max_bathrooms:
        query = query.filter(Property.bathrooms <= max_bathrooms)
    if min_sqft:
        query = query.filter(Property.square_feet >= min_sqft)
    if max_sqft:
        query = query.filter(Property.square_feet <= max_sqft)
    
    return query.all()

@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: int, db: Session = Depends(get_db)):
    """
    Get a specific property by ID.
    """
    property = db.query(Property).filter(Property.id == property_id).first()
    if property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

@router.post("/", response_model=PropertyResponse)
def create_property(property: PropertyCreate, db: Session = Depends(get_db)):
    """
    Create a new property.
    """
    db_property = Property(**property.model_dump())
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property

@router.get("/types", response_model=List[str])
def get_property_types():
    """
    Get all available property types.
    """
    return ["Single Family", "Condo", "Townhouse", "Apartment"]

@router.get("/cities", response_model=List[str])
def get_cities():
    """
    Get all available cities.
    """
    return ["Seattle", "Bellevue", "Redmond", "Kirkland", "Sammamish", "Mercer Island", "Issaquah"]

@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: int,
    property_update: PropertyCreate,
    db: Session = Depends(get_db)
):
    """
    Update a property.
    """
    db_property = db.query(Property).filter(Property.id == property_id).first()
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
    db_property = db.query(Property).filter(Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    
    db.delete(db_property)
    db.commit()
    return {"message": "Property deleted successfully"} 