from enum import Enum
from typing import List, Optional
from datetime import datetime, timezone
from dataclasses import dataclass, field

class DocumentRAGStatus(Enum):
    ADD = "add"
    PROCESS = "process"
    REMOVE = "remove"


@dataclass
class DocumentRAG:
    id: Optional[int]
    name: Optional[str] = None
    format: Optional[str] = None
    link: Optional[str] = None
    status: DocumentRAGStatus = DocumentRAGStatus.ADD
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "format": self.format,
            "link": self.link,
            "status": self.status.value,
            "created_at": self.created_at.isoformat(), 
        }
