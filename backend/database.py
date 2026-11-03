from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import Column, String, Integer, Float, Text, DateTime
from datetime import datetime

DATABASE_URL = "sqlite+aiosqlite:///./github_portfolio.db"

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class CachedUser(Base):
    __tablename__ = "cached_users"
    username = Column(String, primary_key=True)
    data = Column(Text)  # JSON string
    cached_at = Column(DateTime, default=datetime.utcnow)


class CachedRepo(Base):
    __tablename__ = "cached_repos"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, index=True)
    repo_name = Column(String)
    data = Column(Text)  # JSON string
    cached_at = Column(DateTime, default=datetime.utcnow)


class CachedContributions(Base):
    __tablename__ = "cached_contributions"
    username = Column(String, primary_key=True)
    data = Column(Text)  # JSON string
    cached_at = Column(DateTime, default=datetime.utcnow)


class UserSettings(Base):
    __tablename__ = "user_settings"
    username = Column(String, primary_key=True)
    theme = Column(String, default="dark")
    last_job_description = Column(Text, default="")
    last_match_score = Column(Float, default=0.0)
    pinned_repos = Column(Text, default="[]")  # JSON array


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

