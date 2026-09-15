from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from datetime import datetime
import uuid
from backend.database import Base

class BugReport(Base):
    __tablename__ = "bug_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    expected_behavior = Column(Text, nullable=True)
    actual_behavior = Column(Text, nullable=True)
    status = Column(String(50), default="OPEN") # OPEN, REPRODUCED, UNREPRODUCIBLE, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow)
