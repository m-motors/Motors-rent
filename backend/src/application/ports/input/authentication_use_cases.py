from abc import ABC, abstractmethod

class AuthenticationUseCase(ABC):
    @abstractmethod
    def login(self, identification: str, password: str) ->  True:
        pass
    
    @abstractmethod
    def logout(self, id: int) -> bool:
        pass
