from typing import List, Any, Dict
from abc import ABC, abstractmethod

class RAGPipeline(ABC):
    @abstractmethod
    def list_llm(self,  ollama_host: str = None) -> List:
        pass

    @abstractmethod
    def install_llm(self, ollama_host: str = None, llm_model_name: str = None) -> List | dict :
        pass

    @abstractmethod
    def uninstall_llm(self, ollama_host: str = None, llm_model_name: str = None)-> Dict:
        pass

    @abstractmethod
    def create_chat(self, name: str, llm_model_name: str = None, description:str = '', options:dict = None)-> dict:
        pass

    @abstractmethod
    def list_chats(self)-> List:
        pass
    
    @abstractmethod
    def search_chat(self, identifier:str) -> dict:
        pass

    @abstractmethod
    def remove_chat(self, identifier: str) -> bool:
        pass


    @abstractmethod
    def list_chat_options(self, identifier:str)-> dict:
        pass

    @abstractmethod
    def set_chat_options(self, identifier:str, options: dict = None) -> dict:
        pass


    @abstractmethod
    def generate_response(self, question: str, ollama_host: str = None, llm_model_name: str = None, withContext: bool = False, retriever: Any = None, prompt_template: Any = None) -> Any:
        pass


    # @abstractmethod
    # def load_embedding_model(self, model_name: str) -> Any:
    #     pass
    
    # @abstractmethod
    # def load_document(self, file_path: str) -> Any:
    #     pass
    
    # @abstractmethod
    # def chunk_text(self, doc_content: str, chunk_size: int, chunk_overlap: int)  -> Any:
    #     pass
    
    # @abstractmethod
    # def create_vectorstore_indexing_chunks(self, chunks: List, embeddings: Any, persist_directory: str) -> Any:
    #     pass
    
    # @abstractmethod
    # def create_retriever(self, vectorstore: str) -> Any:
    #     pass
    
    # @abstractmethod
    # def define_prompt_template(self) -> Any:
    #     pass
    

    # @abstractmethod
    # def startRAG(self) -> Any:
    #     pass




