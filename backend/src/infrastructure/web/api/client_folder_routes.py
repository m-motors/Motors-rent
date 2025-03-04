import time
from flask import request, jsonify, Blueprint

from src.domain.models.user import UserRole
from src.infrastructure.common.regex import Regex
from src.infrastructure.common.logger import logger
from src.infrastructure.web.middleware import authorize
from src.domain.models.client_folder import ClientFolderType, ClientFolderStatus
from src.infrastructure.web.middleware.validator import Validator, Field
from src.application.services.client_folder_service import ClientFolderService

client_folder_routes = Blueprint('client_folder_routes', __name__)

def create_client_folder_routes(client_folder_service: ClientFolderService, authorize) -> Blueprint:
    
    @client_folder_routes.route('/clientfolders', methods=['POST'])
    @Validator(
        json_fields=[
            Field("type", "str", required=True, message='Must be "BUY" or "Rental"'),
            Field("vehicule_id", "int", required=False), 
            Field("client_id", "int", required=False),
            Field("option_ids", "list", required=False),
            Field("document_ids", "list", required=False),
        ]
    )
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    def create_client_folder(user):
        try:
            data = request.json
            res = client_folder_service.create_client_folder(
                current_user=user,
                client_id=data.get("client_id", None),
                type=ClientFolderType(data["type"]),
                vehicule_id=data.get("vehicule_id", None),
                option_ids=data.get("option_ids", None),
                document_ids=data.get("document_ids" , None)
            )

            return jsonify({"message": "Client folder created", "content": res.to_dict(), "error": None}), 201
        except Exception as e:
            logger.error(f"Create client folder error: {str(e)}")
            return jsonify({"message": "Create client folder failed", "content": None, "error": "Internal Server Error"}), 500


    @client_folder_routes.route('/clientfolders', methods=['GET'])
    @authorize(UserRole.ADMIN)
    def list_client_folder(user):
        try:
            res = client_folder_service.list_client_folder()
            return jsonify({"message": "Client folder retrieved", "content": {"client_folders" : [client_folder.to_dict() for client_folder in res]} , "error": None}), 200
        except Exception as e:
            logger.error(f"List client folder error: {str(e)}")
            return jsonify({"message": "List client folder failed", "content": None, "error": "Internal Server Error"}), 500
            

    @client_folder_routes.route('/clientfolders/<int:id>', methods=['GET'])
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    def get_client_folder(user, id):
        try:
            client_folder = client_folder_service.get_client_folder(user, id)
            return jsonify({"message": "Client folder retrieved", "content": {"client_folder" : client_folder.to_dict()}, "error": None}), 200
        except Exception as e:
            logger.error(f"Get client folder error: {str(e)}")
            return jsonify({"message": "Get client folder failed", "content": None, "error": "Internal Server Error"}), 500
        

    @client_folder_routes.route('/clientfolders/client', defaults={'client_id': None}, methods=['GET'])
    @client_folder_routes.route('/clientfolders/client/<int:client_id>', methods=['GET'])
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    def get_list_client_folder_by_client_id(user, client_id):
        try:
            if user.user_role == UserRole.CLIENT or not client_id:
                client_id = user.id

            res = client_folder_service.get_list_client_folder_by_client_id(client_id)
            return jsonify({"message": "Client folders retrieved", "content": {"client_folders" : [client_folder.to_dict() for client_folder in res]} , "error": None}), 200
        except Exception as e:
            logger.error(f"Get client folder by client id login error: {str(e)}")
            return jsonify({"message": "Get client folder by client id failed", "content": None, "error": "Internal Server Error"}), 500

    @client_folder_routes.route('/clientfolders/<int:id>', methods=['PATCH'])
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    @Validator(json_fields=[
        Field("vehicule_id", "int", required=False),
        Field("document_ids", "list", required=False, message='if id in document_ids reliate to client folder they will be remove, if id in document_ids not reliate to client_folder they will be add'),
        Field("option_ids", "list", required=False, message='if id in option_ids reliate to client folder they will be remove, if id in option_ids not reliate to client_folder they will be add'),
        Field("status", "str", required=False),
        Field("user_id", "str", required=False),
        Field("type", "str", required=False),
    ])
    def update_client_folder(user, id):
        try:
            update_data = request.json
            updated_client_folder = client_folder_service.update_client_folder(user, id, update_data)
            return jsonify({"message": "Client folder updated", "content": updated_client_folder.to_dict(), "error": None}), 200
        except Exception as e:
            logger.error(f"Update client folder error: {str(e)}")
            return jsonify({"message": "Update client folder failed", "content": None, "error": "Internal Server Error"}), 500


    @client_folder_routes.route('/clientfolders/<int:id>', methods=['DELETE'])
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    def delete_client_folder(user, id):
        try:
            success = client_folder_service.delete_client_folder(user, id)
            if success:
                return jsonify({"message": "Client folder deleted", "content" : True, "error": None}), 200
        
            raise ValueError(success)
        except Exception as e:
            logger.error(f"Delete client folder error: {str(e)}")
            return jsonify({"message": "Delete client folder failed", "content": None, "error": "Internal Server Error"}), 500

    
    @client_folder_routes.route('/clientfolders/info', methods=['GET']) 
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    def get_client_folder_info(user):
        try:
            status_values = {status.name: status.value for status in ClientFolderStatus}
            type_values = {folder_type.name: folder_type.value for folder_type in ClientFolderType}

            return jsonify({ "message": "Client folder information retrieved", "content": { "statuses": status_values, "types": type_values }, "error": None}), 200 

        except Exception as e:
            logger.error(f"Get info on client folder error: {str(e)}")
            return jsonify({"message": "Get info on client folder failed", "content": None, "error": "Internal Server Error"}), 500


    return client_folder_routes



