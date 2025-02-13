from flask import Blueprint, jsonify, request, current_app

version_routes_blueprint = Blueprint('version_routes', __name__)

def version_routes() -> Blueprint:
    @version_routes_blueprint.route('/version', methods=['GET'])
    def get_version():            
        try:
            return jsonify({"message": "Get version", "data": "0.0.1", "error": "Upload failed"}), 200
        except Exception as e:
            current_app.logger.error(f"Upload failed: {str(e)}")
            return jsonify({"message": "Get version failed", "data": None, "error": "Upload failed"}), 500





