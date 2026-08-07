import cv2
from ultralytics import YOLO

class ProductClassifier:
    def __init__(self, model_path='yolov8n.pt'):
        """
        Layer 2: Product Identity.
        Uses YOLOv8 to identify if the object in the frame matches the claimed product category.
        """
        # Load the base YOLOv8 nano model (fastest for real-time inference)
        self.model = YOLO(model_path)
        
        # Mapping COCO dataset classes to common retail categories (simplified mapping)
        self.target_classes = {
            'laptop': 63,
            'cell phone': 67,
            'mouse': 64,
            'keyboard': 66,
            'tv': 62,
            'bottle': 39,
            'backpack': 24,
            'book': 73
        }

    def verify_product(self, frame, expected_product_type: str):
        """
        Run YOLO inference to check if the expected product is in the frame.
        """
        # Run inference on the frame
        results = self.model(frame, verbose=False)[0]
        
        detected_classes = [int(cls) for cls in results.boxes.cls.tolist()]
        confidences = results.boxes.conf.tolist()
        
        expected_class_id = self.target_classes.get(expected_product_type.lower())
        
        product_found = False
        best_confidence = 0.0
        
        if expected_class_id is not None:
            # Check if expected class is in detections
            for cls_id, conf in zip(detected_classes, confidences):
                if cls_id == expected_class_id:
                    product_found = True
                    if conf > best_confidence:
                        best_confidence = conf

        # If it's a category we don't have in COCO, we might fallback to general object presence
        # For this PoC, we enforce a strict check if it's a known category.
        passed = product_found and best_confidence > 0.4
        
        return {
            "passed": passed,
            "expected_product": expected_product_type,
            "confidence": round(best_confidence, 2) if product_found else 0.0,
            "raw_detections": [self.model.names[c] for c in detected_classes]
        }
