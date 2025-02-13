from abc import ABC, abstractmethod
from typing import BinaryIO

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