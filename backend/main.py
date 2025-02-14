import os
import sys
import logging
from flask_cors import CORS
from flask import Flask, jsonify, Blueprint


from src.infrastructure.config.config import Config
from src.infrastructure.web.api.version_routes import version_routes_blueprint
from src.infrastructure.web.api.user_routes import user_routes

from src.infrastructure.web.api.document_routes import document_routes

logger = logging.getLogger(__name__)

app = Flask(__name__)

app.config.from_object(Config)

CORS(app, supports_credentials=True)

# Ajouter les blueprint ici 
app.register_blueprint(version_routes_blueprint, url_prefix='/api')
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