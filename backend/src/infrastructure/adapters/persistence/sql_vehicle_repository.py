from typing import List
from domain.models.vehicle import Vehicle, VehicleStatus
from application.ports.output.vehicle_repository import VehicleRepository
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

class MySQLVehicleRepository(VehicleRepository):
    def __init__(self, db: SQLAlchemy):
        self.db = db
    
    def find_by_id(self, id: int) -> Vehicle | None:
        query = """
            SELECT * FROM vehicules WHERE id = %s
        """
        result = self.db.session.execute(query, {"id": id}).fetchone()
        return self._map_to_vehicle(result) if result else None
    
    def find_all(self) -> List[Vehicle]:
        query = """
            SELECT * FROM vehicules
        """
        results = self.db.session.execute(query).fetchall()
        return [self._map_to_vehicle(result) for result in results]
    
    def save(self, vehicle: Vehicle) -> Vehicle:
        query = """
            INSERT INTO vehicules (brand, model, year, horsepower, price, 
                                 category, motor, color, mileage, available, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = self._map_to_params(vehicle)
        result = self.db.session.execute(query, params)
        self.db.session.commit()
        vehicle.id = result.lastrowid
        return vehicle
    
    def update(self, vehicle: Vehicle) -> Vehicle:
        """
        Met à jour un véhicule dans la base de données.
        """
        query = """
            UPDATE vehicules 
            SET brand = %s, model = %s, year = %s, horsepower = %s, price = %s,
                category = %s, motor = %s, color = %s, mileage = %s, available = %s, status = %s
            WHERE id = %s
        """
        params = self._map_to_params(vehicle)
        params["id"] = vehicle.id
        self.db.session.execute(query, params)
        self.db.session.commit()
        return vehicle

    def delete(self, id: int) -> bool:
        """
        Supprime un véhicule de la base de données.
        """
        query = """
            DELETE FROM vehicules WHERE id = %s
        """
        result = self.db.session.execute(query, {"id": id})
        self.db.session.commit()
        return result.rowcount > 0
    
    def toggle_vehicle_status(self, id: int) -> Vehicle | None:
        """
        Bascule un véhicule entre FOR_RENT et FOR_SALE.
        """
        vehicle = self.find_by_id(id)
        if vehicle:
            new_status = VehicleStatus.FOR_SALE if vehicle.status == VehicleStatus.FOR_RENT else VehicleStatus.FOR_RENT
            query = """
                UPDATE vehicules SET status = %s WHERE id = %s
            """
            self.db.session.execute(query, {"status": new_status.value, "id": id})
            self.db.session.commit()
            vehicle.status = new_status
            return vehicle
        return None
    
    def _map_to_vehicle(self, row) -> Vehicle:
        return Vehicle(
            id=row.id,
            brand=row.brand,
            model=row.model,
            year=row.year,
            horsepower=row.horsepower,
            price=row.price,
            category=row.category,
            motor=row.motor,
            color=row.color,
            mileage=row.mileage,
            available=row.available,
            status=VehicleStatus(row.status),  
            created_at=row.created_at
        )
    
    def _map_to_params(self, vehicle: Vehicle) -> dict:
        return {
            "brand": vehicle.brand,
            "model": vehicle.model,
            "year": vehicle.year,
            "horsepower": vehicle.horsepower,
            "price": vehicle.price,
            "category": vehicle.category,
            "motor": vehicle.motor,
            "color": vehicle.color,
            "mileage": vehicle.mileage,
            "available": vehicle.available,
            "status": vehicle.status.value 
        }
