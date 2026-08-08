import base64

def decode_image_b64(b64_string: str) -> bytes:
    """Decodes a base64 string into bytes, handling data URI prefixes."""
    if not b64_string:
        return b""
    try:
        # Strip data URI prefix if present (e.g., data:image/jpeg;base64,)
        if ',' in b64_string:
            b64_string = b64_string.split(',')[1]
        return base64.b64decode(b64_string)
    except Exception as e:
        print(f"Failed to decode base64 image: {e}")
        return b""

def validate_image_size(image_bytes: bytes, min_bytes: int = 1000) -> bool:
    """Validates that the image has enough data to be processed."""
    return len(image_bytes) >= min_bytes
