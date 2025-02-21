from typing import Optional
from datetime import datetime
from dataclasses import dataclass


@dataclass
class Document:
    id: Optional[int]
    application_id: int
    document_type: str
    link: str
    created_at: Optional[datetime] = None
