from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from src.domain.models.user import UserRole
from src.infrastructure.web.middleware import authorize

tools_routes = Blueprint('version_routes', __name__)

def create_tools_routes(authorize : authorize) -> Blueprint:

    @tools_routes.route('/tools/version', methods=['GET'])
    def get_version():            
        try:
            return jsonify({"message": "Get version", "content": "0.0.1", "error": "Upload failed"}), 200
        except Exception as e:
            return jsonify({"message": "Get version failed", "content": None, "error": "Upload failed"}), 500
        
    @tools_routes.route('/tools/identity/client', methods=['GET'])
    @authorize([UserRole.CLIENT])
    def get_identity_client(user):
        try:
            return jsonify({"message": "Get identity", "content": user.to_dict(), "error": None}), 200
        except Exception as e:
            return jsonify({"message": "Error fetching identity", "content": None, "error": str(e)}), 500

    @tools_routes.route('/tools/identity/admin', methods=['GET'])
    @authorize([UserRole.ADMIN])
    def get_identity_admin(user):
        try:
            return jsonify({"message": "Get identity", "content": user.to_dict(), "error": None}), 200
        except Exception as e:
            return jsonify({"message": "Error fetching identity", "content": None, "error": str(e)}), 500
    
    @tools_routes.route('/tools/identity/all', methods=['GET'])
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    def get_identity_all(user):
        try:
            return jsonify({"message": "Get identity", "content": user.to_dict(), "error": None}), 200
        except Exception as e:
            return jsonify({"message": "Error fetching identity", "content": None, "error": str(e)}), 500
        
            
    return tools_routes
