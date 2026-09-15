from sqlalchemy import Column, String, DateTime, JSON
from datetime import datetime
import uuid
from backend.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    repo_url = Column(String(512), nullable=True)
    local_path = Column(String(512), nullable=False)
    framework_info = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
