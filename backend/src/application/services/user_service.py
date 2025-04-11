from typing import List
from werkzeug.security import generate_password_hash

from src.domain.models.user import User, UserRole
from src.application.ports.input.user_use_case import UserUseCase
from src.application.ports.output.user_repository import UserRepository

class UserService(UserUseCase):
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    def get_user(self, id: int) -> User | None:
        return self.user_repository.find_by_id(id)
    
    def list_users(self) -> List[User]:
        return self.user_repository.find_all()
    
    def create_user(self, user: User) -> User:
        user.password = generate_password_hash(user.password)
        return self.user_repository.save(user)
    
    def update_user(self, current_user: User, id: int, update_data) -> User:
        user = self.user_repository.find_by_id(id)

        if not user:
            raise ValueError("User not found")
    
        if current_user.user_role == UserRole.CLIENT: 
            if user.id != current_user.id: 
                raise PermissionError("No access to user")
            
        if user.user_role == UserRole.CLIENT:
            restricted_fields = {"is_active", "user_role"}
            if current_user.id != user.id or any(field in update_data for field in restricted_fields):
                raise PermissionError("Unauthorized")
        
        if "is_active" in update_data:
            user.is_active = update_data["is_active"]

        if "user_role" in update_data:
            try:
                user.user_role = UserRole(update_data["user_role"])
            except ValueError:
                raise ValueError(f"Invalid user_role: {update_data['user_role']}")

        if "password" in update_data:
            user.password = generate_password_hash(update_data["password"])

        if "first_name" in update_data:
            user.first_name = update_data["first_name"]

        if "last_name" in update_data:
            user.last_name =  update_data["last_name"]
        
        return self.user_repository.update(user)
    
    def delete_user(self, current_user: User, id: int) -> bool:
        if current_user.user_role == UserRole.CLIENT: 
            user = self.user_repository.find_by_id(id)
        if user.id != current_user.id: 
            raise PermissionError("No access to user")
        
        return self.user_repository.delete(id)


