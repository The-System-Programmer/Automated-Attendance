import sys
import json
import cv2
import pickle
import numpy as np
from pathlib import Path
from insightface.app import FaceAnalysis

# Video path received from Express
VIDEO_PATH = sys.argv[1]

# Project root
BASE_DIR = Path(__file__).resolve().parent.parent

# embeddings.pkl
EMBEDDINGS_PATH = BASE_DIR / "Data" / "Model" / "embeddings.pkl"

SIMILARITY_THRESHOLD = 0.50


def cosine_similarity(a, b):
    return np.dot(a, b) / (
        np.linalg.norm(a) * np.linalg.norm(b)
    )


# Load embeddings
with open(EMBEDDINGS_PATH, "rb") as f:
    known_embeddings = pickle.load(f)

# InsightFace
app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0)

# Open uploaded video
cap = cv2.VideoCapture(VIDEO_PATH)

if not cap.isOpened():
    print(
        json.dumps({
            "error": "Could not open video"
        })
    )
    sys.exit(1)

present_people = set()

frame_count = 0
FRAME_SKIP = 10

while True:

    ret, frame = cap.read()

    if not ret:
        break

    frame_count += 1

    if frame_count % FRAME_SKIP != 0:
        continue

    faces = app.get(frame)

    for face in faces:

        embedding = face.embedding

        best_name = "Unknown"
        best_score = -1

        for person_name, stored_embeddings in known_embeddings.items():

            if isinstance(stored_embeddings, np.ndarray):
                stored_embeddings = [stored_embeddings]

            for known_embedding in stored_embeddings:

                score = cosine_similarity(
                    embedding,
                    np.array(known_embedding)
                )

                if score > best_score:
                    best_score = score
                    best_name = person_name

        if best_score >= SIMILARITY_THRESHOLD:
            present_people.add(best_name)

cap.release()

# Return JSON to Express
result = {
    "present": sorted(list(present_people))
}

print(json.dumps(result))