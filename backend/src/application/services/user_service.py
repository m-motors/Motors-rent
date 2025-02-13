from domain.models.vehicle import User
from application.ports.input.vehicle_use_cases import UserUseCase
from application.ports.output.vehicle_repository import UserRepository
from typing import List


class UserService(UserUseCase):
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    def get_user(self, id: int) -> User | None:
        return self.user_repository.find_by_id(id)
    
    def list_users(self) -> List[User]:
        return self.user_repository.find_all()
    
    def create_user(self, user: User) -> User:
        return self.user_repository.save(user)
    
    def update_user(self, user: User) -> User:
        return self.user_repository.update(user)
    
    def delete_user(self, id: int) -> bool:
        return self.user_repository.delete(id)