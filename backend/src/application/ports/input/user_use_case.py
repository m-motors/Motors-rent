from typing import List
from abc import ABC, abstractmethod

from src.domain.models.user import User

class UserUseCase(ABC):
    @abstractmethod
    def get_user(self, id: int) -> User | None:
        pass
    
    @abstractmethod
    def list_users(self) -> List[User]:
        pass
    
    @abstractmethod
    def create_user(self, user: User) -> User:
        pass
    
    @abstractmethod
    def update_user(self, user: User) -> User:
        pass
    
    @abstractmethod
    def delete_user(self, id: int) -> bool:
        pass
