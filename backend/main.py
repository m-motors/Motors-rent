import os
import sys
import logging
from flask_cors import CORS
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

from src.infrastructure.config.config import Config
from src.application.services.user_service import UserService
from src.infrastructure.web.api.user_routes import create_user_routes
from src.infrastructure.web.api.document_routes import document_routes
from src.infrastructure.web.api.version_routes import version_routes_blueprint
from src.infrastructure.adapters.persistence.sql_user_repository import SQLUserRepository


logger = logging.getLogger(__name__)

app = Flask(__name__)

app.config.from_object(Config)

db = SQLAlchemy(app)

# Configuration CORS
CORS(app, supports_credentials=True)

app.register_blueprint(version_routes_blueprint, url_prefix='/api')

# Instanciation des services et repositories
user_repository = SQLUserRepository(db)
user_service = UserService(user_repository)
user_routes = create_user_routes(user_service)

app.register_blueprint(user_routes, url_prefix='/api')

app.register_blueprint(document_routes, url_prefix='/api')

@app.errorhandler(404)
def page_not_found(error):
    return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 404
    
@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0')
