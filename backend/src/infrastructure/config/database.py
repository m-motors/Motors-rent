import psycopg2
from psycopg2.extras import RealDictCursor
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

DATABASE_CONFIG = {
    "dbname": "groupe11",
    "user": "admin",
    "password": "ChangeMe",
    "host": "postgres",
    "port": "5432"
}

def get_connection():
    """Retourne une connexion PostgreSQL"""
    conn = psycopg2.connect(**DATABASE_CONFIG)
    return conn
