# src/domain/models/vehicle.py
from dataclasses import dataclass
from datetime import datetime
from enum import Enum

class VehicleStatus(str, Enum):
    FOR_RENT = "FOR_RENT"
    FOR_SALE = "FOR_SALE"

@dataclass
class Vehicle:
    id: int | None
    brand: str
    model: str
    year: int
    horsepower: int
    price: int
    category: str
    motor: str
    color: str
    mileage: int
    available: bool
    status: VehicleStatus  # Ajout du statut
    created_at: datetime | None = None

    def toggle_status(self):
        """Bascule entre location et vente."""
        self.status = VehicleStatus.FOR_SALE if self.status == VehicleStatus.FOR_RENT else VehicleStatus.FOR_RENT
