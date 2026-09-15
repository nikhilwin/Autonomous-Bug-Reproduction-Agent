from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.api import projects, bug_reports, agent_runs

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BugPilot Engine API",
    version="1.0.0",
    description="Backend API and Autonomous Bug Reproduction Agent Controller for reproducing bugs, collecting evidence, and generating test specs."
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(projects.router)
app.include_router(bug_reports.router)
app.include_router(agent_runs.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "BugPilot Backend Engine",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
