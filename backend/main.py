import os
import sys
import logging
from flask_cors import CORS
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

from src.infrastructure.config.config import Config
from src.infrastructure.common.logger import logger
from src.application.services.user_service import UserService
from src.infrastructure.scripts.migrate import apply_migrations
from src.application.services.option_service import OptionService
from src.infrastructure.web.api.user_routes import create_user_routes
from src.infrastructure.web.api.client_folder_routes import create_client_folder_routes
from src.infrastructure.web.api.document_routes import document_routes
from src.infrastructure.web.api.tools_routes import create_tools_routes
from src.infrastructure.web.middleware.authorize import create_authorize
from src.infrastructure.web.api.option_routes import create_option_routes
from src.application.services.client_folder_service import ClientFolderService
from src.application.services.authentication_service import AuthenticationService
from src.application.services.document_service import DocumentService
from src.infrastructure.web.api.document_routes import create_document_routes
from src.infrastructure.web.api.authentication_routes import create_authentication_routes
from src.infrastructure.adapters.persistence.sql_user_repository import SQLUserRepository
from src.infrastructure.adapters.persistence.sql_document_repository import MySQLDocumentRepository
from src.infrastructure.adapters.persistence.sql_option_repository import SQLOptionRepository
from src.infrastructure.adapters.persistence.sql_client_folder_repository import SQLClientFolderRepository

app = Flask(__name__)

app.config.from_object(Config)

jwt = JWTManager(app)

db = SQLAlchemy(app)

# Configuration CORS
CORS(app, supports_credentials=True)

user_repository = SQLUserRepository(db)
authorize = create_authorize(user_repository)

tools_routes = create_tools_routes(authorize)
app.register_blueprint(tools_routes, url_prefix='/api')

user_service = UserService(user_repository)
user_routes = create_user_routes(user_service)
app.register_blueprint(user_routes, url_prefix='/api')

authentication_service = AuthenticationService(user_repository)
authentication_routes = create_authentication_routes(authentication_service)
app.register_blueprint(authentication_routes, url_prefix='/api')

Client_folder_repository = SQLClientFolderRepository(db)
client_folder_service = ClientFolderService(user_repository, Client_folder_repository)
client_folder_routes = create_client_folder_routes(client_folder_service, authorize)
app.register_blueprint(client_folder_routes, url_prefix='/api')

option_repository = SQLOptionRepository(db)
option_service = OptionService(option_repository)
option_routes = create_option_routes(option_service, authorize)
app.register_blueprint(option_routes, url_prefix='/api')

@app.route('/')
def hello():
    return "hello", 200

@app.errorhandler(404)
def page_not_found(error):
    return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 404
    
@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 500

if __name__ == '__main__':
    logger.info("Starting Flask application...")
    app.run(host='0.0.0.0')
