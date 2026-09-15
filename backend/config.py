import os

class Settings:
    PROJECT_NAME: str = "BugPilot Engine"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agent_database.db")
    MAX_ATTEMPTS: int = 5

settings = Settings()
