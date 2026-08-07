"""
Enterprise CX Platform — Central Configuration
All settings are env-driven via pydantic-settings.
Scoring thresholds are centrally adjustable (Learning Agent self-adjusts them over time).
"""

from __future__ import annotations

import os
from enum import Enum
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings


class Environment(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class Settings(BaseSettings):
    """Platform-wide configuration loaded from environment variables."""

    # ── App ──────────────────────────────────────────────
    APP_NAME: str = "Enterprise CX Platform"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    API_PREFIX: str = "/api/v1"
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # ── Security / Auth ──────────────────────────────────
    SECRET_KEY: str = Field(default="change-me-in-production-PLEASE")
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── Database ─────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://cx_user:cx_pass@localhost:5432/cx_platform"
    DATABASE_ECHO: bool = False

    # ── Redis ────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL: int = 300  # seconds

    # ── Elasticsearch ────────────────────────────────────
    ELASTICSEARCH_URL: str = "http://localhost:9200"

    # ── Vector DB (for RAG / Memory Agent) ───────────────
    VECTOR_DB_URL: str = "http://localhost:19530"
    VECTOR_DB_COLLECTION: str = "cx_platform_knowledge"

    # ── Object Storage (MinIO / S3) ──────────────────────
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_BUCKET_EVIDENCE: str = "evidence"

    # ── LLM / AI ─────────────────────────────────────────
    LLM_PROVIDER: str = "openai"  # openai | local
    OPENAI_API_KEY: Optional[str] = None
    LLM_MODEL: str = "gpt-4o"
    LLM_TEMPERATURE: float = 0.1
    LLM_MAX_TOKENS: int = 4096

    # ── Celery ───────────────────────────────────────────
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # ── Scoring Thresholds (centrally adjustable) ────────
    SCORE_AUTO_RESOLVE_THRESHOLD: float = 80.0
    SCORE_HUMAN_REVIEW_THRESHOLD: float = 50.0

    # ── CV Pipeline ──────────────────────────────────────
    CV_CONFIDENCE_THRESHOLD: float = 0.7
    CHALLENGE_CODE_LENGTH: int = 4
    MAX_CHALLENGE_ATTEMPTS: int = 3

    # ── Rate Limiting ────────────────────────────────────
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW_SECONDS: int = 60

    # ── Logging ──────────────────────────────────────────
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


# Singleton
settings = Settings()
