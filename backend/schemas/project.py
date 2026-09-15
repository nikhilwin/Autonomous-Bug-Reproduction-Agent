from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str
    local_path: str
    repo_url: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    repo_url: Optional[str] = None
    local_path: str
    framework_info: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True
