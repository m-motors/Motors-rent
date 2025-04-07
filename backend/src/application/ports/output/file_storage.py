from typing import BinaryIO, List, Dict
from abc import ABC, abstractmethod


class DocumentStorage(ABC):
    @abstractmethod
    def store(self, file: BinaryIO, filename: str) -> str:
        pass

    @abstractmethod
    def get_url(self, filename: str) -> str:
        pass

    @abstractmethod
    def delete(self, filename: str) -> bool:
        pass

    @abstractmethod
    def get_presigned_url(self, filename: str, expiration: int = 3600) -> str:
        pass


    @abstractmethod
    def list_objects(self, folder_name: str = "") -> Dict:
        pass

    @abstractmethod
    def upload_file(self, file: BinaryIO, file_name: str, folder_name: str = "") -> Dict:
        pass

    @abstractmethod
    def download_file(self, file_name: str, folder_name: str = None, local_path: str = 'tmp') -> Dict:
        pass

    @abstractmethod
    def delete_file(self, file_name: str, folder_name: str = None) -> Dict:
        pass

