from flask import request, jsonify, Blueprint
import json

from src.domain.models.user import UserRole
from src.infrastructure.common.logger import logger
from src.infrastructure.web.middleware import authorize
from src.application.services.rag_service import RAGService
from src.infrastructure.web.middleware.validator import Validator, Field


rag_routes = Blueprint('rag_routes', __name__)

def create_rag_routes(rag_service: RAGService, authorize: authorize) -> Blueprint:
    @rag_routes.route('/rag/list', methods=['GET'])
    def list_llm():
        try:
            res = rag_service.list_llm()

            if isinstance(res, list):
                content = res
            else : 
                content = str(res)

            return jsonify({"message": "LLM list", "content": content, "error": None}), 201
        except Exception as e:
            logger.error(f"LLM list error: {str(e)}")
            return jsonify({"message": "LLM list failed", "content": None, "error": "Internal Server Error"}), 500
        
    
    @rag_routes.route('/rag/install', methods=['GET'])
    @Validator(
        json_fields=[
            Field("llm_model_name", "str", required=False),
        ]
    )
    def install_llm():
        try:
            res = rag_service.install_llm()

            if isinstance(res, list):
                content = res
            else : 
                content = str(res)

            return jsonify({"message": "LLM install", "content": content, "error": None}), 201
        except Exception as e:
            logger.error(f"LLM install error: {str(e)}")
            return jsonify({"message": "LLM install failed", "content": None, "error": "Internal Server Error"}), 500


    @rag_routes.route('/rag/uninstall', methods=['DELETE'])
    @Validator(
        json_fields=[
            Field("llm_model_name", "str", required=False),
        ]
    )
    def uninstall_llm():
        try:
            res = rag_service.uninstall_llm()

            if isinstance(res, list):
                content = res
            else : 
                content = str(res)

            return jsonify({"message": "LLM uninstall", "content": content, "error": None}), 201
        except Exception as e:
            logger.error(f"LLM uninstall error: {str(e)}")
            return jsonify({"message": "LLM uninstall failed", "content": None, "error": "Internal Server Error"}), 500


    @rag_routes.route('/rag/chat', methods=['POST'])
    @Validator(
        json_fields=[
            Field("name", "str", required=True),
            Field("llm_model_name", "str", required=False),
            Field("description", "str", required=False),
            Field("options", "dict", required=False),
        ]
    )
    def create_chat():
        try:
            res = rag_service.create_chat()
            content = str(res)
            return jsonify({"message": "Create chat", "content": content, "error": None}), 201
        except Exception as e:
            logger.error(f"Create chat error: {str(e)}")
            return jsonify({"message": "Create chat failed", "content": None, "error": "Internal Server Error"}), 500

    
    @rag_routes.route('/rag/chat', methods=['GET'])
    def list_chats():
        try:
            res = rag_service.list_chats()
   
            if isinstance(res, list):
                content = res
            else : 
                content = str(res)

            return jsonify({"message": "List chat", "content": content, "error": None}), 201
        except Exception as e:
            logger.error(f"List chat error: {str(e)}")
            return jsonify({"message": "List chat failed", "content": None, "error": "Internal Server Error"}), 500







    @rag_routes.route('/rag', methods=['POST'])
    @Validator(
        json_fields=[
            Field("prompt", "str", required=True),
        ]
    )
    def generate_response():
        try:
            data = request.json
            res = rag_service.generate_response(data['prompt'])
            return jsonify({"message": "LLM install", "content": res, "error": None}), 201
        except Exception as e:
            logger.error(f"LLM install error: {str(e)}")
            return jsonify({"message": "LLM install failed", "content": None, "error": "Internal Server Error"}), 500



    return rag_routes



