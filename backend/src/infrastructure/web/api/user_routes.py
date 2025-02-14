from werkzeug.utils import secure_filename
from flask import Blueprint, jsonify, request, current_app

from src.application.services.user_service import UserService

user_routes = Blueprint('user_routes', __name__)

def create_user_routes(user_service: UserService) -> Blueprint:
    @user_routes.route('/users', methods=['GET'])
    def get_users():         
        try:
            users = user_service.list_users()
            return jsonify({"message": "Liste des utilisateurs récupérée", "content": [vars(user) for user in users], "error": None}), 200
        except Exception as e:
            current_app.logger.error(f"Erreur récupération utilisateurs: {str(e)}")
            return jsonify({"message": "Erreur serveur", "content": None, "error": str(e)}), 500

    return user_routes