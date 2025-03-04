from werkzeug.utils import secure_filename
from flask import Blueprint, jsonify, request

from src.domain.models.user import User, UserRole
from src.infrastructure.common.regex import Regex
from src.infrastructure.common.logger import logger
from src.infrastructure.web.middleware import authorize
from src.application.services.user_service import UserService
from src.infrastructure.web.middleware.validator import Validator, Field

user_routes = Blueprint('user_routes', __name__)

def create_user_routes(user_service: UserService, authorize : authorize) -> Blueprint:
    @user_routes.route('/users', methods=['GET'])
    def get_users():
        try:
            users = user_service.list_users()
            return jsonify({"message": "Liste des utilisateurs récupérée", "content": [user.to_dict() for user in users], "error": None}), 200
        except Exception as e:
            logger.error(f"List user error: {str(e)}")
            return jsonify({"message": "List user failed", "content": None, "error": "Internal Server Error"}), 500

    @user_routes.route('/users/<int:id>', methods=['GET'])
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    def get_user(id):
        try:
            user = user_service.get_user(id)
            return jsonify({"message": "User", "content": user.to_dict(), "error": None}), 200
        except Exception as e:
            logger.error(f"Get user error: {str(e)}")
            return jsonify({"message": "Get user failed", "content": None, "error": "Internal Server Error"}), 500
        
    @user_routes.route('/users', methods=['POST'])
    @Validator(
        json_fields=[
            Field("email", "str", required=True, match=Regex.email, message="Must be an email"),
            Field("password", "str", required=True, message="Password is not valid"),
            Field("first_name", "str", required=True, message="First name is not valid"),
            Field("last_name", "str", required=True, message="Last name is not valid")
        ]
    )
    def create_user():
        try:
            data = request.get_json()

            new_user = User(
                email=data["email"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                password=data["password"],
                is_active=data.get("is_active", True),
                user_role=UserRole('client')
            )

            saved_user = user_service.create_user(new_user)

            return jsonify({"message": "Utilisateur créé", "content": saved_user.to_dict(), "error": None}), 201
        except Exception as e:
            logger.error(f"Create user error: {str(e)}")
            return jsonify({"message": "Create user failed", "content": None, "error": "Internal Server Error"}), 500

    @user_routes.route('/users/<int:id>', methods=['PATCH'])
    @Validator(
        json_fields=[
            Field("password", "str", required=False, message="Password is not valid"),
            Field("first_name", "str", required=False, message="First name is not valid"),
            Field("last_name", "str", required=False, message="Last name is not valid"),
            Field("user_role", "str", required=False, message="User role is not valid"),
            Field("is_active", "bool", required=False, message="Is active is not valid")
        ]
        
    )
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    def update_user(user, id):
        try:
            update_data = request.get_json()
            updated_user = user_service.update_user(user, id, update_data)
            return jsonify({"message": "User updated", "content": updated_user.to_dict(), "error": None}), 200
        except Exception as e:
            logger.error(f"Update user error: {str(e)}")
            return jsonify({"message": "Update User failed", "content": None, "error": "Internal Server Error"}), 500

    @user_routes.route('/users/<int:id>', methods=['DELETE'])
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    def delete_user(user, id):
        try:
            success = user_service.delete_user(user, id)
            
            if not success:
                return jsonify({"message": "User not found", "content": None, "error": None}), 404
            
            return '', 204
        except Exception as e:
            logger.error(f"Delete user error: {str(e)}")
            return jsonify({"message": "Delete user failed", "content": None, "error": "Internal Server Error"}), 500

    return user_routes
