from abc import ABC, abstractmethod
from typing import Any, List, Dict, BinaryIO, Optional

from langchain_core.documents import Document

from src.domain.models.document_rag import DocumentRAG
from src.domain.models.document_rag import DocumentRAGStatus

class RAGUseCase(ABC):
    @abstractmethod
    def list_llm(self) -> List[Dict]:
        pass

    @abstractmethod
    def install_llm(self, llm_model_name:str = None) -> List | dict :
        pass
    
    @abstractmethod
    def uninstall_llm(selfllm_model_name:str = None) -> List[Dict]:
        pass
    
    @abstractmethod
    def list_chats(self)-> List:
        pass

    @abstractmethod
    def create_chat(self, name: str, llm_model_name: str = None, description: str = None, options:dict=None, vectorstore_id: Optional[str] = None)-> dict:
        pass

    @abstractmethod
    def remove_chat(self, id:str) -> List[Dict]:
        pass

    @abstractmethod
    def search_chat(self, id:str = None, name:str = None) -> List[Dict]:
        pass

    @abstractmethod
    def add_vectorstore_to_chat(self, id:str, vectorstore_id:str) -> Dict:
        pass

    @abstractmethod
    def deepsearch_chat(self, partial:Dict) -> List[Dict]:
        pass

    @abstractmethod
    def list_options_chat(self, id:str) -> Dict:
        pass

    @abstractmethod
    def update_options_chat(self, id: str, options:dict) -> dict:
        pass

    @abstractmethod
    def generate_response(self, question:str, llm_model_name:str=None, id:str=None, with_retriever:bool=False, vectorstore_id:str=None, prompt_template:str=None) -> any:
        pass
    
    
    @abstractmethod
    def list_storage_files(self) -> List[str]:
        pass

    @abstractmethod
    def upload_storage_files(self, file: BinaryIO, file_name: str, folder_name: str = None) -> Dict:
        pass

    @abstractmethod
    def download_storage_files(self, file_name: str, folder_name: str = None, local_path: str = None) -> Dict:
        pass

    @abstractmethod
    def delete_storage_files(self, file_name: str, folder_name: str = None) -> Dict:
        pass


    @abstractmethod
    def list_document_rag(self) -> List[DocumentRAG]:
        pass

    @abstractmethod
    def get_document_rag(self, id: int) -> Optional[DocumentRAG]:
        pass

    @abstractmethod
    def save_document_rag(self, name: str, doc_format: str, status: DocumentRAGStatus = DocumentRAGStatus.ADD) -> DocumentRAG:
        pass

    @abstractmethod
    def update_document_rag(self, id: int, name: Optional[str] = None, doc_format: Optional[str] = None, link: Optional[str] = None, e_tag: Optional[str] = None, status: Optional[DocumentRAGStatus] = None) -> Optional[DocumentRAG]:
        pass

    @abstractmethod
    def delete_document_rag(self,  id: int) -> List[DocumentRAG]:
        pass


    @abstractmethod
    def list_embedders(self)-> List[Dict]:
        pass

    @abstractmethod
    def search_embedders(self, id:str = None, name:str = None)-> List[Dict]:
        pass

    @abstractmethod
    def create_embedder(self, model_name:str=None, device:str=None, is_encode_kwargs:str=None, embedder:any=None)-> Dict:
        pass

    @abstractmethod
    def remove_embedder(self, id:str)-> List[Dict]:
        pass

    @abstractmethod
    def save_vectorstore(self, persist_directory: str = None, collection_name: str =None) -> Dict: 
        pass

    @abstractmethod
    def list_vectorstore(self) -> List[Dict]:
        pass

    @abstractmethod
    def search_vectorstores(self, id:str = None, name:str = None) -> Dict: 
        pass

    @abstractmethod
    def remove_vectorstore(self, id:str) -> Dict: 
        pass

    
    @abstractmethod
    def load_documents(self, dirs: Optional[List[str]] = None, files: Optional[List[str]] = None) -> List[Document]:
        pass

    @abstractmethod   
    def chunk_docs(self, documents: List[Document], chunk_size: int = None, chunk_overlap: int = None) -> List[Document]:
        pass

    @abstractmethod    
    def get_docs_from_file(self, file_path: str, supported_extensions:any) -> List[Document]:
        pass

    @abstractmethod  
    def add_docs_store(self, store_id: str, dirs: Optional[List[str]] = None, files: Optional[List[str]] = None, chunk_size: Optional[int] = None,
    chunk_overlap: Optional[int] = None) -> Dict:
        pass

    @abstractmethod    
    def remove_docs_store(self, store_id: str) -> Dict:
        pass

    

