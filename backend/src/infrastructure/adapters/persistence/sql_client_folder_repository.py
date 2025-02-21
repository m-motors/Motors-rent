from sqlalchemy import text
from datetime import datetime
from typing import List, Optional
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError

from src.domain.models.client_folder import ClientFolder, ClientFolderStatus, ClientFolderType
from src.application.ports.output.client_folder_repository import ClientFolderRepository

class SQLClientFolderRepository(ClientFolderRepository):
    def __init__(self, db: SQLAlchemy):
        self.db = db

    def save(self, clientFolder: ClientFolder) -> ClientFolder:
        try:
            query = text("""
                INSERT INTO client_folders (user_id, vehicule_id, type, status, created_at)
                VALUES (:user_id, :vehicule_id, :type, :status, :created_at)
                RETURNING id
            """)
            params = self._map_to_params(clientFolder)
            result = self.db.session.execute(query, params)
            clientFolder.id = result.fetchone()[0]

            if clientFolder.option_ids : 
                self._add_options(clientFolder.id, clientFolder.option_ids)
            
            if clientFolder.document_ids : 
                self._add_documents(clientFolder.id, clientFolder.document_ids)

            self.db.session.commit() 
            return clientFolder
        except SQLAlchemyError as e:
            self.db.session.rollback()
            raise e 

    def find_all(self) -> List[ClientFolder]:
        query = text("""
            SELECT 
                cf.id,
                cf.user_id,
                cf.vehicule_id,
                cf.type,
                cf.status,
                cf.created_at,
                COALESCE(json_agg(DISTINCT cfo.option_id) FILTER (WHERE cfo.option_id IS NOT NULL), '[]') AS option_ids,
                COALESCE(json_agg(DISTINCT cfd.document_id) FILTER (WHERE cfd.document_id IS NOT NULL), '[]') AS document_ids
            FROM client_folders cf
            LEFT JOIN client_folder_options cfo ON cf.id = cfo.client_folder_id
            LEFT JOIN client_folder_documents cfd ON cf.id = cfd.client_folder_id
            GROUP BY cf.id
        """)
        results = self.db.session.execute(query).fetchall()
        return [self._map_to_client_folder(row._asdict()) for row in results]
    
    def find_by_id(self, id: int) -> Optional[ClientFolder]:
        query = text("""
            SELECT 
                cf.id, 
                cf.user_id, 
                cf.vehicule_id, 
                cf.type, 
                cf.status, 
                cf.created_at,
                COALESCE(json_agg(DISTINCT cfd.document_id) FILTER (WHERE cfd.document_id IS NOT NULL), '[]') AS document_ids,
                COALESCE(json_agg(DISTINCT cfo.option_id) FILTER (WHERE cfo.option_id IS NOT NULL), '[]') AS option_ids
            FROM client_folders cf
            LEFT JOIN client_folder_documents cfd ON cf.id = cfd.client_folder_id
            LEFT JOIN client_folder_options cfo ON cf.id = cfo.client_folder_id
            WHERE cf.id = :id
            GROUP BY cf.id;
        """)
        result = self.db.session.execute(query, {"id": id}).fetchone()
        return self._map_to_client_folder(result._asdict()) if result else None
    
    def get_list_client_folder_by_client_id(self, client_id: int) -> List[ClientFolder]: 
        query = text("""
            SELECT 
                cf.id,
                cf.user_id,
                cf.vehicule_id,
                cf.type,
                cf.status,
                cf.created_at,
                COALESCE(json_agg(DISTINCT cfo.option_id) FILTER (WHERE cfo.option_id IS NOT NULL), '[]') AS option_ids,
                COALESCE(json_agg(DISTINCT cfd.document_id) FILTER (WHERE cfd.document_id IS NOT NULL), '[]') AS document_ids
            FROM client_folders cf
            LEFT JOIN client_folder_options cfo ON cf.id = cfo.client_folder_id
            LEFT JOIN client_folder_documents cfd ON cf.id = cfd.client_folder_id
            WHERE cf.user_id = :client_id
            GROUP BY cf.id
        """)
        results = self.db.session.execute(query, {"client_id": client_id}).fetchall()
        return [self._map_to_client_folder(row._asdict()) for row in results]

    def update(self, clientFolder: ClientFolder) -> ClientFolder:
        try:
            query = text("""
                UPDATE client_folders 
                SET vehicule_id = :vehicule_id, status = :status
                WHERE id = :client_folder_id
            """)
            
            params = {
                "client_folder_id": clientFolder.id,
                "vehicule_id": clientFolder.vehicule_id,
                "status": clientFolder.status.value
            }

            self.db.session.execute(query, params)

            if clientFolder.option_ids is not None:
                self._update_options(clientFolder.id, clientFolder.option_ids)

            if clientFolder.document_ids is not None:
                self._update_documents(clientFolder.id, clientFolder.document_ids)

            self.db.session.commit()
            return clientFolder

        except SQLAlchemyError as e:
            self.db.session.rollback()
            raise e

    def delete(self, client_folder_id: int) -> bool:
        try:
            self._remove_options_by_folder_id(client_folder_id)
            self._remove_documents_by_folder_id(client_folder_id)
            
            query = text("""
                DELETE FROM client_folders WHERE id = :client_folder_id RETURNING id 
            """)
        
            result = self.db.session.execute(query, {"client_folder_id": client_folder_id}).fetchone()

            self.db.session.commit()
            return result is not None
        except SQLAlchemyError as e:
            self.db.session.rollback()
            raise e
        
    def _map_to_client_folder(self, row) -> ClientFolder:
        return ClientFolder(
            id=row["id"],
            user_id=row["user_id"],
            vehicule_id=row["vehicule_id"],
            type=ClientFolderType(row["type"]),
            status=ClientFolderStatus(row["status"]),
            created_at=row["created_at"],
            option_ids=row.get("option_ids", []),
            document_ids=row.get("document_ids", []), 
        )

    def _map_to_params(self, clientFolder: ClientFolder) -> dict:
        return {
            "id": clientFolder.id,
            "user_id": clientFolder.user_id,
            "vehicule_id": clientFolder.vehicule_id,
            "type": clientFolder.type.value,
            "status": clientFolder.status.value,
            "created_at": clientFolder.created_at,
            "option_ids": clientFolder.option_ids if clientFolder.option_ids else [], 
            "document_ids": clientFolder.document_ids if clientFolder.document_ids else [], 
        }
        
    
    def _remove_options_by_folder_id(self, client_folder_id: int):
        query = text("""
            DELETE FROM client_folder_options WHERE client_folder_id = :client_folder_id
        """)

        self.db.session.execute(query, {"client_folder_id": client_folder_id})

    def _remove_documents_by_folder_id(self, client_folder_id: int):
        query = text("""
            DELETE FROM client_folder_documents WHERE client_folder_id = :client_folder_id
        """)
        self.db.session.execute(query, {"client_folder_id": client_folder_id})

    
    def _add_options(self, client_folder_id: int, option_ids: List[int]):
        query = text("""
            INSERT INTO client_folder_options (client_folder_id, option_id)
            VALUES (:client_folder_id, :option_id)
        """)
        for option_id in option_ids:
            self.db.session.execute(query, {"client_folder_id": client_folder_id, "option_id": option_id})

    def _add_documents(self, client_folder_id: int, document_ids: List[int]):
        query = text("""
            INSERT INTO client_folder_documents (client_folder_id, document_id)
            VALUES (:client_folder_id, :document_id)
        """)
        for document_id in document_ids:
            self.db.session.execute(query, {"client_folder_id": client_folder_id, "document_id": document_id})


    def _remove_options_by_option_ids(self, client_folder_id: int, option_ids: List[int]):        
        query = text("""
            DELETE FROM client_folder_options 
            WHERE client_folder_id = :client_folder_id 
            AND option_id = ANY(:option_ids)
        """)
        self.db.session.execute(query, {"client_folder_id": client_folder_id, "option_ids": option_ids})


    def _remove_documents_by_document_ids(self, client_folder_id: int, document_ids: List[int]):
        query = text("""
            DELETE FROM client_folder_documents 
            WHERE client_folder_id = :client_folder_id 
            AND document_id = ANY(:document_ids)
        """)
        self.db.session.execute(query, {"client_folder_id": client_folder_id, "document_ids": document_ids})

    def _update_options(self, client_folder_id: int, option_ids: list[int]):
        query = text("""
            DELETE FROM client_folder_options 
            WHERE client_folder_id = :client_folder_id
        """)
        self.db.session.execute(query, {"client_folder_id": client_folder_id})

        if option_ids:
            insert_query = text("""
                INSERT INTO client_folder_options (client_folder_id, option_id) 
                VALUES (:client_folder_id, :option_id)
            """)
            self.db.session.execute(
                insert_query,
                [{"client_folder_id": client_folder_id, "option_id": option_id} for option_id in option_ids]
            )

    def _update_documents(self, client_folder_id: int, document_ids: list[int]):
        query = text("""
            DELETE FROM client_folder_documents 
            WHERE client_folder_id = :client_folder_id
        """)
        self.db.session.execute(query, {"client_folder_id": client_folder_id})

        if document_ids:
            insert_query = text("""
                INSERT INTO client_folder_documents (client_folder_id, document_id) 
                VALUES (:client_folder_id, :document_id)
            """)
            self.db.session.execute(
                insert_query,
                [{"client_folder_id": client_folder_id, "document_id": document_id} for document_id in document_ids]
            )