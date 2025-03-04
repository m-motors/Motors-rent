from typing import List, Optional

from src.domain.models.user import User, UserRole
from src.application.ports.output.user_repository import UserRepository
from src.application.ports.input.client_folder_use_case import ClientFolderUseCase
from src.application.ports.output.client_folder_repository import ClientFolderRepository
from src.domain.models.client_folder import ClientFolder, ClientFolderStatus, ClientFolderType

class ClientFolderService(ClientFolderUseCase):
    def __init__(self, user_repository: UserRepository, client_folder_repository: ClientFolderRepository):
        self.user_repository = user_repository
        self.client_folder_repository = client_folder_repository

    def create_client_folder(self, current_user: User, client_id: Optional[int], type: ClientFolderType, vehicule_id: Optional[int], option_ids : Optional[list], document_ids : Optional[list]) -> ClientFolder:
        if client_id is None or current_user.user_role == UserRole.CLIENT:
            client_id = current_user.id
            
        client_folder = ClientFolder(
            id=None,
            user_id=client_id,
            type=type,
            vehicule_id=vehicule_id,
            status=ClientFolderStatus.CREATED,
            option_ids=option_ids, 
            document_ids=document_ids
        )
        client_folder = self.client_folder_repository.save(client_folder)
        return client_folder


    def list_client_folder(self) -> List[ClientFolder]:
        return self.client_folder_repository.find_all()


    def get_client_folder(self, current_user : User, id: int) -> Optional[ClientFolder]:
        client_folder = self.client_folder_repository.find_by_id(id)

        if not client_folder:
            raise ValueError("Client folder not found")
        
        if current_user.user_role == UserRole.CLIENT and current_user.id != client_folder.user_id:
            raise PermissionError("No access to client folder")

        return client_folder
    

    def get_list_client_folder_by_client_id(self, client_id: int) -> List[ClientFolder]:
        client_folders = self.client_folder_repository.get_list_client_folder_by_client_id(client_id)

        if not client_folders:
            raise ValueError("Client folder not found")

        return client_folders
    
    def update_client_folder(self, user: User, client_folder_id: int, update_data: dict) -> ClientFolder:
        client_folder = self.client_folder_repository.find_by_id(client_folder_id)

        if not client_folder:
            raise ValueError("Client Folder not found")

        if user.user_role == UserRole.CLIENT:
            restricted_fields = {"status", "type", "user_id"}
            if client_folder.user_id != user.id or any(field in update_data for field in restricted_fields):
                raise PermissionError("Unauthorized")
            
            client_folder.status = ClientFolderStatus.IN_VALIDATION
  
        if "status" in update_data:
            try:
                client_folder.status = ClientFolderStatus(update_data['status'])
            except ValueError:
                raise ValueError(f"Invalid status: {update_data['status']}")

        if "type" in update_data:
            try:
                client_folder.type = ClientFolderType(update_data['type'])
            except ValueError:
                raise ValueError(f"Invalid type: {update_data['type']}")

        if "user_id" in update_data:
            client_folder.user_id = update_data["user_id"]

        if "vehicule_id" in update_data:
            client_folder.vehicule_id = update_data["vehicule_id"]

        if "option_ids" in update_data:
            client_folder.option_ids = update_data["option_ids"]

        if "document_ids" in update_data:
            client_folder.document_ids =  update_data["document_ids"]

        return self.client_folder_repository.update(client_folder)

    
    def delete_client_folder(self, current_user: User, id: int) -> bool:
        if current_user.user_role == UserRole.CLIENT: 
            client_folder = self.client_folder_repository.find_by_id(id)
            if client_folder.user_id != current_user.id: 
                raise PermissionError("No access to client folder")

        return self.client_folder_repository.delete(id)
