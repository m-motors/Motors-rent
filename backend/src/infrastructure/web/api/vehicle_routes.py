from flask import Blueprint, jsonify, request

from src.domain.models.user import UserRole
from src.infrastructure.common.logger import logger
from src.infrastructure.web.middleware import authorize
from src.domain.models.vehicle import Vehicle, VehicleStatus
from src.application.services.vehicle_service import VehicleService
from src.infrastructure.web.middleware.validator import Validator, Field

vehicle_routes = Blueprint('vehicle_routes', __name__)

def create_vehicle_routes(vehicle_service: VehicleService, authorize: authorize) -> Blueprint:
    @vehicle_routes.route('/vehicles', methods=['GET'])
    def list_vehicles():
        try:
            vehicles = vehicle_service.list_vehicles()
            return jsonify({"message": "Vehicles retrieved", "content": { "vehicles": [vehicle.to_dict() for vehicle in vehicles] }, "error": None}), 200
        except Exception as e:
            logger.error(f"List vehicles error: {str(e)}")
            return jsonify({"message": "List vehicles failed", "content": None, "error": f"Internal Server Error {str(e)}"}), 500


    @vehicle_routes.route('/vehicles/<int:id>', methods=['GET'])
    def get_vehicle(id):
        try:
            vehicle = vehicle_service.get_vehicle(id)
            if not vehicle:
                return jsonify({"message": "Vehicle not found", "content": None, "error": "Not Found"}), 404
            
            return jsonify({"message": "Vehicle retrieved", "content": vehicle.to_dict(), "error": None }), 200
        except Exception as e:
            logger.error(f"Get vehicle error: {str(e)}")
            return jsonify({"message": "Get vehicle failed", "content": None, "error": f"Internal Server Error {str(e)}"}), 500

    @vehicle_routes.route('/vehicles', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("title", 'str', required=True, message="Title is required and must be a string."),
            Field("description", 'str', required=False, message="Description must be a string."),
            Field("brand", 'str', required=False, message="Brand must be a string."),
            Field("model", 'str', required=False, message="Model must be a string."),
            Field("year", 'int', required=False, message="Year must be an integer."),
            Field("horsepower", 'float', required=False, message="Horsepower must be an float."),
            Field("price", 'float', required=False, message="Price must be an float."),
            Field("category", 'str', required=False, message="Category must be a string."),
            Field("motor", 'str', required=False, message="Motor must be a string."),
            Field("color", 'str', required=False, message="Color must be a string."),
            Field("mileage", 'float', required=False, message="Mileage must be an float."),
            Field("available", 'bool', required=True, message="Available is required and must be a boolean."),
            Field("status", 'str', required=True, message="Status is required and must be either 'rent' or 'sale'."),
        ]
    )
    def create_vehicle(user):
        try:
            data = request.json
            print(data)
            vehicle = Vehicle(
                id=None,
                title=data["title"],
                description=data.get("description"),
                brand=data.get("brand"),
                model=data.get("model"),
                year=data.get("year"),
                horsepower=data.get("horsepower"),
                price=data.get("price"),
                category=data.get("category"),
                motor=data.get("motor"),
                color=data.get("color"),
                mileage=data.get("mileage"),
                available=data["available"],
                status=VehicleStatus(data["status"])
            )
            print(vehicle)
            saved_vehicle = vehicle_service.create_vehicle(vehicle)
            return jsonify({ "message": "Vehicle created", "content": saved_vehicle.to_dict(), "error": None }), 201
        except Exception as e:
            logger.error(f"Create vehicle error: {str(e)}")
            return jsonify({"message": "Create vehicle failed", "content": None, "error": f"Internal Server Error {str(e)}"}), 500

    @vehicle_routes.route('/vehicles/<int:id>', methods=['PATCH'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("title", 'str', required=False, message="Title must be a string."),
            Field("description", 'str', required=False, message="Description must be a string."),
            Field("brand", 'str', required=False, message="Brand must be a string."),
            Field("model", 'str', required=False, message="Model must be a string."),
            Field("year", 'int', required=False, message="Year must be an integer."),
            Field("horsepower", 'float', required=False, message="Horsepower must be an float."),
            Field("price", 'float', required=False, message="Price must be an float."),
            Field("category", 'str', required=False, message="Category must be a string."),
            Field("motor", 'str', required=False, message="Motor must be a string."),
            Field("color", 'str', required=False, message="Color must be a string."),
            Field("mileage", 'float', required=False, message="Mileage must be an float."),
            Field("available", 'bool', required=False, message="Available must be a boolean."),
            Field("status", 'str', required=False, message="Status must be either 'rent' or 'sale'.")
        ]
    )
    def update_vehicle(user, id):
        try:
            update_data = request.json
            updated_vehicle = vehicle_service.update_vehicle(id, update_data)
            return jsonify({ "message": "Vehicle updated", "content": updated_vehicle.to_dict(), "error": None}), 200
        except Exception as e:
            logger.error(f"Update vehicle error: {str(e)}")
            return jsonify({"message": "Update vehicle failed", "content": None, "error": f"Internal Server Error {str(e)}"}), 500

    @vehicle_routes.route('/vehicles/<int:id>', methods=['DELETE'])
    @authorize(UserRole.ADMIN)
    def delete_vehicle(user, id):
        try:
            success = vehicle_service.delete_vehicle(id)
            if success:
                return jsonify({"message": "Vehicle deleted", "content": True, "error": None}), 200

            return jsonify({"message": "Vehicle not found", "content": None, "error": "Not Found"}), 404
        except Exception as e:
            logger.error(f"Delete vehicle error: {str(e)}")
            return jsonify({"message": "Delete vehicle failed", "content": None, "error": f"Internal Server Error {str(e)}"}), 500


    @vehicle_routes.route('/vehicles/<int:id>/toggle-status', methods=['PUT'])
    def toggle_vehicle_status(id: int):
        """
        Change le statut du véhicule entre 'rent' et 'sale'.
        """
        vehicle = vehicle_service.toggle_vehicle_status(id)
        if not vehicle:
            return jsonify({"error": "Vehicle not found"}), 404
        return jsonify(vars(vehicle)), 200

    return vehicle_routes
