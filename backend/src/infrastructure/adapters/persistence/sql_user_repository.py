from typing import List, Optional
from src.domain.models.user import User
from src.application.ports.output.user_repository import UserRepository
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import text

class SQLUserRepository(UserRepository):
    def __init__(self, db: SQLAlchemy):
        self.db = db

    def find_by_id(self, id: int) -> Optional[User]:
        query = text("""
            SELECT * FROM users WHERE id = :id
        """)
        result = self.db.session.execute(query, {"id": id}).fetchone()
        return self._map_to_user(result._asdict()) if result else None
    
    def find_all(self) -> List[User]:
        query = text("""
            SELECT * FROM users
        """)
        results = self.db.session.execute(query).fetchall()
        return [self._map_to_user(row._asdict()) for row in results]

    def save(self, user: User) -> User:
        query = text("""
            INSERT INTO users (created_at, email, first_name, last_name, is_active, user_role, password)
            VALUES (:created_at, :email, :first_name, :last_name, :is_active, :user_role, :password)
            RETURNING id
        """)
        params = self._map_to_params(user)
        result = self.db.session.execute(query, params)
        self.db.session.commit()

        user.id = result.fetchone()[0]
        return user

    def update(self, user: User) -> User:
        query = text("""
            UPDATE users SET email=:email, first_name=:first_name, last_name=:last_name, 
            is_active=:is_active, user_role=:user_role, password=:password
            WHERE id=:id
            RETURNING *
        """)
        params = self._map_to_params(user)
        result = self.db.session.execute(query, params)
        self.db.session.commit()

        return self._map_to_user(result.fetchone()._asdict())

    def delete(self, id: int) -> bool:
        query = text("DELETE FROM users WHERE id = :id")
        result = self.db.session.execute(query, {"id": id})
        self.db.session.commit()

        return result.rowcount > 0
    

    def _map_to_user(self, row) -> User:
        return User(
            id=row["id"],
            created_at=row["created_at"],
            email=row["email"],
            first_name=row["first_name"],
            last_name=row["last_name"],
            is_active=row["is_active"],
            user_role=row["user_role"],
            password=row["password"]
        )


    
    def _map_to_params(self, user: User) -> dict:
        return {
            "created_at": user.created_at,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_active": user.is_active,
            "user_role": user.user_role,
            "password": user.password,
            "id": user.id,
        }

