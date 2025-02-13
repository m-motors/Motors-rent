from abc import ABC, abstractmethod
from typing import List
from domain.models.user import User

class UserRepository(ABC):
    @abstractmethod
    def find_by_id(self, id: int) -> User | None:
        pass
    
    @abstractmethod
    def find_all(self) -> List[User]:
        pass
    
    @abstractmethod
    def save(self, user: User) -> User:
        pass
    
    @abstractmethod
    def update(self, user: User) -> User:
        pass
    
    @abstractmethod
    def delete(self, id: int) -> bool:
        pass