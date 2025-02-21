from typing import List
from abc import ABC, abstractmethod

from src.domain.models.client_folder import ClientFolder

class ClientFolderRepository(ABC):
    @abstractmethod
    def find_by_id(self, id: int) -> ClientFolder | None:
        pass
    
    @abstractmethod
    def find_all(self) -> List[ClientFolder]:
        pass

    @abstractmethod
    def get_list_client_folder_by_client_id(self, client_id:int) -> List[ClientFolder]:
        pass
    
    @abstractmethod
    def save(self, clientFolder: ClientFolder) -> ClientFolder:
        pass
    
    @abstractmethod
    def update(self, clientFolder: ClientFolder) -> ClientFolder:
        pass
    
    @abstractmethod
    def delete(self, id: int) -> bool:
        pass