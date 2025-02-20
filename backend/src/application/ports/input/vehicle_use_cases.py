from typing import List
from abc import ABC, abstractmethod

from src.domain.models.vehicle import Vehicle

class VehicleUseCase(ABC):
    @abstractmethod
    def get_vehicle(self, id: int) -> Vehicle | None:
        pass
    
    @abstractmethod
    def list_vehicles(self) -> List[Vehicle]:
        pass
    
    @abstractmethod
    def create_vehicle(self, vehicle: Vehicle) -> Vehicle:
        pass
    
    @abstractmethod
    def update_vehicle(self, vehicle: Vehicle) -> Vehicle:
        pass
    
    @abstractmethod
    def delete_vehicle(self, id: int) -> bool:
        pass
