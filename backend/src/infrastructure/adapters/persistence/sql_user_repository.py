from typing import List, Optional
from domain.models.user import User
from application.ports.output.user_repository import UserRepository
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

class MySQLUserRepository(UserRepository):
    def __init__(self, db: SQLAlchemy):
        self.db = db
    
    def find_by_id(self, id: int) -> Optional[User]:
        query = """
            SELECT * FROM users WHERE id = :id
        """
        result = self.db.session.execute(query, {"id": id}).fetchone()
        return self._map_to_user(result._asdict()) if result else None
    
    def find_all(self) -> List[User]:
        query = """
            SELECT * FROM users
        """
        results = self.db.session.execute(query).fetchall()
        return [self._map_to_user(row._asdict()) for row in results]
    
    def save(self, user: User) -> User:
        query = """
            INSERT INTO users (created_at, email, first_name, last_name, is_active, user_role, password)
            VALUES (:created_at, :email, :first_name, :last_name, :is_active, :user_role, :password)
            RETURNING id
        """
        params = self._map_to_params(user)
        result = self.db.session.execute(query, params)
        self.db.session.commit()
        
        user.id = result.fetchone()[0]
        return user
    
    def _map_to_user(self, row: dict) -> User:
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
            "created_at": user.created_at or datetime.utcnow(),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_active": user.is_active,
            "user_role": user.user_role,
            "password": user.password
        }
