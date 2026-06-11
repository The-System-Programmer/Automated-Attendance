import os
import cv2
import pickle
import numpy as np

from insightface.app import FaceAnalysis

app = FaceAnalysis(
    providers=['CPUExecutionProvider']
)

app.prepare(ctx_id=0)

DATASET_DIR = "../Data/Students/"
OUTPUT_FILE = "../Data/Model/embeddings.pkl"

database = {}

for usn in os.listdir(DATASET_DIR):

    student_folder = os.path.join(DATASET_DIR, usn)

    if not os.path.isdir(student_folder):
        continue

    embeddings = []

    print(f"Processing {usn}")

    for image_name in os.listdir(student_folder):

        image_path = os.path.join(student_folder, image_name)

        image = cv2.imread(image_path)

        if image is None:
            continue

        faces = app.get(image)

        if len(faces) == 0:
            print(f"No face found: {image_path}")
            continue

        embedding = faces[0].embedding

        embeddings.append(embedding)

    if len(embeddings) > 0:

        mean_embedding = np.mean(
            embeddings,
            axis=0
        )

        database[usn] = mean_embedding

print(f"Saving {len(database)} students")

with open(OUTPUT_FILE, "wb") as f:
    pickle.dump(database, f)

print("Saved to embeddings.pkl")