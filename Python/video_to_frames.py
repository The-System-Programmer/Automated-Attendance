import cv2
import os

video_path = "input.mp4"
output_folder = "frames"

os.makedirs(output_folder, exist_ok=True)

cap = cv2.VideoCapture(video_path)

frame_count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    output_path = os.path.join(output_folder, f"frame_{frame_count:06d}.jpg")
    cv2.imwrite(output_path, frame)

    frame_count += 1

cap.release()

print(f"Saved {frame_count} frames to '{output_folder}'")