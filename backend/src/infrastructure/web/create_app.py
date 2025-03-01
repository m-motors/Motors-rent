from flask_cors import CORS
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

from src.infrastructure.common.logger import logger
from src.infrastructure.config.config import Config
from src.application.services.user_service import UserService
from src.application.services.option_service import OptionService
from src.application.services.vehicle_service import VehicleService
from src.infrastructure.web.api.user_routes import create_user_routes
from src.infrastructure.web.api.tools_routes import create_tools_routes
from src.infrastructure.web.middleware.authorize import create_authorize
from src.infrastructure.web.api.option_routes import create_option_routes
from src.infrastructure.web.api.vehicle_routes import create_vehicle_routes
from src.application.services.client_folder_service import ClientFolderService
from src.application.services.authentication_service import AuthenticationService
from src.infrastructure.web.api.client_folder_routes import create_client_folder_routes
from src.infrastructure.web.api.authentication_routes import create_authentication_routes
from src.infrastructure.adapters.persistence.sql_user_repository import SQLUserRepository
from src.infrastructure.adapters.persistence.sql_option_repository import SQLOptionRepository
from src.infrastructure.adapters.persistence.sql_vehicle_repository import SQLVehicleRepository
from src.infrastructure.adapters.persistence.sql_client_folder_repository import SQLClientFolderRepository

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)

    app.config.from_object(Config)
    app.config.from_object(config_class)

    app.logger.info("Starting Flask application ...")
    app.logger.info(f"🚀 Démarrage de l'application : {app.config.get('PROJECT', 'Nom du projet inconnu')}")
    app.logger.info(f"🔖 Version de l'application : {app.config.get('APP_VERSION', '0.0.0')}")
    app.logger.info(f"🌍 Environnement : {app.config.get('FLASK_ENV', 'development')}")
    app.logger.info(f"🔧 Mode Debug : {app.config.get('DEBUG', False)}")
    app.logger.info(f"📜 Niveau de Log : {app.config.get('LOG_LEVEL', 'DEBUG')}")

    jwt = JWTManager(app)
    db.init_app(app)

    CORS(app, supports_credentials=True)

    # Repositories
    user_repository = SQLUserRepository(db)
    option_repository = SQLOptionRepository(db)
    vehicle_repository = SQLVehicleRepository(db)
    client_folder_repository = SQLClientFolderRepository(db)

    authorize = create_authorize(user_repository)

    # Services
    user_service = UserService(user_repository)
    option_service = OptionService(option_repository)
    vehicle_service = VehicleService(vehicle_repository)
    authentication_service = AuthenticationService(user_repository)
    client_folder_service = ClientFolderService(user_repository, client_folder_repository)

    # Create routes
    tools_routes = create_tools_routes(authorize)
    user_routes = create_user_routes(user_service, authorize)
    option_routes = create_option_routes(option_service, authorize)
    vehicle_routes = create_vehicle_routes(vehicle_service, authorize)
    authentication_routes = create_authentication_routes(authentication_service)
    client_folder_routes = create_client_folder_routes(client_folder_service, authorize)

    # Blueprint
    app.register_blueprint(user_routes, url_prefix='/api')
    app.register_blueprint(tools_routes, url_prefix='/api')
    app.register_blueprint(option_routes, url_prefix='/api')
    app.register_blueprint(vehicle_routes, url_prefix='/api')
    app.register_blueprint(client_folder_routes, url_prefix='/api')
    app.register_blueprint(authentication_routes, url_prefix='/api')

    @app.route('/')
    def hello():
        return "hello", 200

    @app.errorhandler(404)
    def page_not_found(error):
        return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 500

    return app

