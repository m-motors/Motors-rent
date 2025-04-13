import json
from werkzeug.utils import secure_filename
from flask import request, jsonify, Blueprint

from src.domain.models.user import UserRole
from src.infrastructure.common.logger import logger
from src.infrastructure.web.middleware import authorize
from src.application.services.rag_service import RAGService
from src.domain.models.document_rag import DocumentRAGStatus
from src.infrastructure.web.middleware.validator import Validator, Field


rag_routes = Blueprint('rag_routes', __name__)

def create_rag_routes(rag_service: RAGService, authorize: authorize) -> Blueprint:

    @rag_routes.route('/rag/llm', methods=['GET'])
    @authorize([UserRole.ADMIN])
    def list_llm(user):
        try:
            res = rag_service.list_llm()

            if isinstance(res, list):
                content = res
            else : 
                content = str(res)

            return jsonify({"message": "LLM list", "content": content, "error": None}), 200
        except Exception as e:
            logger.error(f"LLM list error: {str(e)}")
            return jsonify({"message": "LLM list failed", "content": None, "error": "Internal Server Error"}), 500
        

    @rag_routes.route('/rag/llm', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("llm_model_name", "str", required=False),
        ]
    )
    def install_llm(user):
        try:
            data = request.json
            llm_model_name = data.get('llm_model_name')

            res = rag_service.install_llm(llm_model_name=llm_model_name)

            if isinstance(res, (list, dict)):
                content = res
            else : 
                content = str(res)

            return jsonify({"message": "LLM install", "content": content, "error": None}), 201
        except Exception as e:
            logger.error(f"LLM install error: {str(e)}")
            return jsonify({"message": "LLM install failed", "content": None, "error": "Internal Server Error"}), 500
        

    @rag_routes.route('/rag/llm', methods=['DELETE'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("llm_model_name", "str", required=False),
        ]
    )
    def uninstall_llm(user):
        try:
            data = request.json
            llm_model_name = data.get('llm_model_name')

            res = rag_service.uninstall_llm(llm_model_name)

            return jsonify({"message": "LLM uninstall", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"LLM uninstall error: {str(e)}")
            return jsonify({"message": "LLM uninstall failed", "content": None, "error": "Internal Server Error"}), 500




    @rag_routes.route('/rag/chats', methods=['GET'])
    def list_chats():
        try:
            res = rag_service.list_chats()
            return jsonify({"message": "List chats", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"List chats error: {str(e)}")
            return jsonify({"message": "List chats failed", "content": None, "error": "Internal Server Error"}), 500
        

    @rag_routes.route('/rag/chats', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("name", "str", required=True),
            Field("llm_model_name", "str", required=False),
            Field("description", "str", required=False),
            Field("options", "dict", required=False),
            Field("collection", "str", required=False),
        ]
    )
    def create_chat(user):
        try:
            data = request.json
            name = data.get('name')
            llm_model_name = data.get('llm_model_name')
            description = data.get('description')
            options = data.get('options')
            collection = data.get('collection')
        
            res = rag_service.create_chat(name, llm_model_name=llm_model_name, description=description, options=options, collection=collection)

            return jsonify({"message": "Create chat", "content": res, "error": None}), 201
        except Exception as e:
            logger.error(f"Create chat error: {str(e)}")
            return jsonify({"message": "Create chat failed", "content": None, "error": "Internal Server Error"}), 500
        

    @rag_routes.route('/rag/chats', methods=['DELETE'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("id", "str", required=True),
        ]
    )
    def remove_chat(user):
        try:
            data = request.json
            id = data.get('id')

            res = rag_service.remove_chat(id)

            return jsonify({"message": "Remove chat", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"Remove chat error: {str(e)}")
            return jsonify({"message": "Remove chat failed", "content": None, "error": "Internal Server Error"}), 500
    

    @rag_routes.route('/rag/chats/search', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("id", "str", required=False),
            Field("name", "str", required=False),
        ]
    )
    def search_chat(user):
        try:
            data = request.json
            id = data.get('id')
            name = data.get('name')

            res = rag_service.search_chat(id=id, name=name)

            return jsonify({"message": "Search chat", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"Search chat error: {str(e)}")
            return jsonify({"message": "Search chat failed", "content": None, "error": "Internal Server Error"}), 500
        
        
    @rag_routes.route('/rag/chats/deepsearch', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("partial", "dict", required=True),
        ]
    )
    def deepsearch_chat(user):
        try:
            data = request.json
            partial = data.get('partial')

            res = rag_service.deepsearch_chat(partial)

            return jsonify({"message": "Search chat", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"Search chat error: {str(e)}")
            return jsonify({"message": "Search chat failed", "content": None, "error": "Internal Server Error"}), 500
        
        

    @rag_routes.route('/rag/chats/options', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("id", "str", required=True),
        ]
    )
    def list_chat_options(user):
        try:
            data = request.json
            id = data.get('id')
            res = rag_service.list_options_chat(id)
            return jsonify({"message": "List chat options", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"List chat options error: {str(e)}")
            return jsonify({"message": "List chat options failed", "content": None, "error": "Internal Server Error"}), 500
    

    @rag_routes.route('/rag/chats/options', methods=['PATCH'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("id", "str", required=True),
            Field("options", "dict", required=True)
        ]
    )
    def update_options_chat(user):
        try:
            data = request.json
            id = data.get('id')
            options = data.get('options')
            res = rag_service.update_options_chat(id, options)

            return jsonify({"message": "Create chat", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"Create chat error: {str(e)}")
            return jsonify({"message": "Create chat failed", "content": None, "error": "Internal Server Error"}), 500
    

    @rag_routes.route('/rag/chats/collection', methods=['PATCH'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("id", "str", required=True),
            Field("collection", "str", required=True),
        ]
    )
    def update_collection_chat(user):
        try:
            data = request.json
            id = data.get('id')
            collection = data.get('collection')

            res = rag_service.add_collection_to_chat(id=id, collection=collection)

            return jsonify({"message": "Create chat", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"Create chat error: {str(e)}")
            return jsonify({"message": "Create chat failed", "content": None, "error": "Internal Server Error"}), 500




    @rag_routes.route('/rag', methods=['POST'])
    @authorize([UserRole.CLIENT, UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("question", "str", required=True),
            Field("llm_model_name", "str", required=False),
            Field("id", "str", required=False),
            Field("with_retriever", "bool", required=False),
            Field("collection", "str", required=False),
            Field("prompt_template", "str", required=False)
        ]
    )
    def generate_response(user):
        try:
            data = request.json
            question = data.get('question')
            llm_model_name = data.get('llm_model_name')
            id = data.get('id')
            with_retriever = data.get('with_retriever')
            collection = data.get('collection')
            prompt_template = data.get('prompt_template')

            res = rag_service.generate_response(question, llm_model_name=llm_model_name, id=id, with_retriever=True, collection=collection, prompt_template=prompt_template)

            return jsonify({"message": "LLM install", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"LLM install error: {str(e)}")
            return jsonify({"message": "LLM install failed", "content": None, "error": "Internal Server Error"}), 500




    @rag_routes.route('/rag/storage', methods=['GET'])
    @authorize([UserRole.ADMIN])
    def list_storage_files(user):
        try:
            res = rag_service.list_storage_files()
            return jsonify({"message": "List files", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"List files error: {str(e)}")
            return jsonify({"message": "List files failed", "content": None, "error": "Internal Server Error"}), 500


    @rag_routes.route('/rag/storage', methods=['POST'])
    @authorize([UserRole.ADMIN])
    def upload_storage_file(user):
        try:
            file = request.files['file']

            if file.filename == '':
                return jsonify({"message": "No selected file", "content": None, "error": "Empty filename"}), 400


            file_name = request.form.get("file_name", secure_filename(file.filename))
            folder_name = request.form.get("folder_name", None)

            res = rag_service.upload_storage_files(file, file_name, folder_name=folder_name)

            return jsonify({"message": "Upload file", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"Upload file error: {str(e)}")
            return jsonify({"message": "Upload file failed", "content": None, "error": "Internal Server Error"}), 500


    @rag_routes.route('/rag/storage/download', methods=['GET'])
    @authorize([UserRole.ADMIN])
    @Validator(
        query_fields=[
            Field(label="file_name", field_type="str", required=True),
            Field(label="folder_name", field_type="str", required=False),
            Field(label="local_path", field_type="str", required=False)
        ]
    )
    def download_storage_file(user):
        try:
            file_name = request.args.get("file_name")
            folder_name = request.args.get("folder_name", None)
            local_path = request.args.get("local_path", None)

            res = rag_service.download_storage_files(file_name, folder_name=folder_name, local_path=local_path)
            return jsonify({"message": "Download file", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"Download file error: {str(e)}")
            return jsonify({"message": "Download file failed", "content": None, "error": "Internal Server Error"}), 500

    
    @rag_routes.route('/rag/storage', methods=['DELETE'])
    @authorize([UserRole.ADMIN])
    @Validator(
    query_fields=[
            Field(label="file_name", field_type="str", required=True),
            Field(label="folder_name", field_type="str", required=False)
        ]
    )
    def delete_storage_file(user):
        try:
            file_name = request.args.get("file_name")
            folder_name = request.args.get("folder_name", None)

            res = rag_service.delete_storage_files(file_name, folder_name=folder_name)
            return jsonify({"message": "delete file", "content": res, "error": None}), 200
        except Exception as e:
            logger.error(f"delete file error: {str(e)}")
            return jsonify({"message": "delete file failed", "content": None, "error": "Internal Server Error"}), 500




    @rag_routes.route('/rag/documents', methods=['GET'])
    @authorize([UserRole.ADMIN])
    def list_documents(user):
        try:
            res = rag_service.list_document_rag()
            return jsonify({"message": "List documents", "content": [doc.to_dict() for doc in res], "error": None}), 200
        except Exception as e:
            logger.error(f"List documents error: {str(e)}")
            return jsonify({"message": "List documents failed", "content": None, "error": "Internal Server Error"}), 500

    
    @rag_routes.route('/rag/documents/<int:doc_id>', methods=['GET'])
    @authorize([UserRole.ADMIN])
    def get_document(user, doc_id):
        try:
            res = rag_service.get_document_rag(doc_id)
            if not res:
                return jsonify({"message": "Document not found", "content": None, "error": "Not Found"}), 404
            return jsonify({"message": "Get document", "content": res.to_dict(), "error": None}), 200
        except Exception as e:
            logger.error(f"Get document error: {str(e)}")
            return jsonify({"message": "Get document failed", "content": None, "error": "Internal Server Error"}), 500


    @rag_routes.route('/rag/documents', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("name", "str", required=True),
            Field("doc_format", "str", required=True),
            Field("status", "str", required=False),
        ]
    )
    def save_document(user):
        try:
            data = request.json
            status = DocumentRAGStatus(data["status"].lower()) if "status" in data else DocumentRAGStatus.ADD

            res = rag_service.save_document_rag(
                name=data["name"],
                doc_format=data["doc_format"],
                status=status
            )
            return jsonify({"message": "Document saved", "content": res.to_dict(), "error": None}), 201
        except Exception as e:
            logger.error(f"Save document error: {str(e)}")
            return jsonify({"message": "Save document failed", "content": None, "error": "Internal Server Error"}), 500


    @rag_routes.route('/rag/documents/<int:doc_id>', methods=['PATCH'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("name", "str", required=False),
            Field("doc_format", "str", required=False),
            Field("link", "str", required=False),
            Field("e_tag", "str", required=False),
            Field("status", "str", required=False),
        ]
    )
    def update_document(user, doc_id):
        try:
            data = request.json
            status = DocumentRAGStatus(data["status"].lower()) if "status" in data else DocumentRAGStatus.ADD
            res = rag_service.update_document_rag(
                id=doc_id,
                name=data.get("name"),
                doc_format=data.get("doc_format"),
                link=data.get("link"),
                e_tag=data.get("e_tag"),
                status=status
            )
            return jsonify({"message": "Document updated", "content": res.to_dict(), "error": None}), 200
        except ValueError as e:
            return jsonify({"message": str(e), "content": None, "error": "Not Found"}), 404
        except Exception as e:
            logger.error(f"Update document error: {str(e)}")
            return jsonify({"message": "Update document failed", "content": None, "error": "Internal Server Error"}), 500


    @rag_routes.route('/rag/documents/<int:doc_id>', methods=['DELETE'])
    @authorize([UserRole.ADMIN])
    def delete_document(user, doc_id):
        try:
            res = rag_service.delete_document_rag(doc_id)
            return jsonify({"message": "Document deleted", "content": [doc.to_dict() for doc in res], "error": None}), 200
        except ValueError as e:
            return jsonify({"message": str(e), "content": None, "error": "Not Found"}), 404
        except Exception as e:
            logger.error(f"Delete document error: {str(e)}")
            return jsonify({"message": "Delete document failed", "content": None, "error": "Internal Server Error"}), 500




    @rag_routes.route('/rag/embedders', methods=['GET'])
    @authorize([UserRole.ADMIN])
    def list_embedders(user):
        try:
            res = rag_service.list_embedders()

            if res.count : 
                embedders_info = [
                    {
                        "id": embedder["id"],
                        "name": embedder["name"],
                        "model_name": embedder["model_name"],
                        "embedder_instance": True,
                        "device": embedder["device"],
                        "is_encode_kwargs": embedder["is_encode_kwargs"]
                    }
                    for embedder in res
                ]

            return jsonify({"message": "List embedders", "content": embedders_info or res, "error": None}), 200
        except Exception as e:
            logger.error(f"List embedders error: {str(e)}")
            return jsonify({"message": "List embedders failed", "content": None, "error": "Internal Server Error"}), 500


    @rag_routes.route('/rag/embedders', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("model_name", "str", required=False),
            Field("is_encode_kwargs", "bool", required=False),
        ]
    )
    def create_embedder(user):
        try:
            data = request.json
            model_name = data.get('model_name')
            device = data.get('device')
            is_encode_kwargs = data.get('is_encode_kwargs')

        
            res = rag_service.create_embedder(model_name=model_name, device=device, is_encode_kwargs=is_encode_kwargs)

            embedders_info = [
                {
                    "id": res["id"],
                    "name": res["name"],
                    "model_name": res["model_name"],
                    "embedder_instance": True,
                    "device": res["device"],
                    "is_encode_kwargs": res["is_encode_kwargs"]
                }
            ]

            return jsonify({"message": "Create embedder", "content": embedders_info, "error": None}), 201
        except Exception as e:
            logger.error(f"Create embedder error: {str(e)}")
            return jsonify({"message": "Create embedder failed", "content": None, "error": "Internal Server Error"}), 500
        

    @rag_routes.route('/rag/embedders', methods=['DELETE'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("id", "str", required=True),
        ]
    )
    def remove_embedder(user):
        try:
            data = request.json
            id = data.get('id')

            res = rag_service.remove_embedder(id)

            if res.count : 
                embedders_info = [
                    {
                        "id": embedder["id"],
                        "name": embedder["name"],
                        "model_name": embedder["model_name"],
                        "embedder_instance": True,
                        "device": embedder["device"],
                        "is_encode_kwargs": embedder["is_encode_kwargs"]
                    }
                    for embedder in res
                ]

            return jsonify({"message": "Remove embedder", "content": embedders_info or res, "error": None}), 200
        except Exception as e:
            logger.error(f"Remove embedder error: {str(e)}")
            return jsonify({"message": "Remove embedder failed", "content": None, "error": "Internal Server Error"}), 500
    

    @rag_routes.route('/rag/embedders/search', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("id", "str", required=False),
            Field("name", "str", required=False),
        ]
    )
    def search_embedder(user):
        try:
            data = request.json
            id = data.get('id')
            name = data.get('name')

            res = rag_service.search_embedders(id=id, name=name)

            if res.count : 
                embedders_info = [
                    {
                        "id": embedder["id"],
                        "name": embedder["name"],
                        "model_name": embedder["model_name"],
                        "embedder_instance": True,
                        "device": embedder["device"],
                        "is_encode_kwargs": embedder["is_encode_kwargs"]
                    }
                    for embedder in res
                ]

            return jsonify({"message": "Search embedder", "content": embedders_info or res, "error": None}), 200
        except Exception as e:
            logger.error(f"Search embedder error: {str(e)}")
            return jsonify({"message": "Search embedder failed", "content": None, "error": "Internal Server Error"}), 500
        
    


    @rag_routes.route('/rag/collections', methods=['GET'])
    @authorize([UserRole.ADMIN])
    def list_collection(user):
        try:
            res = rag_service.list_collection()

            if res.count : 
                result = [
                    {
                        "id": store['id'],
                        "name" : store['name'],
                        "persist_directory": store['persist_directory'],  
                        "vector_space" : True,
                        "retriever" : True, 
                        "docs" : store['docs'],
                        "embedder" : store['embedder']
                    }
                    for store in res
                ]

            return jsonify({"message": "Search collection", "content": result or res, "error": None}), 200
        except Exception as e:
            logger.error(f"Search collection error: {str(e)}")
            return jsonify({"message": "Search collection failed", "content": None, "error": "Internal Server Error"}), 500
        

    @rag_routes.route('/rag/collections', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("persist_directory", "str", required=False),
            Field("collection_name", "str", required=False),
            Field("embedder_id", "str", required=False),
        ]
    )
    def create_collection(user):
        try:
            data = request.json
            persist_directory = data.get('persist_directory')
            collection_name = data.get('collection_name')
            embedder_id = data.get('embedder_id')

            res = rag_service.save_collection(persist_directory=persist_directory, collection_name=collection_name,embedder_id=embedder_id)

            result = {

                "id" :  res['id'],
                "name" : res['name'],
                "persist_directory": res['persist_directory'],  
                "vector_space" : True,
                "retriever" : True, 
                "docs" : res['docs'],
                "embedder" : res['embedder']
            }

            return jsonify({"message": "Create collection", "content": result or res, "error": None}), 200
        except Exception as e:
            logger.error(f"Create collection error: {str(e)}")
            return jsonify({"message": "Create collection failed", "content": None, "error": "Internal Server Error"}), 500
        
    @rag_routes.route('/rag/collections', methods=['PATCH'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("id", "str", required=True),
            Field("name", "str", required=False),
            Field("persist_directory", "str", required=False),
            Field("docs", "docs", required=False),
            Field("embedder", "str", required=False)
        ]
    )
    def update_collection(user):
        try:
            data = request.json
            id = data.get('id')
            name = data.get('name')
            persist_directory = data.get('persist_directory')
            docs = data.get('docs')
            embedder = data.get('embedder')

            update = {
                "id" :  id,
                "name" : name,
                "persist_directory": persist_directory,  
                "docs" : docs,
                "embedder" : embedder
            }

            res = rag_service.update_collection(id=id, update=update)

            if res.count :
                result = [
                    {
                        "id": store['id'],
                        "name" : store['name'],
                        "persist_directory": store['persist_directory'],  
                        "vector_space" : True,
                        "retriever" : True, 
                        "docs" : store['docs'],
                        "embedder" : store['embedder']
                    }
                    for store in res
                ]

            return jsonify({"message": "Remove collection", "content": result or res, "error": None}), 200
        except Exception as e:
            logger.error(f"Remove collection error: {str(e)}")
            return jsonify({"message": "Remove collection failed", "content": None, "error": "Internal Server Error"}), 500
        

    @rag_routes.route('/rag/collections', methods=['DELETE'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("id", "str", required=True),
        ]
    )
    def remove_collection(user):
        try:
            data = request.json
            id = data.get('id')

            res = rag_service.remove_collection(id)

            if res.count : 
                result = [
                    {
                        "id": store['id'],
                        "name" : store['name'],
                        "persist_directory": store['persist_directory'],  
                        "vector_space" : True,
                        "retriever" : True, 
                        "docs" : store['docs'],
                        "embedder" : store['embedder']
                    }
                    for store in res
                ]

            return jsonify({"message": "Remove collection", "content": result or res, "error": None}), 200
        except Exception as e:
            logger.error(f"Remove collection error: {str(e)}")
            return jsonify({"message": "Remove collection failed", "content": None, "error": "Internal Server Error"}), 500
    

    @rag_routes.route('/rag/collections/search', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("id", "str", required=False),
            Field("name", "str", required=False),
        ]
    )
    def search_collection(user):
        try:
            data = request.json
            id = data.get('id')
            name = data.get('name')

            res = rag_service.search_collections(id=id, name=name)

            if res.count : 
                result = [
                    {
                        "id": store['id'],
                        "name" : store['name'],
                        "persist_directory": store['persist_directory'],  
                        "vector_space" : True,
                        "retriever" : True, 
                        "docs" : store['docs'],
                        "embedder" : store['embedder']
                    }
                    for store in res
                ]

            return jsonify({"message": "Search collection", "content": result or res, "error": None}), 200
        except Exception as e:
            logger.error(f"Search collection error: {str(e)}")
            return jsonify({"message": "Search collection failed", "content": None, "error": "Internal Server Error"}), 500

            


    @rag_routes.route('/rag/retriver', methods=['POST'])
    @authorize([UserRole.ADMIN])
    @Validator(
        json_fields=[
            Field("store_id", "str", required=True),
            Field("dirs", "list", required=False),
            Field("files", "list", required=False),
            Field("chunk_size", "int", required=False),
            Field("chunk_overlap", "int", required=False),
        ]
    )
    def add_docs_store(user):
        try:
            data = request.json
            store_id = data.get('store_id')
            dirs = data.get('dirs')
            files = data.get('files')
            chunk_size = data.get('chunk_size')
            chunk_overlap = data.get('chunk_overlap')

            res = rag_service.add_docs_store(store_id=store_id, dirs=dirs,files=files, chunk_size=chunk_size, chunk_overlap=chunk_overlap)

            result = {
                "id": res['id'],
                "name" : res['name'],
                "persist_directory": res['persist_directory'],  
                "vector_space" : True,
                "retriever" : True, 
                "docs" : res['docs'],
                "embedder" : res['embedder']
            }
                

            return jsonify({"message": "Search collection", "content": result or res, "error": None}), 200
        except Exception as e:
            logger.error(f"Search collection error: {str(e)}")
            return jsonify({"message": "Search collection failed", "content": None, "error": "Internal Server Error"}), 500

    return rag_routes



