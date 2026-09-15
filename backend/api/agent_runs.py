from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.bug_report import BugReport
from backend.models.project import Project
from backend.models.execution_run import ExecutionRun
from backend.schemas.agent import AgentRunRequest, AgentRunResponse
from backend.services.agent_controller import AgentController

router = APIRouter(prefix="/api/agent", tags=["agent"])

async def execute_agent_job(run_id: str, bug_id: str, target_url: str, db: Session):
    bug = db.query(BugReport).filter(BugReport.id == bug_id).first()
    if not bug:
        return
    project = db.query(Project).filter(Project.id == bug.project_id).first()
    if not project:
        return

    controller = AgentController(
        repo_path=project.local_path,
        bug_title=bug.title,
        bug_description=bug.description,
        target_url=target_url
    )

    result = await controller.run()

    run_record = db.query(ExecutionRun).filter(ExecutionRun.id == run_id).first()
    if run_record:
        run_record.state = result.get("state", "COMPLETED")
        run_record.trajectory = result.get("trajectory")
        run_record.evidence = result.get("evidence")
        run_record.root_cause_analysis = result.get("root_cause_analysis")
        run_record.generated_test_code = result.get("generated_test_code")
        run_record.confidence_score = result.get("confidence_score")
        
        if result.get("state") == "REPRODUCED":
            bug.status = "REPRODUCED"

        db.commit()

@router.post("/run", response_model=AgentRunResponse)
async def trigger_agent_run(payload: AgentRunRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    bug = db.query(BugReport).filter(BugReport.id == payload.bug_report_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug report not found")

    run_record = ExecutionRun(
        bug_report_id=bug.id,
        state="RUNNING",
        trajectory=[]
    )
    db.add(run_record)
    db.commit()
    db.refresh(run_record)

    # Execute asynchronously or directly
    background_tasks.add_task(execute_agent_job, run_record.id, bug.id, payload.target_url, db)

    return run_record

@router.get("/runs/{run_id}", response_model=AgentRunResponse)
def get_run_status(run_id: str, db: Session = Depends(get_db)):
    run_record = db.query(ExecutionRun).filter(ExecutionRun.id == run_id).first()
    if not run_record:
        raise HTTPException(status_code=404, detail="Execution run not found")
    return run_record

@router.get("/runs/bug/{bug_id}", response_model=List[AgentRunResponse])
def get_runs_by_bug(bug_id: str, db: Session = Depends(get_db)):
    return db.query(ExecutionRun).filter(ExecutionRun.bug_report_id == bug_id).all()
