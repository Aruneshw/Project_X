import os
import re
import cv2
import numpy as np
import base64
from typing import Dict, Any, Optional

try:
    import easyocr
except ImportError:
    easyocr = None

class OCRExtractor:
    """
    Advanced OCR Extractor using Deep Learning (EasyOCR) + OpenCV Preprocessing.
    Extracts Order IDs, Dates, Prices, and structured data from Invoices/Receipts.
    """
    
    def __init__(self, use_gpu: bool = False):
        if easyocr is None:
            raise ImportError("Please install easyocr: pip install easyocr")
        
        # Load English language model for EasyOCR
        self.reader = easyocr.Reader(['en'], gpu=use_gpu)
        
        # Regex patterns for common invoice structures
        self.patterns = {
            "order_id": r"(?i)(?:order(?: id| #| no| number)?[\s:#-]*)([A-Z0-9-]{6,15})",
            "invoice_id": r"(?i)(?:invoice(?: id| #| no| number)?[\s:#-]*)([A-Z0-9-]{6,15})",
            "date": r"(?i)(?:date[\s:#-]*)([0-9]{1,4}[-/][0-9]{1,2}[-/][0-9]{1,4})",
            "amount": r"(?i)(?:total|amount due|balance)[\s:#-]*[\$£€]?\s*([0-9,]+\.[0-9]{2})"
        }

    def decode_base64_image(self, b64_string: str) -> np.ndarray:
        """Decodes base64 string to an OpenCV image."""
        if "," in b64_string:
            b64_string = b64_string.split(",")[1]
        
        image_data = base64.b64decode(b64_string)
        np_arr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return img

    def preprocess_image(self, img: np.ndarray) -> np.ndarray:
        """
        Enhances image for better OCR accuracy.
        Applies grayscale, thresholding, and morphological operations.
        """
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Upscale image slightly if it's small to improve text resolution
        height, width = gray.shape
        if height < 1000:
            gray = cv2.resize(gray, (width * 2, height * 2), interpolation=cv2.INTER_CUBIC)
            
        # Apply adaptive thresholding to handle varying lighting
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        return thresh

    def process_invoice(self, base64_image: str) -> Dict[str, Any]:
        """
        Extracts all text and identifies key patterns (Order ID, Amount, etc.).
        """
        try:
            # 1. Decode and preprocess
            img = self.decode_base64_image(base64_image)
            processed_img = self.preprocess_image(img)
            
            # 2. Run EasyOCR Inference
            # Read text with detailed confidence
            results = self.reader.readtext(processed_img, detail=1)
            
            # 3. Combine text blocks and extract patterns
            extracted_text = []
            confidence_scores = []
            
            for (bbox, text, prob) in results:
                extracted_text.append(text)
                confidence_scores.append(prob)
                
            full_text = " ".join(extracted_text)
            
            # 4. Pattern Matching
            extracted_data = {
                "order_id": self._find_pattern("order_id", full_text),
                "invoice_id": self._find_pattern("invoice_id", full_text),
                "date": self._find_pattern("date", full_text),
                "total_amount": self._find_pattern("amount", full_text),
                "raw_text_snippet": full_text[:500] + "..." if len(full_text) > 500 else full_text,
                "overall_confidence": float(np.mean(confidence_scores)) if confidence_scores else 0.0
            }
            
            # Fallback for Order ID if invoice_id found instead
            if not extracted_data["order_id"] and extracted_data["invoice_id"]:
                extracted_data["order_id"] = extracted_data["invoice_id"]
                
            return {
                "success": True,
                "data": extracted_data
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def _find_pattern(self, key: str, text: str) -> Optional[str]:
        """Runs regex search on the extracted text."""
        pattern = self.patterns.get(key)
        if not pattern:
            return None
            
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip()
        return None

if __name__ == "__main__":
    # Test script usage
    print("OCRExtractor initialized. Waiting for base64 image data...")
