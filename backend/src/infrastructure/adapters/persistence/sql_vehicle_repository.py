from typing import List
from sqlalchemy import text
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError

from src.domain.models.vehicle import Vehicle
from src.domain.models.vehicle import Vehicle, VehicleStatus
from src.application.ports.output.vehicle_repository import VehicleRepository

class SQLVehicleRepository(VehicleRepository):
    def __init__(self, db: SQLAlchemy):
        self.db = db
    
    def find_by_id(self, id: int) -> Vehicle | None:
        query = text("""
            SELECT * FROM vehicules WHERE id = :id
        """)
        result = self.db.session.execute(query, {"id": id}).fetchone()
        return self._map_to_vehicle(result._asdict()) if result else None
    
    def find_all(self) -> List[Vehicle]:
        query = text("""
            SELECT * FROM vehicules
        """)
        results = self.db.session.execute(query).fetchall()
        return [self._map_to_vehicle(row._asdict()) for row in results]

    def save(self, vehicle: Vehicle) -> Vehicle:
        try:
            query = text("""
                INSERT INTO vehicules (title, description, brand, model, year, horsepower, price, category, motor, color, mileage, available, status, created_at)
                VALUES (:title, :description, :brand, :model, :year, :horsepower, :price, :category, :motor, :color, :mileage, :available, :status, current_timestamp)
                RETURNING id
            """)
            params = self._map_to_params(vehicle)
            result = self.db.session.execute(query, params)
            vehicle.id = result.fetchone()[0]
            self.db.session.commit()
            return vehicle
        except SQLAlchemyError as e:
            self.db.session.rollback()
            raise e
    
    def update(self, vehicle: Vehicle) -> Vehicle:
        try:
            query = text("""
                UPDATE vehicules 
                SET title = :title, description = :description, brand = :brand, model = :model, year = :year,
                    horsepower = :horsepower, price = :price, category = :category, motor = :motor, color = :color,
                    mileage = :mileage, available = :available, status = :status, created_at = :created_at
                WHERE id = :id
            """)
            params = self._map_to_params(vehicle)
            params["id"] = vehicle.id
            result = self.db.session.execute(query, params)
            self.db.session.commit()
            return vehicle
        except SQLAlchemyError as e:
            self.db.session.rollback()
            raise e

    def delete(self, id: int) -> bool:
        query = text("""
            DELETE FROM vehicules WHERE id = :id
        """)
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
    
    def _map_to_vehicle(self, row: dict) -> Vehicle:
        return Vehicle(
            id=row["id"],
            title=row["title"], 
            description=row["description"],
            brand=row["brand"],
            model=row["model"],
            year=row["year"],
            horsepower=row["horsepower"],
            price=row["price"],
            category=row["category"],
            motor=row["motor"],
            color=row["color"],
            mileage=row["mileage"],
            available=row["available"],
            status=VehicleStatus(row["status"])
        )

    def _map_to_params(self, vehicle: Vehicle) -> dict:
        return {
        "title": vehicle.title,
        "description": vehicle.description,
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
        "status": vehicle.status.value,
        "created_at": vehicle.created_at
    } 
