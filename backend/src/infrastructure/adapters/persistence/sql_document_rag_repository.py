from typing import List, Optional
from flask_sqlalchemy import SQLAlchemy

from src.domain.models.document_rag import DocumentRAG
from src.application.ports.output.document_rag_repository import DocumentRAGRepository


class SQLDocumentRAGRepository(DocumentRAGRepository):
    def __init__(self, db: SQLAlchemy):
        self.db = db

    def find_by_id(self, document_id: int) -> Optional[DocumentRAG]:
        query = "SELECT * FROM documents WHERE id = %s"
        result = self.db.session.execute(query, {"id": document_id}).fetchone()
        return self._map_to_document(result) if result else None


    def _map_to_document(self, row) -> DocumentRAG:
        return DocumentRAG(
            id=row.id,
            application_id=row.application_id,
            document_type=row.document_type,
            link=row.link,
            created_at=row.created_at
        )

