from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from backend.app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    file_path = Column(String)
    document_type = Column(String)
    uploaded_at = Column(DateTime)

    application = relationship("Application", back_populates="documents")
