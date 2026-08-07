"""
Enterprise CX Platform — Structured Logging
JSON-formatted logs for ELK / OpenTelemetry ingestion.
"""

from __future__ import annotations

import logging
import sys
from datetime import datetime, timezone

from backend.core.config import settings


class JSONFormatter(logging.Formatter):
    """Produces structured JSON log lines."""

    def format(self, record: logging.LogRecord) -> str:
        import json

        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        if record.exc_info and record.exc_info[1]:
            log_entry["exception"] = self.formatException(record.exc_info)
        # Attach extra fields (agent_name, case_id, etc.)
        for key in ("agent_name", "case_id", "trace_id", "span_id"):
            if hasattr(record, key):
                log_entry[key] = getattr(record, key)
        return json.dumps(log_entry)


def setup_logging() -> None:
    """Configure application-wide logging."""
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))

    handler = logging.StreamHandler(sys.stdout)

    if settings.LOG_FORMAT == "json":
        handler.setFormatter(JSONFormatter())
    else:
        handler.setFormatter(
            logging.Formatter("%(asctime)s | %(levelname)-8s | %(name)s | %(message)s")
        )

    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    # Quiet noisy libraries
    for lib in ("uvicorn.access", "httpcore", "httpx", "sqlalchemy.engine"):
        logging.getLogger(lib).setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Get a named logger for a module / agent."""
    return logging.getLogger(f"cx_platform.{name}")
