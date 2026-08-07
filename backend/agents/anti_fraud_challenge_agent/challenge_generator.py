import random

class ChallengeGenerator:
    """
    Generates dynamic physical challenges to defeat screen-replay and AI video attacks.
    """
    def __init__(self):
        self.directions = ["left", "right", "up", "down"]

    def generate_motion_challenge(self) -> dict:
        """
        Generates a random 3D rotation/tilt challenge.
        """
        direction = random.choice(self.directions)
        
        prompts = {
            "left": "Please tilt the product to show its LEFT side.",
            "right": "Please tilt the product to show its RIGHT side.",
            "up": "Please tilt the product UP to show the bottom edge.",
            "down": "Please tilt the product DOWN to show the top edge."
        }
        
        return {
            "challenge_type": "3d_motion",
            "required_direction": direction,
            "prompt": prompts[direction],
            "timeout_seconds": 10
        }
