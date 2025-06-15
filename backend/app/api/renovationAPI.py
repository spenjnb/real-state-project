from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.renovation import Renovation as RenovationModel
from app.schemas.renovationSchema import Renovation, RenovationCreate, RenovationUpdate

router = APIRouter()

@router.get("/", response_model=List[Renovation])
def get_renovations(
    skip: Optional[int] = Query(0, ge=0),
    limit: Optional[int] = Query(10, ge=1, le=100),
    property_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get a list of renovations with optional filtering.
    """
    query = db.query(RenovationModel)
    
    if property_id:
        query = query.filter(RenovationModel.property_id == property_id)
    if status:
        query = query.filter(RenovationModel.status == status)
    
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=Renovation)
def create_renovation(renovation: RenovationCreate, db: Session = Depends(get_db)):
    """
    Create a new renovation.
    """
    db_renovation = RenovationModel(**renovation.model_dump())
    db.add(db_renovation)
    db.commit()
    db.refresh(db_renovation)
    return db_renovation

@router.get("/{renovation_id}", response_model=Renovation)
def get_renovation(renovation_id: int, db: Session = Depends(get_db)):
    """
    Get a specific renovation by ID.
    """
    renovation = db.query(RenovationModel).filter(RenovationModel.id == renovation_id).first()
    if renovation is None:
        raise HTTPException(status_code=404, detail="Renovation not found")
    return renovation

@router.put("/{renovation_id}", response_model=Renovation)
def update_renovation(renovation_id: int, renovation_update: RenovationUpdate, db: Session = Depends(get_db)):
    """
    Update a renovation.
    """
    db_renovation = db.query(RenovationModel).filter(RenovationModel.id == renovation_id).first()
    if db_renovation is None:
        raise HTTPException(status_code=404, detail="Renovation not found")
    
    update_data = renovation_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_renovation, field, value)
    
    db.commit()
    db.refresh(db_renovation)
    return db_renovation

@router.delete("/{renovation_id}")
def delete_renovation(renovation_id: int, db: Session = Depends(get_db)):
    """
    Delete a renovation.
    """
    db_renovation = db.query(RenovationModel).filter(RenovationModel.id == renovation_id).first()
    if db_renovation is None:
        raise HTTPException(status_code=404, detail="Renovation not found")
    
    db.delete(db_renovation)
    db.commit()
    return {"message": "Renovation deleted successfully"}