from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from core.config import settings

# Use SQLite as fallback if DATABASE_URL is not set or not a postgres URL
db_url = settings.DATABASE_URL
if not db_url or not db_url.startswith("postgresql"):
    db_url = "sqlite+aiosqlite:///./cpp_analyzer.db"
else:
    # Convert postgres:// to postgresql+asyncpg:// for async compatibility
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(db_url, echo=True)

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with SessionLocal() as session:
        yield session
