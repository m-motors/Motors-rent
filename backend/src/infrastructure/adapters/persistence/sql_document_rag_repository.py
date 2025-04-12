from typing import List, Optional
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from flask_sqlalchemy import SQLAlchemy

from src.domain.models.document_rag import DocumentRAG, DocumentRAGStatus
from src.application.ports.output.document_rag_repository import DocumentRAGRepository

class SQLDocumentRAGRepository(DocumentRAGRepository):
    def __init__(self, db: SQLAlchemy):
        self.db = db

    def save(self, document_rag: DocumentRAG) -> DocumentRAG:
        try:
            query = text("""
                INSERT INTO documents_rag (name, format, link, e_tag, status, created_at)
                VALUES (:name, :format, :link, :e_tag, :status, :created_at)
                RETURNING id
            """)
            params = self._map_to_params(document_rag)

            result = self.db.session.execute(query, params)
            self.db.session.commit()
            document_rag.id = result.fetchone()[0]
            return document_rag

        except SQLAlchemyError as e:
            self.db.session.rollback()
            raise RuntimeError(f"Database error: {str(e)}")

    def find_by_id(self, document_rag_id: int) -> Optional[DocumentRAG]:
        query = text("SELECT * FROM documents_rag WHERE id = :id")
        result = self.db.session.execute(query, {"id": document_rag_id}).fetchone()
        return self._map_to_document_rag(result._asdict()) if result else None
    
    def find_all(self) -> List[DocumentRAG]:
        query = text("SELECT * FROM documents_rag")
        results = self.db.session.execute(query).fetchall()
        return [self._map_to_document_rag(row._asdict()) for row in results]
    
    def update(self, document_rag: DocumentRAG) -> DocumentRAG:
        try:
            query = text("""
                UPDATE documents_rag
                SET name = :name,
                    format = :format,
                    link = :link,
                    e_tag = :e_tag,
                    status = :status,
                    created_at = :created_at
                WHERE id = :id
                RETURNING *
            """)
            params = self._map_to_params(document_rag)
            
            result = self.db.session.execute(query, params)
            self.db.session.commit()
            result = result.fetchone()
            return self._map_to_document_rag(result._asdict()) if result else None
        except SQLAlchemyError as e:
            self.db.session.rollback()
            raise RuntimeError(f"Database error: {str(e)}")

    def delete(self, document_rag_id: int) -> bool:
        try:
            query = text("DELETE FROM documents_rag WHERE id = :id")
            result = self.db.session.execute(query, {"id": document_rag_id})
            self.db.session.commit()
            return result.rowcount > 0
        except SQLAlchemyError as e:
            self.db.session.rollback()
            raise RuntimeError(f"Database error: {str(e)}")
    
    def _map_to_document_rag(self, row) -> DocumentRAG:
        return DocumentRAG(
            id=row["id"],
            name=row["name"],
            doc_format=row["format"],
            link=row["link"],
            e_tag=row["e_tag"],
            status=DocumentRAGStatus(row["status"]),
            created_at=row["created_at"]
        )

    def _map_to_params(self, document_rag: DocumentRAG) -> dict:
        return {
            "id": document_rag.id,
            "name": document_rag.name,
            "format": document_rag.doc_format,
            "link": document_rag.link,
            "e_tag": document_rag.e_tag,
            "status": document_rag.status.value,
            "created_at": document_rag.created_at
        }