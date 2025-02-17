from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """
    Configuration de base qui s'applique à tous les environnements.
    """
    PROJECT = ''
    FLASK_ENV = 'development'
    APP_VERSION = "0.0.0"

    DEBUG = True
    TESTING = False
    FLASK_DEBUG="1"


    CACHE_TYPE = 'simple'  # Can be "memcached", "redis", etc.
    CSRF_ENABLED = True

    JWT_SECRET_KEY = "super-secret-key"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1) 
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

    # DEBUG, INFO, WARNING, ERROR, CRITICAL 
    LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG") 

    DATABASE_CONFIG = {
        "dbname": "groupe11",
        "user": "admin",
        "password": "ChangeMe",
        "host": "postgres",  
        "port": "5432"
    }

    SQLALCHEMY_DATABASE_URI = (
        f"postgresql+psycopg2://{DATABASE_CONFIG['user']}:"
        f"{DATABASE_CONFIG['password']}@{DATABASE_CONFIG['host']}:"
        f"{DATABASE_CONFIG['port']}/{DATABASE_CONFIG['dbname']}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    def __setitem__(self, key, item):
        self.__dict__[key] = item

    def __getitem__(self, key):
        return self.__dict__[key]


class DevelopmentConfig(Config):
    """
    Configuration spécifique à l'environnement de développement.
    """
    FLASK_ENV="development"
    DEBUG = True

class DebugConfig(Config):
    """
    Configuration spécifique à l'environnement de développement.
    """
    FLASK_ENV="debug"
    DEBUG = True

class ReleaseConfig(Config):
    """
    Configuration spécifique pour les tests unitaires.
    """
    FLASK_ENV="release"
    TESTING = True

class TestConfig(Config):
    """
    Configuration spécifique pour les tests unitaires.
    """
    TESTING = True



class ProductionConfig(Config):
    """
    Configuration spécifique à l'environnement de production.
    """
    FLASK_ENV="production"