from dataclasses import dataclass
from datetime import datetime
from enum import Enum

class VehicleStatus(str, Enum):
    FOR_RENT = "rent"
    FOR_SALE = "sale"

@dataclass
class Vehicle:
    id: int | None
    brand: str = ""
    model: str = ""
    year: int = 0
    horsepower: int = 0
    price: int = 0
    category: str = ""
    motor: str = ""
    color: str = ""
    mileage: int = 0
    available: bool = True
    created_at: datetime = None
    mileage: int
    available: bool
    status: VehicleStatus
    created_at: datetime | None = None


    def toggle_status(self):
        """Bascule entre location et vente."""
        self.status = VehicleStatus.FOR_SALE if self.status == VehicleStatus.FOR_RENT else VehicleStatus.FOR_RENT
