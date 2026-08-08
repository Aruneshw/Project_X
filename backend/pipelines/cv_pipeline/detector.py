"""
Object Detector Engine Module.
Integrates YOLO object detection, camera hardware handling, visualization, interactive HUD, recording, and batch processing.
"""
import os
import glob
import time
import threading
import cv2
import numpy as np
import torch
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Union
from ultralytics import YOLO

import config


class FPSCounter:
    """Calculates smooth real-time FPS and latency in milliseconds."""

    def __init__(self, smoothing_factor: float = 0.9):
        self.smoothing_factor = smoothing_factor
        self.prev_time = time.perf_counter()
        self.current_fps = 0.0
        self.frame_count = 0
        self.inference_time_ms = 0.0

    def start_inference(self) -> float:
        return time.perf_counter()

    def end_inference(self, start_t: float) -> float:
        self.inference_time_ms = (time.perf_counter() - start_t) * 1000.0
        return self.inference_time_ms

    def update(self) -> float:
        now = time.perf_counter()
        delta = now - self.prev_time
        self.prev_time = now

        if delta > 0:
            instant_fps = 1.0 / delta
            if self.current_fps == 0.0:
                self.current_fps = instant_fps
            else:
                self.current_fps = (self.smoothing_factor * self.current_fps) + ((1.0 - self.smoothing_factor) * instant_fps)

        self.frame_count += 1
        return self.current_fps


class CameraStream:
    """Threaded camera stream reader for USB cameras, laptop webcams, RTSP streams, and IP cameras."""

    def __init__(self, source: Union[int, str] = 0, width: int = 1280, height: int = 720):
        self.source = source
        self.width = width
        self.height = height
        self.cap: Optional[cv2.VideoCapture] = None
        self.is_running = False
        self.frame = None
        self.ret = False
        self.thread = None
        self.lock = threading.Lock()

    @staticmethod
    def scan_available_cameras(max_devices: int = config.MAX_SCAN_CAMERAS) -> List[Dict[str, Union[int, str]]]:
        """Scans hardware indices to detect available cameras."""
        available = []
        for idx in range(max_devices):
            cap = cv2.VideoCapture(idx, cv2.CAP_DSHOW) if cv2.os.name == 'nt' else cv2.VideoCapture(idx)
            if cap.isOpened():
                ret, _ = cap.read()
                if ret:
                    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                    available.append({"index": idx, "name": f"Camera {idx} ({w}x{h})"})
                cap.release()
        return available

    def open(self) -> bool:
        if isinstance(self.source, int) or (isinstance(self.source, str) and self.source.isdigit()):
            src_idx = int(self.source)
            self.cap = cv2.VideoCapture(src_idx, cv2.CAP_DSHOW) if cv2.os.name == 'nt' else cv2.VideoCapture(src_idx)
        else:
            self.cap = cv2.VideoCapture(self.source)

        if not self.cap or not self.cap.isOpened():
            return False

        if isinstance(self.source, (int, str)) and str(self.source).isdigit():
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)

        self.ret, self.frame = self.cap.read()
        return self.ret

    def start(self) -> None:
        if self.is_running:
            return
        self.is_running = True
        self.thread = threading.Thread(target=self._loop, daemon=True)
        self.thread.start()

    def _loop(self) -> None:
        while self.is_running and self.cap and self.cap.isOpened():
            ret, frame = self.cap.read()
            with self.lock:
                self.ret = ret
                if ret:
                    self.frame = frame
            time.sleep(0.005)

    def read(self) -> Tuple[bool, Optional[np.ndarray]]:
        if self.thread is not None:
            with self.lock:
                return self.ret, self.frame.copy() if self.frame is not None else None
        elif self.cap:
            ret, frame = self.cap.read()
            return ret, frame
        return False, None

    def release(self) -> None:
        self.is_running = False
        if self.thread is not None:
            self.thread.join(timeout=1.0)
            self.thread = None
        if self.cap:
            self.cap.release()
            self.cap = None


