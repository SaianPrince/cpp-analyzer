import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(Text, nullable=False)
    status = Column(String, nullable=False)
    stdout = Column(Text)
    # Storing optimization results as JSON for flexibility
    # In Postgres, we could use JSONB
    optimizations = Column(JSON) 
    suggestions = Column(JSON)
    memory_kb = Column(Integer, default=0)
    ip_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "status": self.status,
            "stdout": self.stdout,
            "optimizations": self.optimizations,
            "suggestions": self.suggestions,
            "memory_kb": self.memory_kb,
            "created_at": self.created_at.isoformat()
        }
