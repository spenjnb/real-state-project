from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from .property import Property
from .sale import Sale
from .renovation import Renovation

__all__ = ['Base', 'Property', 'Sale', 'Renovation'] 