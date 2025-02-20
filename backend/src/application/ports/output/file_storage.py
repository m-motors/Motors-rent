from typing import BinaryIO
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