import os
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from common.logger import logger
from config.config import Config

MIGRATIONS_DIR = os.path.join(os.path.dirname(__file__), "../migrations")

def apply_migrations(db):
    db.session.execute(text(""" 
        CREATE TABLE IF NOT EXISTS migrations (
            version VARCHAR(255) PRIMARY KEY,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """))
    db.session.commit()

    applied_migrations = db.session.execute(text("SELECT version FROM migrations")).fetchall()
    applied_migrations = {row[0] for row in applied_migrations}

    migration_files = sorted(os.listdir(MIGRATIONS_DIR))

    for migration_file in migration_files:
        migration_name = migration_file.replace(".sql", "")

        if migration_name not in applied_migrations:
            file_path = os.path.join(MIGRATIONS_DIR, migration_file)
            with open(file_path, "r") as file:
                sql = file.read()
                db.session.execute(text(sql))
                db.session.commit()
            logger.info(f"Migration {migration_name} appliquée.")

            try:
                db.session.execute(text("""
                    INSERT INTO migrations (version, applied_at) 
                    SELECT :version, NOW() 
                    WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE version = :version)
                """), {"version": migration_name})
                db.session.commit()
            except Exception as e:
                logger.error(f"Erreur lors de l'ajout de la migration {migration_name} : {e}")
                db.session.rollback()
        else:
            logger.info(f"Migration {migration_name} déjà appliquée, passage...")

    logger.info("Toutes les migrations sont à jour.")

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)

if __name__ == '__main__':
    with app.app_context():
        try:
            logger.info("Application des migrations...")
            apply_migrations(db)
        finally:
            db.session.remove()
            logger.info("Application fermée.")
