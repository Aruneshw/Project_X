"""
Main CLI Application Launcher for Universal Real-Time Object Detection System.
"""
import os
import argparse
import config
from detector import ObjectDetector, CameraStream


def parse_args():
    parser = argparse.ArgumentParser(
        description="Universal Real-Time Object Detection System (YOLO26s / Ultralytics)",
        formatter_class=argparse.RawTextHelpFormatter
    )

    parser.add_argument(
        "--source",
        type=str,
        default="0",
        help="Input source:\n"
             " - Camera Index: 0, 1, 2...\n"
             " - RTSP / IP Camera stream URL: rtsp://...\n"
             " - Image File or Directory: path/to/image.jpg or path/to/images/\n"
             " - Video File: path/to/video.mp4"
    )

    parser.add_argument(
        "--weights",
        type=str,
        default=os.path.join(config.MODELS_DIR, config.MODEL_NAME),
        help="Path to YOLO model weights (default: models/yolo26s.pt)"
    )

    parser.add_argument(
        "--conf",
        type=float,
        default=config.CONF_THRESHOLD,
        help="Confidence threshold (default: 0.25)"
    )

    parser.add_argument(
        "--iou",
        type=float,
        default=config.IOU_THRESHOLD,
        help="IoU NMS threshold (default: 0.45)"
    )

    parser.add_argument(
        "--device",
        type=str,
        default=config.DEVICE,
        help="Device selector: 'cuda', 'cpu', 'mps', or 'auto'"
    )

    parser.add_argument(
        "--list-cameras",
        action="store_true",
        help="Scan system hardware for available video cameras"
    )

    parser.add_argument(
        "--no-show",
        action="store_true",
        help="Disable interactive window display"
    )

    return parser.parse_args()


def main():
    args = parse_args()

    if args.list_cameras:
        print("[INFO] Scanning system for available camera devices...")
        cams = CameraStream.scan_available_cameras()
        if not cams:
            print("[WARN] No camera hardware devices detected.")
        else:
            print("[INFO] Detected Cameras:")
            for c in cams:
                print(f"  - Index {c['index']}: {c['name']}")
        return

    detector = ObjectDetector(
        model_path=args.weights,
        conf_thresh=args.conf,
        iou_thresh=args.iou,
        device=args.device
    )

    source = args.source

    # 1. Camera / Stream Detection
    if source.isdigit() or source.startswith(("rtsp://", "http://", "https://")):
        cam_src = int(source) if source.isdigit() else source
        detector.run_webcam(source=cam_src)

    # 2. Image or Image Directory Processing
    elif (os.path.isfile(source) and source.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.webp'))) or os.path.isdir(source):
        detector.process_images(source_path=source, show=not args.no_show)

    # 3. Video File Processing
    elif os.path.isfile(source) and source.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
        detector.process_video(video_path=source, show=not args.no_show)

    else:
        print(f"[ERROR] Invalid source '{source}'. Provide camera index, RTSP URL, image path, or video path.")


if __name__ == "__main__":
    main()
