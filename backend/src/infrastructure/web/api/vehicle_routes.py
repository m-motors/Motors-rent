from flask import Blueprint, jsonify, request

from src.domain.models.vehicle import Vehicle
from src.application.ports.input.vehicle_use_cases import VehicleUseCase

vehicle_routes = Blueprint('vehicle_routes', __name__)

def create_vehicle_routes(vehicle_service: VehicleUseCase) -> Blueprint:
    @vehicle_routes.route('/vehicles', methods=['GET'])
    def list_vehicles():
        vehicles = vehicle_service.list_vehicles()
        return jsonify([vars(v) for v in vehicles]), 200
    
    @vehicle_routes.route('/vehicles/<int:id>', methods=['GET'])
    def get_vehicle(id: int):
        vehicle = vehicle_service.get_vehicle(id)
        if not vehicle:
            return jsonify({"error": "Vehicle not found"}), 404
        return jsonify(vars(vehicle)), 200
    
    @vehicle_routes.route('/vehicles', methods=['POST'])
    def create_vehicle():
        data = request.get_json()
        vehicle = Vehicle(**data)
        created_vehicle = vehicle_service.create_vehicle(vehicle)
        return jsonify(vars(created_vehicle)), 201

    @vehicle_routes.route('/vehicles/<int:id>/toggle-status', methods=['PUT'])
    def toggle_vehicle_status(id: int):
        """
        Change le statut du véhicule entre 'rent' et 'sale'.
        """
        
        vehicle = vehicle_service.toggle_vehicle_status(id)
        if not vehicle:
            return jsonify({"error": "Vehicle not found"}), 404
        return jsonify(vars(vehicle)), 200

    
    @vehicle_routes.route('/vehicles/<int:id>', methods=['PUT'])
    def update_vehicle(id: int):
        """
        Màjles informations d'un véhicule (prix, date et autres).
        """
        data = request.get_json()
        vehicle = vehicle_service.get_vehicle(id)
        if not vehicle:
            return jsonify({"error": "Vehicle not found"}), 404
        
        if "price" in data:
            vehicle.price = data["price"]
        if "date" in data:
            vehicle.date = data["date"]
        
        updated_vehicle = vehicle_service.update_vehicle(vehicle)
        return jsonify(vars(updated_vehicle)), 200

    return vehicle_routes
