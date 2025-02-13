import os
from pathlib import Path
from flask, jsonify import Flask
from flask_cors import CORS
from src.infrastructure.web.configure_app import configure_app
from src.infrastructure.web.configure_app import configure_app



def create_app(config=None):
    
    root_path = Path(__file__).resolve().parent.parent.parent
    static_folder = str(root_path / 'adapters' / 'static')
    template_folder = str(root_path / 'adapters' / 'templates')

    app = Flask(__name__, 
                instance_relative_config=True, root_path=root_path,
                static_folder=static_folder,
                template_folder=template_folder)
    
    app = configure_app(app, config)
    CORS(app, supports_credentials=True)
    app = setup_blueprints(app)



    if 'flask_env' == 'production':
        return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 404
    else:
        return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 404
        
            
    @app.errorhandler(500)
    def internal_server_error(error):
        pathname = request.path
        flask_env = app.config['FLASK_ENV']

        if pathname.startswith('/api'):
            if flask_env == 'production':
                return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 500
            else:
                return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 500
        else:
            if flask_env == 'production':
                return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 500
            else:
                return jsonify({'message': str(error), 'content': '', 'error': str(error)}), 500
            
    return app


    return app