from typing import List, Optional
from abc import ABC, abstractmethod

from src.domain.models.document import Document


class DocumentRepository(ABC):
    @abstractmethod
    def save(self, document: Document) -> Document:
        pass

    @abstractmethod
    def find_by_id(self, document_id: int) -> Optional[Document]:
        pass

    @abstractmethod
    def find_by_application(self, application_id: int) -> List[Document]:
        pass

    @abstractmethod
    def delete(self, document_id: int) -> bool:
        pass

    @abstractmethod
    def update(self, document: Document) -> Document:
        pass
