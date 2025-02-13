import os
import sys
import logging
from flask_cors import CORS
from dotenv import load_dotenv
from src.infrastructure.config.config import Config
from src.infrastructure.config.config import DevelopmentConfig

def configure_app(app, config=None):

    if config:
        app.config.from_object(config)

    env_config_class = f'config.{'DEVELOPMENT'}Config'
    app.config.from_object(Config, silent=True)
    app.config.from_object(env_config_class)

    # print(f"Environment: {app.config['FLASK_ENV']}")
    # print(f"Debug mode: {app.config['DEBUG']}")
    # print(f"Testing mode: {app.config['TESTING']}")

    return app