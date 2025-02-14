from flask import Blueprint, jsonify, request

version_routes_blueprint = Blueprint('version_routes', __name__)

@version_routes_blueprint.route('/version', methods=['GET'])
def get_version():            
    try:
        return jsonify({"message": "Get version", "content": "0.0.1", "error": "Upload failed"}), 200
    except Exception as e:
        return jsonify({"message": "Get version failed", "content": None, "error": "Upload failed"}), 500

