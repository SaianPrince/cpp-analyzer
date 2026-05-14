from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any

class AnalyzeRequest(BaseModel):
    code: str = Field(..., description="C++ source code to analyze")

    @validator('code')
    def validate_code_length(cls, v):
        if not v or not v.strip():
            raise ValueError("Code cannot be empty")
        if len(v.splitlines()) > 500:
            raise ValueError("Code exceeds maximum allowed length of 500 lines")
        return v

class Suggestion(BaseModel):
    title: str
    detail: str
    severity: str

class OptimizationResult(BaseModel):
    level: str
    compile_time_ms: int = 0
    run_time_ms: int = 0
    memory_kb: int = 0
    status: str
    error_message: Optional[str] = None

class EngineResponse(BaseModel):
    status: str
    message: Optional[str] = None
    stdout: str = ""
    optimizations: List[OptimizationResult] = []

class AnalyzeResponse(BaseModel):
    status: str
    engine_result: EngineResponse
    suggestions: List[Suggestion]
    id: str  # For future DB record ID
