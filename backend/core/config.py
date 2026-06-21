import os
import json
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "cpp-analyzer")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_PREFIX: str = os.getenv("API_PREFIX", "/api")
    ENGINE_URL: str = os.getenv("ENGINE_URL", "http://localhost:8080")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "cpp-analyzer-secret-key-change-in-production")
    
    # Parse CORS_ORIGINS as a list
    _cors_origins_str = os.getenv("CORS_ORIGINS", "[]")
    try:
        CORS_ORIGINS: list = json.loads(_cors_origins_str)
    except json.JSONDecodeError:
        CORS_ORIGINS: list = ["*"]

settings = Settings()
