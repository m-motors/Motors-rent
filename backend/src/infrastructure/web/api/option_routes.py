import time
from flask import request, jsonify, Blueprint

from src.domain.models.user import UserRole
from src.infrastructure.common.regex import Regex
from src.infrastructure.common.logger import logger
from src.infrastructure.web.middleware import authorize
from src.domain.models.option import Option
from src.infrastructure.web.middleware.validator import Validator, Field
from src.application.services.option_service import OptionService

option_routes = Blueprint('option_routes', __name__)

def create_option_routes(option_service: OptionService, authorize: authorize) -> Blueprint:
    
    @option_routes.route('/option', methods=['POST'])
    @Validator(
        json_fields=[
            Field("name", "str", required=True),
        ]
    )
    @authorize([UserRole.ADMIN])
    def create_option(user):
        try:
            data = request.json
            res = option_service.create_option(
                name=data.get("name", None)
            )

            return jsonify({"message": "Option created", "content": res.to_dict(), "error": None}), 201
        except Exception as e:
            return jsonify({"message": "Error creating option", "content": None, "error": str(e)}), 400


    @option_routes.route('/option', methods=['GET'])
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    def list_option(user):
        try:
            res = option_service.list_option()
            return jsonify({"message": "Option retrieved", "content": {"options" : [option.to_dict() for option in res]} , "error": None}), 200
        except Exception as e:
            return jsonify({"message": "Error retrieving option", "content": None, "error": str(e)}), 500
            

    @option_routes.route('/option/<int:id>', methods=['GET'])
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    def get_option(user, id):
        try:
            res = option_service.get_option(id)
            return jsonify({"message": "Option retrieved", "content": {"option" : res.to_dict()}, "error": None}), 200
        except Exception as e:
            return jsonify({"message": "Error retrieving option", "content": None, "error": str(e)}), 500
        
    @option_routes.route('/option/<int:id>', methods=['PUT'])
    @authorize(UserRole.ADMIN)
    @Validator(json_fields=[
        Field("name", "str", required=True),
    ])
    def update_option(user, id):
        try:
            data = request.json
            res = option_service.update_option(id, data.get("name", None))
            return jsonify({"message": "option updated", "content": {"option" : res.to_dict()}, "error": None}), 200
        except Exception as e:
            return jsonify({"message": "Error updating option", "content": None, "error": str(e)}), 500


    @option_routes.route('/option/<int:id>', methods=['DELETE'])
    @authorize(UserRole.ADMIN)
    def delete_option(user, id):
        try:
            success = option_service.delete_option(id)
            if success:
                return jsonify({"message": "Option deleted", "content" : True, "error": None}), 200
        
            raise ValueError(success)
        except Exception as e:
            return jsonify({"message": "Error deleting option", "error": str(e)}), 500


    return option_routes



