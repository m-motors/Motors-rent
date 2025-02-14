import os
import sys
sys.path.append('/app/src')
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..")))

from src.infrastructure.adapters.persistence.mysql_user_repository import SQLUserRepository
# from .mysql_user_repository import SQLUserRepository

from flask_sqlalchemy import SQLAlchemy
# from sql_user_repository import SQLUserRepository
from src.domain.models.user import User

db = SQLAlchemy()
user_repo = SQLUserRepository(db)

user = User(
    created_at=None,
    email="test@example.com",
    first_name="John",
    last_name="Doe",
    is_active=True,
    user_role="client",
    password="hashed_password"
)

user_saved = user_repo.save(user)
print(f"Utilisateur enregistré : {user_saved}")

user_found = user_repo.find_by_id(user_saved.id)
print(f"Utilisateur trouvé : {user_found}")
