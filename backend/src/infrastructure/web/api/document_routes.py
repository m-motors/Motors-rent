from werkzeug.utils import secure_filename
from flask import Blueprint, jsonify, request, current_app

from src.application.services.document_service import DocumentService

document_routes = Blueprint('document_routes', __name__)


def create_document_routes(document_service: DocumentService) -> Blueprint:
    @document_routes.route('/documents/upload', methods=['POST'])
    def upload_document():
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']
        application_id = request.form.get('application_id')
        document_type = request.form.get('document_type')

        if not file.filename:
            return jsonify({"error": "No file selected"}), 400

        if not application_id or not document_type:
            return jsonify({"error": "Missing required fields"}), 400

        try:
            document = document_service.upload_document(
                file,
                int(application_id),
                document_type
            )
            return jsonify(vars(document)), 201
        except Exception as e:
            current_app.logger.error(f"Upload failed: {str(e)}")
            return jsonify({"error": "Upload failed"}), 500

    @document_routes.route('/documents/<int:document_id>', methods=['GET'])
    def get_document(document_id: int):
        document = document_service.get_document(document_id)
        if not document:
            return jsonify({"error": "Document not found"}), 404
        return jsonify(vars(document)), 200

    @document_routes.route(
        '/documents/application/<int:application_id>',
        methods=['GET']
    )
    def get_application_documents(application_id: int):
        documents = document_service.get_application_documents(application_id)
        return jsonify([vars(doc) for doc in documents]), 200

    @document_routes.route('/documents/<int:document_id>', methods=['DELETE'])
    def delete_document(document_id: int):
        if document_service.delete_document(document_id):
            return '', 204
        return jsonify({"error": "Document not found"}), 404

    @document_routes.route('/documents/<int:document_id>/view', methods=['GET'])
    def view_document(document_id: int):
        url = document_service.get_document_url(document_id)
        if url:
            return jsonify({"url": url}), 200
        return jsonify({"error": "Document not found"}), 404

    @document_routes.route('/documents/<int:document_id>/metadata', methods=['PATCH'])
    def update_document_metadata(document_id: int):
        new_metadata = request.json
        if not new_metadata:
            return jsonify({"error": "No metadata provided"}), 400

        updated_document = document_service.update_document_metadata(document_id, new_metadata)
        if updated_document:
            return jsonify(vars(updated_document)), 200
        return jsonify({"error": "Document not found"}), 404

    return document_routes
