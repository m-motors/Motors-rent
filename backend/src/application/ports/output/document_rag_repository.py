from typing import List
from abc import ABC, abstractmethod

from src.domain.models.document_rag import DocumentRAG

class DocumentRAGRepository(ABC):
    @abstractmethod
    def find_by_id(self, id: int) -> DocumentRAG | None:
        pass
    