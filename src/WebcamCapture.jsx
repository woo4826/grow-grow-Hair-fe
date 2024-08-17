import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WebcamCapture.css';

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsStreaming(true);  // Start showing the grid
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsStreaming(false);  // Hide the grid when the camera stops
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setImage(url);
        stopCamera(); // Stop the camera after capturing
      }
    });
  };

  const goToNextStage = () => {
    navigate('/game');
  };

  return (
    <div className="webcam-container">
      {!image && (
        <>
          <div className="video-wrapper">
            <video ref={videoRef} className="webcam-video" autoPlay playsInline></video>
            <div className={`grid-overlay ${isStreaming ? '' : 'hidden'}`}>
              <div className="horizontal-line-1"></div>
              <div className="horizontal-line-2"></div>
            </div> {/* Grid overlay */}
          </div>
          <div className="centered-buttons">
            {!isStreaming && <button className="webcam-button" onClick={startCamera}>Start Camera</button>}
            {isStreaming && <button className="webcam-button" onClick={captureImage}>Capture Image</button>}
          </div>
        </>
      )}
      {image && (
        <>
          <img src={image} alt="Captured" className="captured-image" />
          <div className="centered-buttons">
            <button className="webcam-button" onClick={() => setImage(null)}>Retake Photo</button>
            <button className="next-button" onClick={goToNextStage}>Next</button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="webcam-canvas"></canvas>
    </div>
  );
};

export default WebcamCapture;
