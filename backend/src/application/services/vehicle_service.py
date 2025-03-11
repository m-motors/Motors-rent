from typing import List, Optional, Dict

from src.domain.models.vehicle import Vehicle
from src.domain.models.vehicle import VehicleStatus
from src.application.ports.input.vehicle_use_cases import VehicleUseCase
from src.application.ports.output.vehicle_repository import VehicleRepository

class VehicleService(VehicleUseCase):
    def __init__(self, vehicle_repository: VehicleRepository):
        self.vehicle_repository = vehicle_repository

    def get_vehicle(self, id: int) -> Vehicle | None :
        return self.vehicle_repository.find_by_id(id)

    def list_vehicles(self) -> List[Vehicle]:
        return self.vehicle_repository.find_all()

    def create_vehicle(self, vehicle: Vehicle) -> Vehicle:
        return self.vehicle_repository.save(vehicle)

    def update_vehicle(self, id: int, new_data: Dict) -> Vehicle:
        vehicle = self.vehicle_repository.find_by_id(id)
        if not vehicle:
            raise ValueError("Vehicle not found")

        allowed_fields = {"brand", "model", "year", "horsepower", "price", "category", "motor", "color", "mileage", "available", "status"}
        for field, value in new_data.items():
            if field in allowed_fields:
                if field == "status":
                    try:
                        vehicle.status = VehicleStatus(value)
                    except ValueError:
                        raise ValueError(f"Invalid status: {value}")
                else:
                    setattr(vehicle, field, value)

        return self.vehicle_repository.update(vehicle)

    def delete_vehicle(self, id: int) -> bool:
        return self.vehicle_repository.delete(id)

    def toggle_vehicle_status(self, id: int) -> Vehicle | None:
        """
        Bascule un véhicule entre 'rent' et 'sale'.
        """
        return self.vehicle_repository.toggle_vehicle_status(id)
