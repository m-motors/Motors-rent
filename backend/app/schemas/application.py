from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from backend.app.models.document import Document


class ApplicationBase(BaseModel):
    vehicle_id: int
    type: str


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    status: str


class Application(ApplicationBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    documents: List[Document] = []

    class Config:
        from_attributes = True
