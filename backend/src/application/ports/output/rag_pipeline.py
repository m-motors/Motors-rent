from abc import ABC, abstractmethod
from typing import List, Any, Dict, Union, Optional

from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma



class RAGPipeline(ABC):
    @abstractmethod
    def list_llm(self, ollama_host: str = None) -> List[Dict]:
        pass

    @abstractmethod
    def install_llm(self, ollama_host: str = None, llm_model_name: str = None) -> Union[List[Dict], Dict]:
        pass

    @abstractmethod
    def uninstall_llm(self, ollama_host: str = None, llm_model_name: str = None) -> List[Dict]:
        pass


    @abstractmethod
    def list_chats(self)-> List[Dict]:
        pass

    @abstractmethod
    def create_chat(self, name, llm_model_name: str = None, description: str = None, options:dict=None, vectorstore_id: Optional[str] = None)-> dict:
        pass

    @abstractmethod
    def add_vectorstore_to_chat(self, chat_id: str, vectorstore_id: str) -> dict:
        pass

    @abstractmethod
    def remove_chat(self, id :str) -> List[Dict]:
        pass

    
    @abstractmethod
    def search_chat(self, id:str = None, name:str = None) -> List[Dict]:
        pass

    @abstractmethod
    def deep_search_chat(self, partial: Dict[str, Any]) -> List[Dict]:
        pass

    @abstractmethod
    def list_options_chat(self, id:str) -> Dict:
        pass

    @abstractmethod
    def update_options_chat(self, id: str, options:Dict) -> Dict:
        pass

    @abstractmethod
    def generate_response(self, question: str, ollama_host: str = None, llm_model_name: str = None, id: str = None, with_retriever: bool = None, vectorstore_id: str = None, prompt_template: str = None) -> any:
        pass



    @abstractmethod
    def list_embedders(self)-> List[Dict]:
        pass
        
    @abstractmethod        
    def search_embedder(self, id:str = None, name:str = None) -> List[Dict]:
        pass

    @abstractmethod        
    def load_embedder(self, model_name:str=None, device:str=None, is_encode_kwargs:str=None) -> any:
        pass
    
    @abstractmethod
    def create_embedder(self, model_name:str=None, device:str=None, is_encode_kwargs:str=None) -> Dict:
        pass

    @abstractmethod
    def remove_embedder(self, id:str) -> List[Dict]:
        pass

    @abstractmethod
    def create_vector_space(self, persist_directory:str=None, collection_name:str=None, embedder:any=None) -> Chroma:
        pass
    
    @abstractmethod
    def create_retriever(self, vector_space: Chroma) -> Dict:
        pass
    
    @abstractmethod
    def save_vectorstore(self, persist_directory:str=None, collection_name:str=None, embedder_id: str=None) -> Dict: 
        pass

    @abstractmethod
    def list_vectorstore(self)-> List[Dict]:
        pass

    @abstractmethod
    def search_vectorstores(self, id:str = None, name:str = None) -> List[Dict]:
        pass

    @abstractmethod
    def update_vectorstore(self, id: str, updates: Dict) -> List[Dict]:
        pass
    
    @abstractmethod
    def remove_vectorstore(self, id:str) -> List[Dict]:
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





