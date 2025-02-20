from typing import List
from abc import ABC, abstractmethod

from src.domain.models.client_folder import ClientFolder

class ClientFolderUseCase(ABC):
    @abstractmethod
    def create_client_folder(self) ->  ClientFolder:
        pass
    
    @abstractmethod
    def get_client_folder(self, id: int) -> ClientFolder:
        pass
    
    @abstractmethod
    def get_list_client_folder_by_client_id(self, id: int) -> List[ClientFolder]:
        pass
    
    @abstractmethod
    def list_client_folder(self) -> List[ClientFolder]:
        pass
    
    @abstractmethod
    def update_client_folder(self, clientFolder: ClientFolder) -> ClientFolder:
        pass

    @abstractmethod
    def delete_client_folder(self, id: int) -> bool:
        pass