from domain.models.vehicle import Vehicle
from application.ports.input.vehicle_use_cases import VehicleUseCase
from application.ports.output.vehicle_repository import VehicleRepository

class VehicleService(VehicleUseCase):
    def __init__(self, vehicle_repository: VehicleRepository):
        self.vehicle_repository = vehicle_repository
    
    def get_vehicle(self, id: int) -> Vehicle | None:
        return self.vehicle_repository.find_by_id(id)
    
    def list_vehicles(self) -> List[Vehicle]:
        return self.vehicle_repository.find_all()
    
    def create_vehicle(self, vehicle: Vehicle) -> Vehicle:
        return self.vehicle_repository.save(vehicle)
    
    def update_vehicle(self, vehicle: Vehicle) -> Vehicle:
        return self.vehicle_repository.update(vehicle)
    
    def delete_vehicle(self, id: int) -> bool:
        return self.vehicle_repository.delete(id)

    def toggle_vehicle_status(self, id: int) -> Vehicle | None:
        """
        Bascule un véhicule entre 'FOR_RENT' et 'FOR_SALE'.
        """
        return self.vehicle_repository.toggle_vehicle_status(id)
