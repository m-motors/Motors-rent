from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PROJECT = os.getenv("PROJECT", "M-MOTORS") 
    FLASK_ENV = os.getenv("ENV_MODE", "production") 
    APP_VERSION = os.getenv("APP_VERSION", "0.0.0")

    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"
    TESTING = os.getenv("FLASK_TESTING", "0") == "1"
    HOST = os.getenv("FLASK_HOST", '0.0.0.0')
    PORT = int(os.getenv("FLASK_INTERNAL_PORT", 5000))

    # Valeurs possibles: "simple", "redis", "memcached".
    CACHE_TYPE = os.getenv("CACHE_TYPE", 'simple') 
    CSRF_ENABLED = os.getenv("CSRF_ENABLED", "1") == "1"

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 1)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", 7)))

    # Valeurs possibles: "DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"
    LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")  
    

    DATABASE_CONFIG = {
        "dbname": os.getenv("POSTGRES_NAME", "groupe11"),
        "user": os.getenv("POSTGRES_USER", "admin"),
        "password": os.getenv("POSTGRES_PASSWORD", "ChangeMe"),
        "host": os.getenv("POSTGRES_HOST", "postgres"),
        "port": os.getenv("POSTGRES_PORT", "5432"),
    }

    SQLALCHEMY_DATABASE_URI = (
        f"postgresql+psycopg2://{DATABASE_CONFIG['user']}:{DATABASE_CONFIG['password']}@{DATABASE_CONFIG['host']}:{DATABASE_CONFIG['port']}/{DATABASE_CONFIG['dbname']}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS", "0") 

    def __setitem__(self, key, item):
        self.__dict__[key] = item

    def __getitem__(self, key):
        return self.__dict__[key]


class DevelopmentConfig(Config):
    FLASK_ENV = "development"
    DEBUG = 1
    TESTING = 1
    SSL_CONTEXT = "adhoc"
    

class ProductionConfig(Config):
    FLASK_ENV = "production"
    DEBUG = 0
    TESTING = 0

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY:
        raise ValueError("SECRET DEFINITON ERROR")