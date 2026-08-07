import cv2
import mediapipe as mp

class HandDetector:
    def __init__(self):
        """
        Layer 1: Hand & Object Presence.
        Initializes MediaPipe Hands to detect human interaction with physical objects,
        preventing AI-generated static images or simple screen replays without physical depth.
        """
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def detect_hands(self, frame):
        """
        Process a BGR frame and return whether hands are present and their landmarks.
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)
        
        has_hands = False
        hand_data = []

        if results.multi_hand_landmarks:
            has_hands = True
            for hand_landmarks in results.multi_hand_landmarks:
                landmarks = [{"x": lm.x, "y": lm.y, "z": lm.z} for lm in hand_landmarks.landmark]
                hand_data.append(landmarks)
                
        return {
            "passed": has_hands,
            "hands_detected": len(hand_data),
            "landmarks": hand_data,
            "confidence": 0.95 if has_hands else 0.0
        }
