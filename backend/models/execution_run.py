from sqlalchemy import Column, String, Text, Float, DateTime, JSON, ForeignKey
from datetime import datetime
import uuid
from backend.database import Base

class ExecutionRun(Base):
    __tablename__ = "execution_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    bug_report_id = Column(String(36), ForeignKey("bug_reports.id", ondelete="CASCADE"), nullable=False)
    state = Column(String(50), nullable=False) # INITIALIZING, ANALYZING, EXECUTING, REPRODUCED, FAILED
    trajectory = Column(JSON, nullable=True) # Agent steps, tools called
    evidence = Column(JSON, nullable=True)   # Console logs, network, screenshots
    root_cause_analysis = Column(JSON, nullable=True) # File, line, error_type, explanation
    generated_test_code = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
