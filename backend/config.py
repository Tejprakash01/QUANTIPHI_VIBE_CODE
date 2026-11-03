from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    GITHUB_TOKEN: Optional[str] = None
    APP_ENV: str = "development"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

