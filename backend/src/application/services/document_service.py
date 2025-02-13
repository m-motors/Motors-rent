from typing import BinaryIO, List, Optional
from domain.models.document import Document
from application.ports.output.document_repository import DocumentRepository
from application.ports.output.file_storage import DocumentStorage
import uuid

class DocumentService:
    def __init__(
        self,
        document_repository: DocumentRepository,
        document_storage: DocumentStorage
    ):
        self.document_repository = document_repository
        self.document_storage = document_storage

    def upload_document(
        self,
        file: BinaryIO,
        application_id: int,
        document_type: str
    ) -> Document:
        filename = f"{uuid.uuid4()}-{file.filename}"
        
        file_url = self.document_storage.store(file, filename)
        
        document = Document(
            id=None,
            application_id=application_id,
            document_type=document_type,
            link=file_url
        )
        
        return self.document_repository.save(document)

    def get_document(self, document_id: int) -> Optional[Document]:
        return self.document_repository.find_by_id(document_id)

    def get_application_documents(self, application_id: int) -> List[Document]:
        return self.document_repository.find_by_application(application_id)

    def delete_document(self, document_id: int) -> bool:
        document = self.document_repository.find_by_id(document_id)
        if not document:
            return False

        filename = document.link.split('/')[-1]
        
        if self.document_storage.delete(filename):
            return self.document_repository.delete(document_id)
        return False