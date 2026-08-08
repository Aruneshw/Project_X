# Universal Real-Time Object Detection System

A production-ready computer vision object detection system built with Python 3.12+, OpenCV, PyTorch, and Ultralytics YOLO26s.

---

## 📁 Directory Structure

```
ObjectDetection/
│── main.py            # CLI Application entry point & router
│── detector.py        # Core YOLO Object Detection Engine & Camera Stream Manager
│── config.py          # System Configuration & Defaults
│── requirements.txt    # Project Dependencies
│── README.md          # Project Documentation
│
├── models/            # Directory for storing model weights (yolo26s.pt)
│     └── yolo26s.pt
│
└── outputs/           # Directory for output recordings, screenshots, and annotated media
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Live Camera Detection (Webcam / USB Camera)
```bash
python main.py --source 0
```

### 3. Scan Connected Cameras
```bash
python main.py --source 0 --list-cameras
```

### 4. Process Images or Folders
```bash
python main.py --source path/to/image.jpg
python main.py --source path/to/images_directory/
```

### 5. Process Video File
```bash
python main.py --source path/to/video.mp4
```

---

## ⌨️ Live Keyboard Controls

While the OpenCV display window is active:

| Key | Function |
|---|---|
| **Q** | **Quit** application cleanly |
| **S** | Save high-resolution **Screenshot** to `outputs/` |
| **R** | **Start Recording** live stream to MP4 |
| **T** | **Stop Recording** live stream |
| **F** | Toggle **FPS & Latency HUD** overlay |
| **C** | Toggle **Confidence Score** labels |
| **B** | Toggle **Bounding Boxes** outline |
