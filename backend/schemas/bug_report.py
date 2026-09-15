from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BugReportCreate(BaseModel):
    project_id: str
    title: str
    description: str
    expected_behavior: Optional[str] = None
    actual_behavior: Optional[str] = None

class BugReportResponse(BaseModel):
    id: str
    project_id: str
    title: str
    description: str
    expected_behavior: Optional[str] = None
    actual_behavior: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
