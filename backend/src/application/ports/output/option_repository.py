from typing import List
from abc import ABC, abstractmethod

from src.domain.models.option import Option

class OptionRepository(ABC):
    @abstractmethod
    def find_by_id(self, id: int) -> Option | None:
        pass
    
    @abstractmethod
    def find_all(self) -> List[Option]:
        pass

    @abstractmethod
    def save(self, option: Option) -> Option:
        pass
    
    @abstractmethod
    def update(self, option: Option) -> Option:
        pass
    
    @abstractmethod
    def delete(self, id: int) -> bool:
        pass