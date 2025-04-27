from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from ultralytics import YOLO

# Initialize FastAPI app
app = FastAPI()

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the YOLOv8 model (nano version for speed)
model = YOLO("yolov8n.pt")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read uploaded image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    
    # Get original image dimensions
    original_width, original_height = image.size
    
    # Run YOLO model inference
    results = model(image)
    
    # Extract bounding boxes, labels, and confidence scores
    predictions = []
    for result in results:
        boxes = result.boxes.xyxy.tolist()  # Bounding box coordinates
        classes = result.boxes.cls.tolist()  # Object classes
        confidences = result.boxes.conf.tolist()  # Confidence scores

        for box, cls, conf in zip(boxes, classes, confidences):
            # Scale bounding box back to original image size
            scaled_box = [
                box[0] * (original_width / result.orig_shape[1]),  # X1
                box[1] * (original_height / result.orig_shape[0]), # Y1
                box[2] * (original_width / result.orig_shape[1]),  # X2
                box[3] * (original_height / result.orig_shape[0])  # Y2
            ]
            predictions.append({
                "label": result.names[int(cls)],  # Class label
                "confidence": float(conf),  # Confidence score
                "box": scaled_box  # Adjusted bounding box
            })
    
    return {"predictions": predictions}

