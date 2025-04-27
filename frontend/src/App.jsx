import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './App.css';

function App() {
  const [predictions, setPredictions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      
      // Reset states
      setError(null);
      setPredictions([]);
      setLoading(true);
      
      // Create image preview
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      
      // Get image dimensions for proper bounding box scaling
      const img = new Image();
      img.onload = async () => {
        setImageSize({ width: img.width, height: img.height });
        
        // Send image to backend
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axios.post(
            'http://localhost:8000/predict',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          setPredictions(response.data.predictions);
        } catch (err) {
          console.error("Error detecting objects:", err);
          setError("Failed to process image. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      img.src = preview;
    },
  });

  const renderBoundingBoxes = () => {
    if (!imagePreview || predictions.length === 0) return null;
    
    // Get the displayed image dimensions for scaling
    const imgElement = document.getElementById('preview-image');
    if (!imgElement) return null;
    
    const displayedWidth = imgElement.clientWidth;
    const displayedHeight = imgElement.clientHeight;
    
    // Calculate scaling factors
    const scaleX = displayedWidth / imageSize.width;
    const scaleY = displayedHeight / imageSize.height;
    
    return predictions.map((pred, idx) => {
      // Scale bounding box to match displayed image size
      const scaledBox = [
        pred.box[0] * scaleX,
        pred.box[1] * scaleY,
        (pred.box[2] - pred.box[0]) * scaleX,
        (pred.box[3] - pred.box[1]) * scaleY,
      ];
      
      return (
        <div
          key={idx}
          style={{
            position: 'absolute',
            border: '2px solid red',
            left: `${scaledBox[0]}px`,
            top: `${scaledBox[1]}px`,
            width: `${scaledBox[2]}px`,
            height: `${scaledBox[3]}px`,
            boxSizing: 'border-box',
          }}
        >
          <span 
            style={{ 
              background: 'red', 
              color: 'white', 
              fontSize: '12px',
              padding: '1px 4px',
              borderRadius: '2px',
              position: 'absolute',
              top: '-18px',
            }}
          >
            {pred.label} ({Math.round(pred.confidence * 100)}%)
          </span>
        </div>
      );
    });
  };

  return (
    <div className="container">
      <h1>HAWK-VISION 2.0</h1>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag & drop an image, or click to select</p>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Processing image...</div>}

      {imagePreview && (
        <div className="preview-container">
          <img
            id="preview-image"
            src={imagePreview}
            alt="Preview"
            className="preview-image"
          />
          {renderBoundingBoxes()}
          
          {predictions.length > 0 && (
            <div className="results-summary">
              <h3>Detected {predictions.length} object(s)</h3>
              <ul>
                {[...new Set(predictions.map(p => p.label))].map(label => {
                  const count = predictions.filter(p => p.label === label).length;
                  return <li key={label}>{count} {label}(s)</li>;
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;