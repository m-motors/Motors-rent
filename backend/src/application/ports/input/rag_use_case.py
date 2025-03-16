from typing import List
from abc import ABC, abstractmethod

from src.domain.models.document_rag import DocumentRAG

class RAGUseCase(ABC):
    @abstractmethod
    def list_llm(self) -> List:
        pass

    @abstractmethod
    def install_llm(self) -> List | dict :
        pass
    
    @abstractmethod
    def uninstall_llm(self) -> any:
        pass
    
    @abstractmethod
    def create_chat(self, name: str, description: str = '', options:dict = None)-> dict:
        pass

    @abstractmethod
    def list_chats(self)-> List:
        pass

    @abstractmethod
    def search_chat(self, identifier: str) -> dict:
        pass

    @abstractmethod
    def remove_chat(self, identifier: str) -> bool:
        pass

    @abstractmethod
    def list_chat_options(self, identifier: str)-> dict:
        pass

    @abstractmethod
    def set_chat_options(self, identifier: str, options: dict = None) -> dict:
        pass



    @abstractmethod
    def generate_response(self, question:str) -> any:
        pass
    









