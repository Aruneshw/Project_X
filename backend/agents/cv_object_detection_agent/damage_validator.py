import cv2
import numpy as np

class DamageValidator:
    def __init__(self):
        """
        Layer 3: Damage Region Validation.
        Uses OpenCV edge detection and contour analysis to detect physical anomalies
        (cracks, dents, scratches) in the presented product.
        """
        pass

    def check_damage(self, frame):
        """
        A heuristic-based damage detection using edge density and contour variations.
        For enterprise production, this would use a specialized segmentation model.
        Here we use OpenCV structural analysis as a robust proxy.
        """
        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Canny edge detection (detects sharp structural changes like cracks/scratches)
        edges = cv2.Canny(blurred, 50, 150)
        
        # Calculate edge density (proxy for surface anomalies)
        edge_density = np.sum(edges) / (edges.shape[0] * edges.shape[1] * 255)
        
        # Thresholds: Too smooth = no damage, too noisy = bad video quality/fraud attempt
        # Ideal damage usually creates a spike in structural edges in a localized area.
        has_anomalies = edge_density > 0.015 and edge_density < 0.15
        
        return {
            "passed": bool(has_anomalies),
            "edge_density": round(float(edge_density), 4),
            "confidence": 0.8 if has_anomalies else 0.2
        }
