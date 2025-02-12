from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Document:
    id: Optional[int]
    application_id: int
    document_type: str
    link: str
    created_at: Optional[datetime] = None