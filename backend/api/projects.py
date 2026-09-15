import os
import subprocess
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.project import Project
from backend.schemas.project import ProjectCreate, ProjectResponse
from backend.services.repo_analyzer import RepoAnalyzer

router = APIRouter(prefix="/api/projects", tags=["projects"])

def clone_if_github_url(path_or_url: str) -> str:
    """If path_or_url is a GitHub URL, clones it to backend/cloned_repos."""
    if path_or_url.startswith("http://") or path_or_url.startswith("https://"):
        repo_name = path_or_url.rstrip("/").split("/")[-1].replace(".git", "")
        target_dir = os.path.join("backend", "cloned_repos", repo_name)
        
        if not os.path.exists(target_dir):
            os.makedirs(os.path.dirname(target_dir), exist_ok=True)
            try:
                subprocess.run(["git", "clone", path_or_url, target_dir], check=True, timeout=60)
            except Exception as e:
                print(f"Failed to clone repository: {str(e)}")
                return path_or_url

        return target_dir
    return path_or_url

@router.post("/", response_model=ProjectResponse)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    effective_path = clone_if_github_url(payload.local_path)
    if payload.repo_url:
        effective_path = clone_if_github_url(payload.repo_url)

    analyzer = RepoAnalyzer(effective_path)
    meta = analyzer.analyze_metadata()

    project = Project(
        name=payload.name,
        local_path=effective_path,
        repo_url=payload.repo_url or payload.local_path,
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
