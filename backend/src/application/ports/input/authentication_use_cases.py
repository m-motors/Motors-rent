from abc import ABC, abstractmethod

from src.domain.models.user import User

class AuthenticationUseCase(ABC):
    @abstractmethod
    def login(self, identification: str, password: str) ->  True:
        pass
    
    @abstractmethod
    def logout(self, id: int) -> bool:
        pass
    
    @abstractmethod
    def verify(self, id: int) -> User:
        pass
    
