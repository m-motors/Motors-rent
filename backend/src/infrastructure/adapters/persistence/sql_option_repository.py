from typing import List, Optional
from sqlalchemy import text
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError

from src.domain.models.option import Option
from src.application.ports.output.option_repository import OptionRepository

class SQLOptionRepository(OptionRepository):
    def __init__(self, db: SQLAlchemy):
        self.db = db

    def find_by_id(self, id: int) -> Optional[Option]:
        query = text("SELECT * FROM options WHERE id = :id")
        result = self.db.session.execute(query, {"id": id}).fetchone()
        return self._map_to_option(result._asdict()) if result else None


    def find_all(self) -> List[Option]:
        query = text("SELECT * FROM options")
        results = self.db.session.execute(query).fetchall()
        return [self._map_to_option(row._asdict()) for row in results]

    def save(self, option: Option) -> Option:
        query = text("""
            INSERT INTO options (name)
            VALUES (:name)
            RETURNING id
        """)
        params = self._map_to_params(option)
        
        try:
            result = self.db.session.execute(query, params)
            self.db.session.commit()
            option.id = result.fetchone()[0]
            return option
        except SQLAlchemyError as e:
            self.db.session.rollback()
            raise RuntimeError(f"Database error: {str(e)}")

    def update(self, option: Option) -> Optional[Option]:
        query = text("""
            UPDATE options 
            SET name=:name
            WHERE id=:id
            RETURNING *
        """)
        params = self._map_to_params(option)
    
        try:
            result = self.db.session.execute(query, params)
            self.db.session.commit()
            result = result.fetchone()
            return self._map_to_option(result._asdict()) if result else None
        except SQLAlchemyError as e:
            self.db.session.rollback()
            raise RuntimeError(f"Database error: {str(e)}")

    def delete(self, id: int) -> bool:
        query = text("DELETE FROM options WHERE id = :id")
        try:
            result = self.db.session.execute(query, {"id": id})
            self.db.session.commit()
            return result.rowcount > 0
        except SQLAlchemyError as e:
            self.db.session.rollback()
            raise RuntimeError(f"Database error: {str(e)}")

    def _map_to_option(self, row: dict) -> Option:
        return Option(
            id=row["id"],
            name=row["name"]
        )

    def _map_to_params(self, option: Option) -> dict:
        return {
            "id": option.id,
            "name": option.name,
        }