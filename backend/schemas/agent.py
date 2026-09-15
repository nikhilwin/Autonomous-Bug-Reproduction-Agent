from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class AgentRunRequest(BaseModel):
    bug_report_id: str
    target_url: Optional[str] = "http://localhost:3000"
    max_steps: Optional[int] = 10

class AgentRunResponse(BaseModel):
    id: str
    bug_report_id: str
    state: str
    trajectory: Optional[List[Dict[str, Any]]] = None
    evidence: Optional[Dict[str, Any]] = None
    root_cause_analysis: Optional[Dict[str, Any]] = None
    generated_test_code: Optional[str] = None
    confidence_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
