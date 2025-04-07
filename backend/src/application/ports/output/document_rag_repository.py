from typing import List, Optional
from abc import ABC, abstractmethod

from src.domain.models.document_rag import DocumentRAG

class DocumentRAGRepository(ABC):
    @abstractmethod
    def save(self, document_rag: DocumentRAG) -> DocumentRAG:
        pass

    @abstractmethod
    def find_by_id(self, document_rag__id: int) -> Optional[DocumentRAG]:
        pass

    @abstractmethod
    def find_all(self) -> List[DocumentRAG]:
        pass

    @abstractmethod
    def delete(self, document_rag_id: int) -> bool:
        pass

    @abstractmethod
    def update(self, document_rag: DocumentRAG) -> DocumentRAG:
        pass
    