class ObjectDetector:
    """Production Object Detection Pipeline using Ultralytics YOLO26s."""

    def __init__(
        self,
        model_path: str = os.path.join(config.MODELS_DIR, config.MODEL_NAME),
        conf_thresh: float = config.CONF_THRESHOLD,
        iou_thresh: float = config.IOU_THRESHOLD,
        device: str = config.DEVICE
    ):
        self.model_path = model_path
        self.conf_thresh = conf_thresh
        self.iou_thresh = iou_thresh

        # Hardware acceleration resolution
        if device == "auto":
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device

        print(f"[INFO] Initializing ObjectDetector on Device: {self.device.upper()}")
        print(f"[INFO] Loading YOLO Model from: {self.model_path}")

        try:
            self.model = YOLO(self.model_path)
        except Exception as e:
            print(f"[WARN] Failed to load {self.model_path} ({e}). Downloading fallback {config.FALLBACK_MODEL}...")
            self.model = YOLO(config.FALLBACK_MODEL)
            self.model_path = config.FALLBACK_MODEL

        self.class_names = self.model.names
        self.colors: Dict[int, Tuple[int, int, int]] = {}

        # UI State Toggles
        self.show_boxes = config.SHOW_BOXES
        self.show_labels = config.SHOW_LABELS
        self.show_conf = config.SHOW_CONF
        self.show_fps = config.SHOW_FPS

        # Video Writer State
        self.is_recording = False
        self.video_writer: Optional[cv2.VideoWriter] = None

    def _get_color(self, class_id: int) -> Tuple[int, int, int]:
        if class_id not in self.colors:
            np.random.seed(class_id * 42)
            c = tuple(map(int, np.random.randint(50, 255, size=3)))
            self.colors[class_id] = (c[0], c[1], c[2])
        return self.colors[class_id]

    def draw_annotations(
        self,
        frame: np.ndarray,
        boxes: np.ndarray,
        scores: np.ndarray,
        cls_ids: np.ndarray
    ) -> Tuple[np.ndarray, Dict[str, int]]:
        class_counts: Dict[str, int] = {}
        if len(boxes) == 0:
            return frame, class_counts

        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = map(int, box)
            c_id = int(cls_ids[i])
            score = float(scores[i])
            label = self.class_names.get(c_id, f"Class {c_id}")
            class_counts[label] = class_counts.get(label, 0) + 1

            color = self._get_color(c_id)

            if self.show_boxes:
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, config.BOX_THICKNESS)

            if self.show_labels:
                text = f"{label}" + (f" {score:.2f}" if self.show_conf else "")
                (tw, th), baseline = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, config.FONT_SCALE, 1)
                py1 = max(y1 - th - baseline - 6, 0)
                py2 = max(y1, th + baseline + 6)
                px2 = x1 + tw + 10

                cv2.rectangle(frame, (x1, py1), (px2, py2), color, -1)
                cv2.putText(frame, text, (x1 + 5, py2 - baseline - 3), cv2.FONT_HERSHEY_SIMPLEX, config.FONT_SCALE, (0, 0, 0), 1, cv2.LINE_AA)

        return frame, class_counts

    def draw_hud(
        self,
        frame: np.ndarray,
        fps: float,
        latency: float,
        source_name: str,
        class_counts: Dict[str, int],
        frame_idx: int
    ) -> np.ndarray:
        h, w = frame.shape[:2]

        # Glassmorphism Top Bar
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, 85), (15, 15, 20), -1)
        cv2.addWeighted(overlay, 0.75, frame, 0.25, 0, frame)
        cv2.line(frame, (0, 85), (w, 85), (0, 255, 200), 2)

        fps_color = (0, 255, 0) if fps >= 30 else (0, 200, 255) if fps >= 15 else (0, 0, 255)
        cv2.putText(frame, f"FPS: {fps:.1f}", (15, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.65, fps_color, 2, cv2.LINE_AA)
        cv2.putText(frame, f"Latency: {latency:.1f} ms", (140, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (220, 220, 220), 1, cv2.LINE_AA)
        cv2.putText(frame, f"Device: {self.device.upper()}", (300, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 220, 255), 1, cv2.LINE_AA)

        cv2.putText(frame, f"Model: {os.path.basename(self.model_path)}", (15, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1, cv2.LINE_AA)
        cv2.putText(frame, f"Source: {source_name}", (220, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (200, 200, 250), 1, cv2.LINE_AA)
        cv2.putText(frame, f"Res: {w}x{h}", (450, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (200, 200, 250), 1, cv2.LINE_AA)

        time_str = datetime.now().strftime("%H:%M:%S")
        total_objects = sum(class_counts.values())
        obj_summary = ", ".join([f"{k}:{v}" for k, v in list(class_counts.items())[:4]])

        cv2.putText(frame, f"Time: {time_str} | Frame: {frame_idx}", (15, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (180, 180, 180), 1, cv2.LINE_AA)
        cv2.putText(frame, f"Objects ({total_objects}): {obj_summary if total_objects > 0 else 'None'}", (300, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 150), 1, cv2.LINE_AA)

        if self.is_recording:
            cv2.circle(frame, (w - 120, 25), 8, (0, 0, 255), -1)
            cv2.putText(frame, "REC", (w - 100, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2, cv2.LINE_AA)

        return frame

    def run_webcam(self, source: Union[int, str] = 0) -> None:
        """Runs live detection session from camera feed or RTSP stream."""
        cam = CameraStream(source=source, width=config.CAMERA_WIDTH, height=config.CAMERA_HEIGHT)
        if not cam.open():
            print(f"[ERROR] Could not open camera source: {source}")
            return

        cam.start()
        fps_counter = FPSCounter()
        window = config.WINDOW_NAME
        cv2.namedWindow(window, cv2.WINDOW_NORMAL)

        half = (self.device == "cuda") and config.HALF_PRECISION
        print("[INFO] Press 'Q' to quit, 'S' for screenshot, 'R'/'T' to record, 'F' toggle FPS, 'C' toggle Conf, 'B' toggle Boxes.")

        try:
            while True:
                ret, frame = cam.read()
                if not ret or frame is None:
                    time.sleep(0.01)
                    continue

                start_t = fps_counter.start_inference()
                results = self.model.predict(
                    source=frame,
                    conf=self.conf_thresh,
                    iou=self.iou_thresh,
                    imgsz=config.IMGSZ,
                    device=self.device,
                    half=half,
                    verbose=False
                )
                latency = fps_counter.end_inference(start_t)
                fps = fps_counter.update()

                det = results[0]
                boxes = det.boxes.xyxy.cpu().numpy() if len(det.boxes) > 0 else []
                scores = det.boxes.conf.cpu().numpy() if len(det.boxes) > 0 else []
                cls_ids = det.boxes.cls.cpu().numpy() if len(det.boxes) > 0 else []

                annotated, class_counts = self.draw_annotations(frame, boxes, scores, cls_ids)

                if self.show_fps:
                    annotated = self.draw_hud(annotated, fps, latency, str(source), class_counts, fps_counter.frame_count)

                if self.is_recording and self.video_writer:
                    self.video_writer.write(annotated)

                cv2.imshow(window, annotated)

                key = cv2.waitKey(1) & 0xFF
                if key == ord('q') or key == ord('Q'):
                    break
                elif key == ord('s') or key == ord('S'):
                    ts = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
                    path = os.path.join(config.OUTPUTS_DIR, f"screenshot_{ts}.jpg")
                    cv2.imwrite(path, annotated)
                    print(f"[INFO] Saved screenshot: {path}")
                elif key == ord('r') or key == ord('R'):
                    if not self.is_recording:
                        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
                        path = os.path.join(config.OUTPUTS_DIR, f"recording_{ts}.mp4")
                        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                        self.video_writer = cv2.VideoWriter(path, fourcc, 30.0, (annotated.shape[1], annotated.shape[0]))
                        self.is_recording = True
                        print(f"[INFO] Recording started: {path}")
                elif key == ord('t') or key == ord('T'):
                    if self.is_recording:
                        self.is_recording = False
                        if self.video_writer:
                            self.video_writer.release()
                            self.video_writer = None
                        print("[INFO] Recording stopped.")
                elif key == ord('f') or key == ord('F'):
                    self.show_fps = not self.show_fps
                elif key == ord('c') or key == ord('C'):
                    self.show_conf = not self.show_conf
                elif key == ord('b') or key == ord('B'):
                    self.show_boxes = not self.show_boxes
        finally:
            if self.is_recording and self.video_writer:
                self.video_writer.release()
            cam.release()
            cv2.destroyAllWindows()

    def process_images(self, source_path: str, show: bool = True) -> List[str]:
        """Processes single image file or directory of images."""
        if os.path.isfile(source_path):
            files = [source_path]
        elif os.path.isdir(source_path):
            files = []
            for ext in ["*.jpg", "*.jpeg", "*.png", "*.bmp", "*.webp"]:
                files.extend(glob.glob(os.path.join(source_path, ext)))
        else:
            print(f"[ERROR] Invalid path: {source_path}")
            return []

        out_paths = []
        for path in files:
            frame = cv2.imread(path)
            if frame is None:
                continue

            results = self.model.predict(
                source=frame,
                conf=self.conf_thresh,
                iou=self.iou_thresh,
                imgsz=config.IMGSZ,
                device=self.device,
                verbose=False
            )

            det = results[0]
            boxes = det.boxes.xyxy.cpu().numpy() if len(det.boxes) > 0 else []
            scores = det.boxes.conf.cpu().numpy() if len(det.boxes) > 0 else []
            cls_ids = det.boxes.cls.cpu().numpy() if len(det.boxes) > 0 else []

            annotated, class_counts = self.draw_annotations(frame, boxes, scores, cls_ids)
            base = os.path.basename(path)
            out_file = os.path.join(config.OUTPUTS_DIR, f"detected_{base}")
            cv2.imwrite(out_file, annotated)
            out_paths.append(out_file)
            print(f"[INFO] Processed: {base} | Found: {sum(class_counts.values())} objects -> {out_file}")

            if show:
                cv2.imshow(f"Detection - {base}", annotated)
                cv2.waitKey(0)
                cv2.destroyAllWindows()

        return out_paths

    def process_video(self, video_path: str, show: bool = True) -> str:
        """Processes a video file frame-by-frame."""
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(f"[ERROR] Cannot open video: {video_path}")
            return ""

        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        input_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        base = os.path.basename(video_path)
        out_file = os.path.join(config.OUTPUTS_DIR, f"detected_{base}")

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        writer = cv2.VideoWriter(out_file, fourcc, input_fps, (w, h))

        fps_counter = FPSCounter()
        half = (self.device == "cuda") and config.HALF_PRECISION

        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                start_t = fps_counter.start_inference()
                results = self.model.predict(
                    source=frame,
                    conf=self.conf_thresh,
                    iou=self.iou_thresh,
                    imgsz=config.IMGSZ,
                    device=self.device,
                    half=half,
                    verbose=False
                )
                latency = fps_counter.end_inference(start_t)
                fps = fps_counter.update()

                det = results[0]
                boxes = det.boxes.xyxy.cpu().numpy() if len(det.boxes) > 0 else []
                scores = det.boxes.conf.cpu().numpy() if len(det.boxes) > 0 else []
                cls_ids = det.boxes.cls.cpu().numpy() if len(det.boxes) > 0 else []

                annotated, class_counts = self.draw_annotations(frame, boxes, scores, cls_ids)
                annotated = self.draw_hud(annotated, fps, latency, base, class_counts, fps_counter.frame_count)

                writer.write(annotated)

                if show:
                    cv2.imshow(f"Video - {base}", annotated)
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
        finally:
            cap.release()
            writer.release()
            cv2.destroyAllWindows()

        print(f"[INFO] Video exported to: {out_file}")
        return out_file
