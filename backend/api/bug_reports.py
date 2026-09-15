from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.bug_report import BugReport
from backend.schemas.bug_report import BugReportCreate, BugReportResponse

router = APIRouter(prefix="/api/bug-reports", tags=["bug_reports"])

@router.post("/", response_model=BugReportResponse)
def create_bug_report(payload: BugReportCreate, db: Session = Depends(get_db)):
    bug = BugReport(
        project_id=payload.project_id,
        title=payload.title,
        description=payload.description,
        expected_behavior=payload.expected_behavior,
        actual_behavior=payload.actual_behavior
    )
    db.add(bug)
    db.commit()
    db.refresh(bug)
    return bug

@router.get("/", response_model=List[BugReportResponse])
def list_bug_reports(project_id: str = None, db: Session = Depends(get_db)):
    query = db.query(BugReport)
    if project_id:
        query = query.filter(BugReport.project_id == project_id)
    return query.all()

@router.get("/{bug_id}", response_model=BugReportResponse)
def get_bug_report(bug_id: str, db: Session = Depends(get_db)):
    bug = db.query(BugReport).filter(BugReport.id == bug_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug report not found")
    return bug
