from typing import List
from abc import ABC, abstractmethod

from src.domain.models.vehicle import Vehicle

class VehicleRepository(ABC):
    @abstractmethod
    def find_by_id(self, id: int) -> Vehicle | None:
        pass
    
    @abstractmethod
    def find_all(self) -> List[Vehicle]:
        pass
    
    @abstractmethod
    def save(self, vehicle: Vehicle) -> Vehicle:
        pass
    
    @abstractmethod
    def update(self, vehicle: Vehicle) -> Vehicle:
        pass
    
    @abstractmethod
    def delete(self, id: int) -> bool:
        pass

    @abstractmethod
    def toggle_vehicle_status(self, id: int) -> Vehicle | None: 
        pass