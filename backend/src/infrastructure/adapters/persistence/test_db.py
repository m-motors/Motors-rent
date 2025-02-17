import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_CONFIG = {
    "dbname": "groupe11",
    "user": "admin",
    "password": "ChangeMe",
    "host": "postgres",
    "port": "5432"
}

def get_connection():
    """Retourne une connexion PostgreSQL"""
    try:
        conn = psycopg2.connect(**DATABASE_CONFIG)
        print("✅ Connexion à PostgreSQL réussie !")
        return conn
    except Exception as e:
        print("❌ Erreur de connexion à PostgreSQL :", e)
        return None

if __name__ == "__main__":
    conn = get_connection()
    if conn:
        conn.close()
        print("✅ Connexion fermée proprement.")
