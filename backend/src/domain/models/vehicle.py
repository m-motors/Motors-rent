from enum import Enum
from datetime import datetime, timezone
from dataclasses import dataclass, field
from typing import Optional

class VehicleStatus(str, Enum):
    FOR_RENT = "rent"
    FOR_SALE = "sale"

@dataclass
class Vehicle:
    id: Optional[int] = None
    title: str = ''
    description: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    horsepower: Optional[float] = None
    price: Optional[float] = None
    category: Optional[str] = None
    motor: Optional[str] = None
    color: Optional[str] = None
    mileage: Optional[float] = None
    available: bool = True
    status: VehicleStatus = VehicleStatus.FOR_RENT
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "brand": self.brand,
            "model": self.model,
            "year": self.year,
            "horsepower": self.horsepower,
            "price": self.price,
            "category": self.category,
            "motor": self.motor,
            "color": self.color,
            "mileage": self.mileage,
            "available": self.available,
            "status": self.status.value,
            "created_at": self.created_at.isoformat()
        }

    def toggle_status(self):
        """Bascule entre location et vente."""
        self.status = VehicleStatus.SALE if self.status == VehicleStatus.RENT else VehicleStatus.RENT
