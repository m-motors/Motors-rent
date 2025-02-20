from typing import List
from abc import ABC, abstractmethod

from src.domain.models.option import Option

class OptionUsecase(ABC):
    @abstractmethod
    def create_option(self) ->  Option:
        pass
    
    @abstractmethod
    def get_option(self, id: int) -> Option:
        pass
    
    @abstractmethod
    def list_option(self) -> List[Option]:
        pass
    
    @abstractmethod
    def update_option(self, id: int, name: str) -> Option:
        pass

    @abstractmethod
    def delete_option(self, id: int) -> bool:
        pass