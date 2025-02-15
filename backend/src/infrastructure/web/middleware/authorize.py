from flask import jsonify
from functools import wraps
from typing import List, Union
from flask_jwt_extended import get_jwt_identity, jwt_required

from src.domain.models.user import UserRole

def create_authorize(user_repository):
    def authorize(required_roles: List[UserRole] = None):
        # if isinstance(required_roles, UserRole):
        #     required_roles = [required_roles]

        def decorator(fn):
            @wraps(fn)
            @jwt_required()
            def wrapper(*args, **kwargs):
                identity = get_jwt_identity()
                user = user_repository.find_by_id(identity)

                if not user:
                    return jsonify({"message": "Unauthorized", "error": "Not found"}), 401
                
                if not user.is_active:
                    return jsonify({"message": "Forbidden", "error": "Inactive"}), 403

                if user.user_role.value not in [role.value for role in required_roles]:
                    return jsonify({"message": "Forbidden", "error": "Insufficient access"}), 403

                return fn(user, *args, **kwargs)

            return wrapper
        return decorator
    return authorize