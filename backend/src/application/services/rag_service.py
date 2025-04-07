import uuid
from datetime import datetime, timezone
from typing import Any, BinaryIO, List, Optional, Dict

from langchain_core.documents import Document

from src.domain.models.document_rag import DocumentRAG
from src.domain.models.document_rag import DocumentRAGStatus
from src.application.ports.output.rag_pipeline import RAGPipeline
from src.application.ports.output.file_storage import DocumentStorage
from src.application.ports.output.document_rag_repository import DocumentRAGRepository


class RAGService:
    def __init__(self, document_RAG_repository: DocumentRAGRepository, document_storage: DocumentStorage, rag_pipeline: RAGPipeline, rag_file_storage_folder_name:str='llm', tmp_rag_file_storage_folder_name:str="tmp"):
        self.document_RAG_repository = document_RAG_repository
        self.document_storage = document_storage
        self.rag_pipeline = rag_pipeline
        self.rag_file_storage_folder_name = rag_file_storage_folder_name
        self.tmp_rag_file_storage_folder_name = tmp_rag_file_storage_folder_name
    
    def list_llm(self) -> List:
        return self.rag_pipeline.list_llm()

    def install_llm(self, llm_model_name:str=None) -> List | Dict :
        return self.rag_pipeline.install_llm(llm_model_name=llm_model_name)
    
    def uninstall_llm(self, llm_model_name:str=None) -> List:
        return self.rag_pipeline.uninstall_llm(llm_model_name=llm_model_name)
    
    def list_chats(self)-> List:
        return self.rag_pipeline.list_chats()
    
    def create_chat(self, name,  llm_model_name: str = None, description: str = None, options:Dict=None, vectorstore_id: Optional[str] = None)-> Dict:
        return self.rag_pipeline.create_chat(name=name, llm_model_name=llm_model_name, description=description, options=options, vectorstore_id=vectorstore_id)

    def remove_chat(self, id:str) -> bool:
        return self.rag_pipeline.remove_chat(id)

    def search_chat(self, id:str = None, name:str = None) -> List[Dict]:
        return self.rag_pipeline.search_chat(id=id, name=name)
    
    def add_vectorstore_to_chat(self, id:str, vectorstore_id:str) -> Dict:
        return self.rag_pipeline.add_vectorstore_to_chat(id=id, vectorstore_id=vectorstore_id)
    
    def deepsearch_chat(self, partial:Dict) -> List[Dict]:
        return self.rag_pipeline.deep_search_chat(partial)
    
    def list_options_chat(self, id:str)-> dict:
        return self.rag_pipeline.list_options_chat(id)

    def update_options_chat(self, id: str, options:dict) -> dict:
        return self.rag_pipeline.update_options_chat(id, options)


    def generate_response(self, question:str, llm_model_name:str=None, id:str=None, with_retriever:bool=None, vectorstore_id:str=None, prompt_template:str=None) -> any:
        return self.rag_pipeline.generate_response(question, llm_model_name=llm_model_name, id=id, with_retriever=with_retriever, vectorstore_id=vectorstore_id, prompt_template=prompt_template)


    def list_storage_files(self) -> List[str]:
        return self.document_storage.list_objects(folder_name=self.rag_file_storage_folder_name)

    def upload_storage_files(self, file: BinaryIO, file_name: str, folder_name: str = None) -> Dict:
        rag_file_storage_folder_name = folder_name if folder_name else self.rag_file_storage_folder_name
        return self.document_storage.upload_file(file, file_name, folder_name=rag_file_storage_folder_name)

    def download_storage_files(self, file_name: str, folder_name: str = None, local_path: str = None) -> Dict:
        rag_file_storage_folder_name = folder_name if folder_name else self.rag_file_storage_folder_name
        tmp_rag_file_storage_folder_name = local_path if local_path else self.tmp_rag_file_storage_folder_name
        return self.document_storage.download_file(file_name, folder_name=rag_file_storage_folder_name, local_path=tmp_rag_file_storage_folder_name)

    def delete_storage_files(self, file_name: str, folder_name: str = None) -> Dict:
        rag_file_storage_folder_name = folder_name if folder_name else self.rag_file_storage_folder_name
        return self.document_storage.delete_file(file_name, folder_name=rag_file_storage_folder_name)


    def list_document_rag(self) -> List[DocumentRAG]:
        return self.document_RAG_repository.find_all()

    def get_document_rag(self, id: int) -> Optional[DocumentRAG]:
        return self.document_RAG_repository.find_by_id(id)

    def save_document_rag(self, name: str, doc_format: str, status: DocumentRAGStatus = DocumentRAGStatus.ADD) -> DocumentRAG:
        document_rag = DocumentRAG(
            id=None,
            name=name,
            doc_format=doc_format,
            link=None,
            e_tag=None,
            status=status,
            created_at=datetime.now(timezone.utc)
        )
        return self.document_RAG_repository.save(document_rag)

    def update_document_rag(self, id: int, name: Optional[str] = None, doc_format: Optional[str] = None, link: Optional[str] = None, e_tag: Optional[str] = None, status: Optional[DocumentRAGStatus] = None) -> Optional[DocumentRAG]:

        document = self.document_RAG_repository.find_by_id(id)
        if not document:
            raise ValueError("Document not found")

        if name is not None:
            document.name = name
        if doc_format is not None:
            document.doc_format = doc_format
        if link is not None:
            document.link = link
        if e_tag is not None:
            document.e_tag = e_tag
        if status is not None:
            document.status = status

        return self.document_RAG_repository.update(document)


    def delete_document_rag(self,  id: int) -> List[DocumentRAG]:
        document = self.document_RAG_repository.find_by_id(id)
        if not document:
            raise ValueError("Document not found")
        
        self.document_RAG_repository.delete(id)
        return self.document_RAG_repository.find_all()


    def list_embedders(self)-> List[Dict]:
        return self.rag_pipeline.list_embedders()
    
    def search_embedders(self, id:str = None, name:str = None)-> List[Dict]:
        return self.rag_pipeline.search_embedder(id=id, name=name)
    
    def create_embedder(self, model_name:str=None, device:str=None, is_encode_kwargs:str=None)-> Dict:
        return self.rag_pipeline.create_embedder(model_name=model_name, device=device, is_encode_kwargs=is_encode_kwargs)
    
    def remove_embedder(self, id:str)-> List[Dict]:
        return self.rag_pipeline.remove_embedder(id)
    

    def save_vectorstore(self, persist_directory:str=None, collection_name:str=None) -> Dict: 
        return self.rag_pipeline.save_vectorstore(persist_directory=persist_directory, collection_name=collection_name)
    
    def list_vectorstore(self) -> Dict: 
        return self.rag_pipeline.list_vectorstore()
    
    def search_vectorstores(self, id:str = None, name:str = None) -> Dict: 
        return self.rag_pipeline.search_vectorstores(id=id, name=name)
    
    def remove_vectorstore(self, id:str) -> Dict: 
        return self.rag_pipeline.remove_vectorstore(id)
    
    
    def load_documents(self, dirs: Optional[List[str]] = None, files: Optional[List[str]] = None) -> List[Document]:
        return self.rag_pipeline.load_documents(dirs=dirs, files=files)
    
    def chunk_docs(self, documents: List[Document], chunk_size: int = None, chunk_overlap: int = None) -> List[Document]:
        return self.rag_pipeline.chunk_docs(documents=documents, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    
    def get_docs_from_file(self, file_path: str, supported_extensions:any) -> List[Document]:
        return self.rag_pipeline.get_docs_from_file(file_path=file_path, supported_extensions=supported_extensions)
    
    def add_docs_store(self, store_id: str, dirs: Optional[List[str]] = None, files: Optional[List[str]] = None, chunk_size: Optional[int] = None,
    chunk_overlap: Optional[int] = None) -> Dict:
        return self.rag_pipeline.add_docs_store(store_id=store_id, dirs=dirs, files=files, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    
    def remove_docs_store(self, store_id: str) -> Dict:
        return self.rag_pipeline.get_docs_from_file(store_id=store_id)
    





    #     self.document_RAG_repository = document_RAG_repository
    #     self.document_storage = document_storage


    # def create_rag_document(self, file: BinaryIO, document_type: str) ->  DocumentRAG:
    #     file_url = self.document_storage.store(file)

    #     document = DocumentRAG(
    #         id=None,
    #         document_type=document_type,
    #         link=file_url
    #     )
    


    