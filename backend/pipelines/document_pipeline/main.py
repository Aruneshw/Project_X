import re

class DocumentPipeline:
    """
    Simulates the Sandboxed Document Verification Pipeline (Agent #5)
    Runs OCR (Tesseract / EasyOCR equivalent logic) to validate invoices.
    """
    
    @staticmethod
    def process_invoice(invoice_name: str, claim_order_id: str) -> dict:
        if not invoice_name:
            return {"status": "skipped", "score": 50, "reason": "No document uploaded"}
            
        # Simulate OCR extraction matching the order ID
        # If the invoice name contains 'fake' or 'fraud', flag it
        if 'fake' in invoice_name.lower() or 'fraud' in invoice_name.lower():
            return {
                "status": "rejected",
                "score": 10,
                "reason": "Document forensics detected manipulation/forgery."
            }
            
        return {
            "status": "passed",
            "score": 95,
            "details": {
                "ocr_match": f"Successfully matched Order ID {claim_order_id} in document.",
                "merchant": "cxplatform authorized vendor",
                "date_valid": True
            }
        }
