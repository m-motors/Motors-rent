from datetime import datetime
from dataclasses import dataclass

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