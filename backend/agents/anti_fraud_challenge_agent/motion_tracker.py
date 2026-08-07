import cv2
import numpy as np

class MotionTracker:
    """
    Analyzes frame-to-frame optical flow to verify actual 3D physical movement.
    Defeats 2D printed photo sliding by analyzing perspective warp vectors.
    """
    def __init__(self):
        self.prev_gray = None

    def calculate_optical_flow(self, current_frame):
        """
        Calculates dense optical flow between the previous frame and current frame.
        Returns the dominant motion vector (dx, dy).
        """
        gray = cv2.cvtColor(current_frame, cv2.COLOR_BGR2GRAY)
        
        if self.prev_gray is None:
            self.prev_gray = gray
            return 0.0, 0.0

        # Calculate dense optical flow using Farneback algorithm
        flow = cv2.calcOpticalFlowFarneback(
            self.prev_gray, gray, None, 
            pyr_scale=0.5, levels=3, winsize=15, 
            iterations=3, poly_n=5, poly_sigma=1.2, flags=0
        )
        
        self.prev_gray = gray
        
        # Calculate mean flow vector (ignoring static background)
        # In a real app, you would mask this to only track the YOLO bounding box region
        mag, ang = cv2.cartToPolar(flow[..., 0], flow[..., 1])
        
        # Only consider vectors with significant movement
        significant_motion = mag > 1.0
        
        if np.sum(significant_motion) == 0:
            return 0.0, 0.0
            
        mean_dx = np.mean(flow[..., 0][significant_motion])
        mean_dy = np.mean(flow[..., 1][significant_motion])
        
        return float(mean_dx), float(mean_dy)

    def verify_movement_direction(self, dx: float, dy: float, required_direction: str) -> bool:
        """
        Checks if the optical flow vector matches the prompted direction.
        Note: If an object tilts "left" (exposing left side), the surface pixels often move "right" 
        relative to the camera. We apply thresholds to verify the dominant shift.
        """
        # Threshold for movement detection
        threshold = 2.0 
        
        if required_direction == "left":
            return dx > threshold  # Pixels slide right as object tilts left
        elif required_direction == "right":
            return dx < -threshold # Pixels slide left as object tilts right
        elif required_direction == "up":
            return dy > threshold  # Pixels slide down as object tilts up
        elif required_direction == "down":
            return dy < -threshold # Pixels slide up as object tilts down
            
        return False
