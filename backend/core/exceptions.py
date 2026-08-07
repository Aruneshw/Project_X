"""
Enterprise CX Platform — Domain Exceptions
"""

from __future__ import annotations


class CXPlatformError(Exception):
    """Base exception for the CX Platform."""

    def __init__(self, message: str = "An internal platform error occurred.", code: str = "CX_ERROR"):
        self.message = message
        self.code = code
        super().__init__(self.message)


# ── Evidence & Fraud ─────────────────────────────────────────

class InvalidEvidenceError(CXPlatformError):
    """Raised when evidence fails validation (e.g., gallery upload attempted on camera-only path)."""

    def __init__(self, message: str = "Invalid evidence submitted."):
        super().__init__(message=message, code="INVALID_EVIDENCE")


class GalleryBlockedError(CXPlatformError):
    """Raised when a gallery/file-picker upload is attempted on the camera-only pipeline."""

    def __init__(self):
        super().__init__(
            message="Gallery uploads are blocked. Only live camera capture is accepted for visual evidence.",
            code="GALLERY_BLOCKED",
        )


class FraudRejectedError(CXPlatformError):
    """Raised when evidence is flagged as fraudulent (score < 50)."""

    def __init__(self, case_id: str, score: float):
        super().__init__(
            message=f"Case {case_id} rejected as fraudulent (score: {score:.1f}).",
            code="FRAUD_REJECTED",
        )
        self.case_id = case_id
        self.score = score


class ChallengeFailedError(CXPlatformError):
    """Raised when the anti-fraud physical challenge is not passed."""

    def __init__(self, case_id: str, attempts: int):
        super().__init__(
            message=f"Anti-fraud challenge failed for case {case_id} after {attempts} attempt(s).",
            code="CHALLENGE_FAILED",
        )


class ReplayAttackDetectedError(CXPlatformError):
    """Raised when screen-replay or moire patterns are detected."""

    def __init__(self, case_id: str):
        super().__init__(
            message=f"Replay attack detected for case {case_id}.",
            code="REPLAY_DETECTED",
        )


# ── Scoring & Routing ───────────────────────────────────────

class RequiresHumanReviewError(CXPlatformError):
    """Raised when a case score falls in the 50–80 band, requiring human escalation."""

    def __init__(self, case_id: str, score: float):
        super().__init__(
            message=f"Case {case_id} requires human review (score: {score:.1f}).",
            code="REQUIRES_HUMAN_REVIEW",
        )
        self.case_id = case_id
        self.score = score


class HumanReviewBypassAttemptError(CXPlatformError):
    """Raised when an API call attempts to bypass the mandatory human review for 50–80 scores."""

    def __init__(self):
        super().__init__(
            message="Human review cannot be bypassed for cases in the 50–80 score band.",
            code="BYPASS_DENIED",
        )


# ── Policy ───────────────────────────────────────────────────

class PolicyConflictError(CXPlatformError):
    """Raised when two policies contain contradictory rules."""

    def __init__(self, policy_a: str, policy_b: str):
        super().__init__(
            message=f"Policy conflict detected between '{policy_a}' and '{policy_b}'.",
            code="POLICY_CONFLICT",
        )


# ── Agent ────────────────────────────────────────────────────

class AgentExecutionError(CXPlatformError):
    """Raised when an agent fails during execution."""

    def __init__(self, agent_name: str, detail: str = ""):
        super().__init__(
            message=f"Agent '{agent_name}' execution failed: {detail}",
            code="AGENT_EXECUTION_ERROR",
        )


class OrchestratorError(CXPlatformError):
    """Raised when the orchestrator encounters an unrecoverable error."""

    def __init__(self, detail: str = ""):
        super().__init__(
            message=f"Orchestrator error: {detail}",
            code="ORCHESTRATOR_ERROR",
        )


# ── Auth ─────────────────────────────────────────────────────

class AuthenticationError(CXPlatformError):
    """Invalid or expired credentials."""

    def __init__(self, message: str = "Authentication failed."):
        super().__init__(message=message, code="AUTH_FAILED")


class AuthorizationError(CXPlatformError):
    """Insufficient permissions."""

    def __init__(self, message: str = "Insufficient permissions."):
        super().__init__(message=message, code="FORBIDDEN")


# ── General ──────────────────────────────────────────────────

class ResourceNotFoundError(CXPlatformError):
    """Requested resource does not exist."""

    def __init__(self, resource: str, identifier: str):
        super().__init__(
            message=f"{resource} '{identifier}' not found.",
            code="NOT_FOUND",
        )


class RateLimitExceededError(CXPlatformError):
    """Too many requests."""

    def __init__(self):
        super().__init__(
            message="Rate limit exceeded. Please try again later.",
            code="RATE_LIMITED",
        )
