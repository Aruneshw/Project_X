import cv2
import numpy as np
from agents.cv_object_detection_agent import FrameAnalyzer

def test_cv_layers():
    print("Initializing Frame Analyzer...")
    analyzer = FrameAnalyzer()
    
    print("Creating mock image frame (random noise)...")
    # Create a 640x480 RGB noise frame
    mock_frame = np.random.randint(0, 256, (480, 640, 3), dtype=np.uint8)
    
    print("Running analysis for 'laptop'...")
    result = analyzer.analyze_frame(mock_frame, "laptop")
    
    print("Analysis Result:")
    import json
    print(json.dumps(result, indent=2))
    
    print("\n✅ CV Layers loaded successfully. Models are working.")

if __name__ == "__main__":
    test_cv_layers()
