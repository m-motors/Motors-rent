from flask import Blueprint, jsonify, request
from application.ports.input.vehicle_use_cases import VehicleUseCase
from domain.models.vehicle import Vehicle

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
    
    return vehicle_routes