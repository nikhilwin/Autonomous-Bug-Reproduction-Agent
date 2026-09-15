from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.project import Project
from backend.schemas.project import ProjectCreate, ProjectResponse
from backend.services.repo_analyzer import RepoAnalyzer

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("/", response_model=ProjectResponse)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    analyzer = RepoAnalyzer(payload.local_path)
    meta = analyzer.analyze_metadata()

    project = Project(
        name=payload.name,
        local_path=payload.local_path,
        repo_url=payload.repo_url,
        framework_info=meta
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
