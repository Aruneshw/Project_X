import os
import cv2
import numpy as np
import random
from pathlib import Path

def create_synthetic_dataset(base_dir="ml/dataset", num_samples=1000):
    """
    Generates a YOLOv8-compatible synthetic dataset of product damage.
    Generates 1000+ images (80% train, 20% val) with YOLO bounding box labels.
    Class 0: undamaged
    Class 1: damaged (cracks/dents)
    """
    base_path = Path(base_dir)
    images_dir = base_path / "images"
    labels_dir = base_path / "labels"
    
    # Create YOLO directory structure
    for split in ['train', 'val']:
        (images_dir / split).mkdir(parents=True, exist_ok=True)
        (labels_dir / split).mkdir(parents=True, exist_ok=True)

    print(f"Generating {num_samples} synthetic product images...")
    
    for i in range(num_samples):
        # Determine split (80/20)
        split = 'train' if random.random() < 0.8 else 'val'
        
        # Determine if damaged (50/50 split)
        is_damaged = random.random() < 0.5
        class_id = 1 if is_damaged else 0
        
        # Image dimensions
        img_w, img_h = 640, 640
        img = np.ones((img_h, img_w, 3), dtype=np.uint8) * 200  # Gray background
        
        # Draw a "Product" (e.g., a phone or laptop screen)
        prod_w, prod_h = random.randint(300, 450), random.randint(300, 450)
        prod_x1 = random.randint(50, max(51, img_w - prod_w - 50))
        prod_y1 = random.randint(50, max(51, img_h - prod_h - 50))
        prod_x2 = prod_x1 + prod_w
        prod_y2 = prod_y1 + prod_h
        
        # Draw the product (black rectangle representing a screen)
        cv2.rectangle(img, (prod_x1, prod_y1), (prod_x2, prod_y2), (30, 30, 30), -1)
        
        bbox_x_center = -1
        bbox_y_center = -1
        bbox_w = -1
        bbox_h = -1
        
        # Add damage if applicable
        if is_damaged:
            # Simulate a crack using random jagged lines
            start_x = random.randint(prod_x1 + 20, prod_x2 - 20)
            start_y = random.randint(prod_y1 + 20, prod_y2 - 20)
            
            pts = [(start_x, start_y)]
            curr_x, curr_y = start_x, start_y
            
            for _ in range(random.randint(3, 8)):
                curr_x += random.randint(-40, 40)
                curr_y += random.randint(-40, 40)
                # Keep inside product
                curr_x = max(prod_x1 + 5, min(prod_x2 - 5, curr_x))
                curr_y = max(prod_y1 + 5, min(prod_y2 - 5, curr_y))
                pts.append((curr_x, curr_y))
            
            # Draw crack
            for j in range(len(pts)-1):
                cv2.line(img, pts[j], pts[j+1], (200, 200, 200), thickness=random.randint(1, 3))
                
            # Calculate bounding box for the damage
            xs = [p[0] for p in pts]
            ys = [p[1] for p in pts]
            min_x, max_x = min(xs), max(xs)
            min_y, max_y = min(ys), max(ys)
            
            # Add padding to bounding box
            min_x, max_x = max(prod_x1, min_x - 10), min(prod_x2, max_x + 10)
            min_y, max_y = max(prod_y1, min_y - 10), min(prod_y2, max_y + 10)
            
            # YOLO format coordinates (normalized 0-1)
            bbox_x_center = ((min_x + max_x) / 2) / img_w
            bbox_y_center = ((min_y + max_y) / 2) / img_h
            bbox_w = (max_x - min_x) / img_w
            bbox_h = (max_y - min_y) / img_h

        # Save image
        img_name = f"sample_{i:04d}.jpg"
        cv2.imwrite(str(images_dir / split / img_name), img)
        
        # Save YOLO label
        label_name = f"sample_{i:04d}.txt"
        with open(labels_dir / split / label_name, 'w') as f:
            if is_damaged:
                f.write(f"{class_id} {bbox_x_center:.6f} {bbox_y_center:.6f} {bbox_w:.6f} {bbox_h:.6f}\n")
            # If not damaged, YOLO expects an empty txt file.

    # Generate data.yaml for YOLOv8
    yaml_content = f"""
path: ./ml/dataset
train: images/train
val: images/val

names:
  0: undamaged
  1: damaged
"""
    with open(base_path / "data.yaml", 'w') as f:
        f.write(yaml_content.strip())
        
    print(f"✅ Successfully generated {num_samples} synthetic images and labels in {base_dir}")
    print(f"✅ Created YOLO configuration file at {base_path / 'data.yaml'}")

if __name__ == "__main__":
    create_synthetic_dataset(num_samples=1000)
