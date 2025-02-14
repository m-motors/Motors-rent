from werkzeug.utils import secure_filename
from flask import Blueprint, jsonify, request, current_app

from src.application.services.user_service import UserService

user_routes = Blueprint('user_routes', __name__)

    
@user_routes.route('/users', methods=['GET'])
def get_users():         
    try:
        user = "toto"
        return jsonify({"message": "Get users", "content": "toto", "error": None}), 200
    except Exception as e:
        current_app.logger.error(f"Upload failed: {str(e)}")
        return jsonify({"message": "Get users failed", "content": "toto is not here", "error": {str(e)} }), 200

    # @document_routes.route('/documents/<int:document_id>', methods=['GET'])
    # def get_document(document_id: int):
    #     document = document_service.get_document(document_id)
    #     if not document:
    #         return jsonify({"error": "Document not found"}), 404
    #     return jsonify(vars(document)), 200

    # @document_routes.route(
    #     '/documents/application/<int:application_id>',
    #     methods=['GET']
    # )
    # def get_application_documents(application_id: int):
    #     documents = document_service.get_application_documents(application_id)
    #     return jsonify([vars(doc) for doc in documents]), 200

    # @document_routes.route('/documents/<int:document_id>', methods=['DELETE'])
    # def delete_document(document_id: int):
    #     if document_service.delete_document(document_id):
    #         return '', 204
    #     return jsonify({"error": "Document not found"}), 404

