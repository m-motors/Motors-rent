from enum import Enum
from typing import List, Optional
from datetime import datetime, timezone
from dataclasses import dataclass, field

class ClientFolderStatus(Enum):
    CREATED = "created"
    IN_VALIDATION = "in_validation"
    VALIDATED = "validated"
    REJECTED = "rejected"
    CANCELED = "canceled"
    WAINTING_FOR_CLIENT = "waiting_for_client"

class ClientFolderType(Enum):
    BUY = "Buy"
    RENTAL = "Rental"


@dataclass
class ClientFolder:
    id: Optional[int]
    user_id: int
    vehicule_id: Optional[int]
    type: ClientFolderType
    status: ClientFolderStatus
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    document_ids: Optional[List] = None,
    option_ids: Optional[List] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_id": self.user_id,
            "vehicule_id": self.vehicule_id,
            "type": self.type.value,
            "created_at": self.created_at.isoformat(), 
            "status": self.status.value,
            "option_ids": self.option_ids if self.option_ids else [],
            "document_ids": self.document_ids if self.document_ids else [],
        }
