from dataclasses import dataclass
from datetime import datetime

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
    created_at: datetime | None = None