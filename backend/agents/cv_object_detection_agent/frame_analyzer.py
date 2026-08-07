import cv2
import logging
from typing import Dict, Any

from .hand_detector import HandDetector
from .product_classifier import ProductClassifier
from .damage_validator import DamageValidator

logger = logging.getLogger(__name__)

class FrameAnalyzer:
    def __init__(self):
        """
        Orchestrator for the 3-Layer CV Video Intelligence Pipeline.
        Evaluates each frame coming from the WebRTC stream to ensure it is not 
        an AI-generated fake or a pre-recorded video.
        """
        logger.info("Initializing CV 3-Layer Intelligence Pipeline...")
        self.hand_detector = HandDetector()
        self.product_classifier = ProductClassifier()
        self.damage_validator = DamageValidator()
        
    def analyze_frame(self, frame, expected_product_type: str) -> Dict[str, Any]:
        """
        Runs the 3 layers of verification on a single frame.
        """
        if frame is None:
            return {"error": "Invalid frame provided", "passed": False}

        # --- Layer 1: Hand & Object Presence ---
        layer1_result = self.hand_detector.detect_hands(frame)
        
        # --- Layer 2: Product Identity ---
        layer2_result = self.product_classifier.verify_product(frame, expected_product_type)
        
        # --- Layer 3: Damage Region Validation ---
        layer3_result = self.damage_validator.check_damage(frame)

        # Calculate final frame confidence
        # Weighting: 40% hands (prevents most fakes), 40% product match, 20% damage visibility
        frame_confidence = (
            (layer1_result['confidence'] * 0.4) +
            (layer2_result['confidence'] * 0.4) +
            (layer3_result['confidence'] * 0.2)
        )

        # Flag suspicion if hand is missing but product is detected (highly unnatural for a live claim)
        suspicion_flag = False
        if layer2_result['passed'] and not layer1_result['passed']:
            suspicion_flag = True

        return {
            "passed": layer1_result['passed'] and layer2_result['passed'],
            "confidence_score": round(frame_confidence * 100, 2),
            "suspicion_flag": suspicion_flag,
            "layers": {
                "layer_1_hands": layer1_result,
                "layer_2_product": layer2_result,
                "layer_3_damage": layer3_result
            }
        }
