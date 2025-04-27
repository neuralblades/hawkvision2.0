# HAWK-VISION 2.0

A real-time object detection web application that uses YOLOv8 for detecting and classifying objects in images. The application consists of a React frontend and a FastAPI backend, containerized with Docker for easy deployment.

## 🚀 Features

- Real-time object detection using YOLOv8
- Drag-and-drop interface for image upload
- Visual bounding boxes with labels and confidence scores
- Summary of detected objects
- Containerized application with Docker
- Cross-platform compatibility

## 🏗️ Architecture

The project is split into two main components:

### Frontend
- Built with React + Vite
- Uses React-Dropzone for file handling
- Axios for API communication
- Real-time image preview with bounding box overlay
- Responsive design

### Backend
- FastAPI server
- YOLOv8 for object detection
- PIL for image processing
- CORS enabled for frontend communication

## 🛠️ Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

## 📦 Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd hawk-vision
```

2. Start the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

### Local Development Setup

#### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download YOLOv8 model:
```bash
# The model will be downloaded automatically on first run
```

5. Start the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🔧 API Endpoints

### POST `/predict`
- Endpoint for object detection
- Accepts multipart/form-data with an image file
- Returns JSON with predictions including:
  - Bounding box coordinates
  - Object labels
  - Confidence scores

## 💻 Usage

1. Access the web interface at http://localhost:5173
2. Drag and drop an image or click to select one
3. Wait for the detection results
4. View the detected objects with bounding boxes and labels
5. Check the summary of detected objects

## 🔒 Security Notes

- The backend CORS is currently configured to accept all origins (`"*"`)
- For production, configure proper CORS settings and add authentication
- The YOLOv8 model file is not included in the repository and will be downloaded on first run

## 🛠️ Development

### Project Structure
```
.
├── backend/
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile       # Backend container configuration
├── frontend/
│   ├── src/
│   │   ├── App.jsx     # Main React component
│   │   └── App.css     # Styles
│   ├── package.json    # Node.js dependencies
│   └── Dockerfile      # Frontend container configuration
└── docker-compose.yml  # Container orchestration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- YOLOv8 by Ultralytics
- React and Vite communities
- FastAPI framework