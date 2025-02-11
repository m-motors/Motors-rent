from typing import Optional

from pydantic.v1 import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Motors API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "motors"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    AWS_ACCESS_KEY_ID: str = "access-key"
    AWS_SECRET_ACCESS_KEY: str = "secret-key"
    AWS_REGION: str = "eu-west-3"
    S3_BUCKET: str = "motors-documents"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
