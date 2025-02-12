from typing import List, Optional
from domain.models.document import Document
from application.ports.output.document_repository import DocumentRepository
from flask_sqlalchemy import SQLAlchemy

class MySQLDocumentRepository(DocumentRepository):
    def __init__(self, db: SQLAlchemy):
        self.db = db

    def save(self, document: Document) -> Document:
        query = """
            INSERT INTO documents (application_id, document_type, link)
            VALUES (%s, %s, %s)
        """
        params = {
            "application_id": document.application_id,
            "document_type": document.document_type,
            "link": document.link
        }
        result = self.db.session.execute(query, params)
        self.db.session.commit()
        document.id = result.lastrowid
        return document

    def find_by_id(self, document_id: int) -> Optional[Document]:
        query = "SELECT * FROM documents WHERE id = %s"
        result = self.db.session.execute(query, {"id": document_id}).fetchone()
        return self._map_to_document(result) if result else None

    def find_by_application(self, application_id: int) -> List[Document]:
        query = "SELECT * FROM documents WHERE application_id = %s"
        results = self.db.session.execute(
            query, {"application_id": application_id}
        ).fetchall()
        return [self._map_to_document(row) for row in results]

    def delete(self, document_id: int) -> bool:
        query = "DELETE FROM documents WHERE id = %s"
        result = self.db.session.execute(query, {"id": document_id})
        self.db.session.commit()
        return result.rowcount > 0

    def _map_to_document(self, row) -> Document:
        return Document(
            id=row.id,
            application_id=row.application_id,
            document_type=row.document_type,
            link=row.link,
            created_at=row.created_at
        )