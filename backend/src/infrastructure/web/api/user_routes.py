from werkzeug.utils import secure_filename
from flask import Blueprint, jsonify, request, current_app
from src.domain.models.user import User

from src.application.services.user_service import UserService

user_routes = Blueprint('user_routes', __name__)

def create_user_routes(user_service: UserService) -> Blueprint:
    @user_routes.route('/users', methods=['GET'])
    def get_users():         
        try:
            users = user_service.list_users()
            return jsonify({"message": "Liste des utilisateurs récupérée", "content": [user.to_dict() for user in users], "error": None}), 200
        except Exception as e:
            current_app.logger.error(f"Erreur récupération utilisateurs: {str(e)}")
            return jsonify({"message": "Erreur serveur", "content": None, "error": str(e)}), 500

    @user_routes.route('/users/<int:id>', methods=['GET'])
    def get_user(id):
        try:
            user = user_service.get_user(id)
            return jsonify({"message": "User", "content": user.to_dict(), "error": None}), 200
        except Exception as e:
            current_app.logger.error(f"Erreur récupération utilisateurs: {str(e)}")
            return jsonify({"message": "Erreur serveur", "content": None, "error": str(e)}), 500
        
    @user_routes.route('/users', methods=['POST'])
    def create_user():
        try:
            data = request.get_json()

            print(data)

            if not all(k in data for k in ["email", "first_name", "last_name", "password"]):
                return jsonify({"message": "Données manquantes", "content": None, "error": "Champ(s) requis absent(s)"}), 400

            new_user = User(
                email=data["email"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                password=data["password"],
                is_active=data.get("is_active", True),
                user_role=data.get("user_role", "client")
            )

            saved_user = user_service.create_user(new_user)

            return jsonify({"message": "Utilisateur créé", "content": vars(saved_user), "error": None}), 201
        except Exception as e:
            current_app.logger.error(f"Erreur création utilisateur: {str(e)}")
            return jsonify({"message": "Erreur serveur", "content": None, "error": str(e)}), 500

    @user_routes.route('/users/<int:id>', methods=['PUT'])
    def update_user(id):
        try:
            data = request.get_json()
            updated_user = user_service.update_user(id, data)
            return jsonify({"message": "User updated", "content": updated_user.to_dict(), "error": None}), 200
        except Exception as e:
            current_app.logger.error(f"Erreur mise à jour utilisateur: {str(e)}")
            return jsonify({"message": "Erreur serveur", "content": None, "error": str(e)}), 500

    @user_routes.route('/users/<int:id>', methods=['DELETE'])
    def delete_user(id):
        try:
            success = user_service.delete_user(id)
            
            if not success:
                return jsonify({"message": "User not found", "content": None, "error": None}), 404
            
            return '', 204
        except Exception as e:
            current_app.logger.error(f"Erreur suppression utilisateur: {str(e)}")
            return jsonify({"message": "Erreur serveur", "content": None, "error": str(e)}), 500


    return user_routes
