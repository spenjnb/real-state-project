from fastapi import APIRouter

api_router = APIRouter()

from .properties import router as properties_router
from .sales import router as sales_router
from .renovations import router as renovations_router

api_router.include_router(properties_router, prefix="/properties", tags=["properties"])
api_router.include_router(sales_router, prefix="/sales", tags=["sales"])
api_router.include_router(renovations_router, prefix="/renovations", tags=["renovations"]) 