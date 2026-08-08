import os
import cv2
import numpy as np
import base64

from .detector import ObjectDetector

class CVPipeline:
    """
    Adapter bridging the YOLO ObjectDetector to the Enterprise CX Pipeline.
    """
    def __init__(self):
        # Disable GUI/HUD settings for backend server mode
        import backend.pipelines.cv_pipeline.config as config
        config.SHOW_BOXES = False
        config.SHOW_LABELS = False
        config.SHOW_CONF = False
        config.SHOW_FPS = False
        config.SHOW_HUD = False
        
        self.detector = ObjectDetector(device="cpu") # Force CPU to avoid CUDA init hangs in simple tests
        
    def process_image(self, b64_img: str) -> dict:
        """
        Takes a base64 encoded image, runs YOLO detection, and calculates a fraud score.
        """
        if not b64_img:
            return {"fraud_score": 0, "details": "No image provided."}

        try:
            # Decode Base64 to cv2 image
            if ',' in b64_img:
                b64_img = b64_img.split(',')[1]
            img_data = base64.b64decode(b64_img)
            np_arr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                return {"fraud_score": 0, "details": "Invalid image format."}

            # Run YOLO Predict
            results = self.detector.model.predict(
                source=frame,
                conf=self.detector.conf_thresh,
                iou=self.detector.iou_thresh,
                device=self.detector.device,
                verbose=False
            )

            det = results[0]
            boxes = det.boxes.xyxy.cpu().numpy() if len(det.boxes) > 0 else []
            cls_ids = det.boxes.cls.cpu().numpy() if len(det.boxes) > 0 else []
            
            # Count detected classes
            class_counts = {}
            for i, _ in enumerate(boxes):
                c_id = int(cls_ids[i])
                label = self.detector.class_names.get(c_id, f"Class {c_id}")
                class_counts[label] = class_counts.get(label, 0) + 1
            
            # Very basic logic: if it detected a TV/Monitor or cell phone, it might be a picture of a screen (fraud).
            is_fake = "tv" in class_counts or "monitor" in class_counts or "cell phone" in class_counts
            fraud_score = 12 if is_fake else 95
            
            detail_str = f"Detected {len(boxes)} objects: " + ", ".join([f"{k}:{v}" for k, v in class_counts.items()])
            if is_fake:
                detail_str += " (Screen/Phone detected, suspected replay attack)"

            return {
                "fraud_score": fraud_score,
                "details": detail_str
            }
            
        except Exception as e:
            print(f"CVPipeline Error: {e}")
            return {"fraud_score": 0, "details": f"Error processing image: {str(e)}"}
