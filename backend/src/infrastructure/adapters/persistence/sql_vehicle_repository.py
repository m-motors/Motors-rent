from typing import List
from domain.models.vehicle import Vehicle
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
                                 category, motor, color, mileage, available)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = self._map_to_params(vehicle)
        result = self.db.session.execute(query, params)
        self.db.session.commit()
        vehicle.id = result.lastrowid
        return vehicle
    
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
            "available": vehicle.available
        }
