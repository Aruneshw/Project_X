import logging
from .challenge_generator import ChallengeGenerator
from .motion_tracker import MotionTracker

logger = logging.getLogger(__name__)

class AntiFraudChallengeAgent:
    """
    Agent 4: Issues and verifies dynamic physical challenges to defeat fabrication.
    """
    def __init__(self):
        self.generator = ChallengeGenerator()
        self.tracker = MotionTracker()
        self.active_challenge = None
        self.success_frames = 0
        self.required_success_frames = 5 # Needs 5 frames of continuous correct motion

    def trigger_new_challenge(self) -> dict:
        """
        Starts a new 3D motion challenge.
        """
        self.active_challenge = self.generator.generate_motion_challenge()
        self.success_frames = 0
        self.tracker.prev_gray = None # Reset tracker
        logger.info(f"Triggered Anti-Fraud Challenge: {self.active_challenge['required_direction']}")
        return self.active_challenge

    def process_frame(self, frame) -> dict:
        """
        Called continuously while a challenge is active to verify movement.
        """
        if not self.active_challenge:
            return {"status": "no_active_challenge", "passed": False}

        dx, dy = self.tracker.calculate_optical_flow(frame)
        
        is_moving_correctly = self.tracker.verify_movement_direction(
            dx, dy, self.active_challenge["required_direction"]
        )

        if is_moving_correctly:
            self.success_frames += 1
        else:
            # Degrade progress if they stop moving or move the wrong way
            self.success_frames = max(0, self.success_frames - 1)

        passed = self.success_frames >= self.required_success_frames

        if passed:
            logger.info("Challenge PASSED: 3D physical motion verified.")
            self.active_challenge = None # Clear challenge

        return {
            "status": "passed" if passed else "verifying",
            "passed": passed,
            "progress": f"{min(100, int((self.success_frames / self.required_success_frames) * 100))}%",
            "current_vector": {"dx": round(dx, 2), "dy": round(dy, 2)}
        }
