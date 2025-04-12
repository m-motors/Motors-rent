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
    doc_format : Optional[str] = None
    link: Optional[str] = None
    e_tag: Optional[str] = None
    status: DocumentRAGStatus = DocumentRAGStatus.ADD
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "doc_format ": self.doc_format ,
            "link": self.link,
            "e_tag": self.e_tag,
            "status": self.status.value,
            "created_at": self.created_at.isoformat(), 
        }
