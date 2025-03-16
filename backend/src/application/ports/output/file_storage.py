from typing import BinaryIO, List
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
    def list_objects(self, folder_name: str = "") -> List[str]:
        pass

    @abstractmethod
    def upload_file(self, file: BinaryIO, file_name: str, folder_name: str = "") -> str:
        pass

    @abstractmethod
    def download_file(self, file_name: str, folder_name: str = "", local_path: str = None) -> str:
        pass

