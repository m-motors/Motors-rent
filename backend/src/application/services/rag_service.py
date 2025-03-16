import uuid
from typing import BinaryIO, List, Optional

from src.application.ports.output.rag_pipeline import RAGPipeline
from src.application.ports.output.file_storage import DocumentStorage
from src.application.ports.output.document_rag_repository import DocumentRAGRepository


class RAGService:
    def __init__(self, document_RAG_repository: DocumentRAGRepository, document_storage: DocumentStorage, rag_pipeline: RAGPipeline):
        self.document_RAG_repository = document_RAG_repository
        self.document_storage = document_storage
        self.rag_pipeline = rag_pipeline
    
    def list_llm(self) -> List:
        return self.rag_pipeline.list_llm()

    def install_llm(self) -> List | dict :
        return self.rag_pipeline.install_llm()
    
    def uninstall_llm(self) -> any:
        return self.rag_pipeline.uninstall_llm()
    

    def create_chat(self, name, description = '', options = None)-> dict:
        return self.rag_pipeline.create_chat(name, description, options)

    def list_chats(self)-> List:
        return self.rag_pipeline.list_chats()

    def search_chat(self, identifier) -> dict:
        return self.rag_pipeline.search_chat(identifier)

    def remove_chat(self, identifier) -> bool:
        return self.rag_pipeline.remove_chat(identifier)

    def list_chat_options(self, identifier)-> dict:
        return self.rag_pipeline.list_chat_options(identifier)

    def set_chat_options(self, identifier, options) -> dict:
        return self.rag_pipeline.set_chat_options(identifier, options)



    def generate_response(self, question:str) -> any:
        return self.rag_pipeline.generate_response(question)
    






    #     self.document_RAG_repository = document_RAG_repository
    #     self.document_storage = document_storage


    # def create_rag_document(self, file: BinaryIO, document_type: str) ->  DocumentRAG:
    #     file_url = self.document_storage.store(file)

    #     document = DocumentRAG(
    #         id=None,
    #         document_type=document_type,
    #         link=file_url
    #     )
    


    