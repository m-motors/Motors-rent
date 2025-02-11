from sqlalchemy import Column, Integer, String, Float, Enum, DateTime
import enum
from backend.app.database import Base


class VehicleType(str, enum.Enum):
    SALE = "sale"
    RENTAL = "rental"


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True)
    model = Column(String)
    year = Column(Integer)
    mileage = Column(Integer)
    price = Column(Float)
    type = Column(Enum(VehicleType))
    status = Column(String)
    features = Column(String)
    images = Column(String)
    created_at = Column(DateTime)
