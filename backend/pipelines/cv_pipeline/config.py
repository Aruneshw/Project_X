"""
Configuration settings for Universal Real-Time Object Detection System.
"""
import os

# Model Settings
MODEL_NAME = "yolo26s.pt"
FALLBACK_MODEL = "yolov8s.pt"
MODELS_DIR = "models"

# Inference Settings
CONF_THRESHOLD = 0.25
IOU_THRESHOLD = 0.45
HALF_PRECISION = True
DEVICE = "auto"  # "auto", "cuda", "cpu", "mps"
IMGSZ = 640

# Display Settings
SHOW_BOXES = True
SHOW_LABELS = True
SHOW_CONF = True
SHOW_FPS = True
SHOW_HUD = True
BOX_THICKNESS = 2
FONT_SCALE = 0.6
WINDOW_NAME = "Universal Real-Time Object Detection System"

# Camera Settings
DEFAULT_CAMERA_INDEX = 0
MAX_SCAN_CAMERAS = 5
CAMERA_WIDTH = 1280
CAMERA_HEIGHT = 720

# Output Paths
OUTPUTS_DIR = "outputs"

# Create required directories
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(OUTPUTS_DIR, exist_ok=True)
