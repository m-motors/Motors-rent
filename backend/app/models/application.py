from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
import enum

from backend.app.database import Base


class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    type = Column(String)  # "sale" or "rental"
    status = Column(Enum(ApplicationStatus))
    created_at = Column(DateTime)

    user = relationship("User", back_populates="applications")
    vehicle = relationship("Vehicle")
    documents = relationship("Document", back_populates="application")
