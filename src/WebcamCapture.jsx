import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './WebcamCapture.css';

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null); // Store base64 string
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

  const resizeImage = (src, width, height) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const resizedBase64 = canvas.toDataURL('image/png');
        resolve(resizedBase64);
      };
    });
  };

  const captureImage = async () => {
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    // Convert canvas content to base64 string
    const base64Image = canvasRef.current.toDataURL('image/png');

    // const resizedBase64 = await resizeImage(base64Image, 800, 600);

    setImageBase64(base64Image); // Store the base64 string

    // Optionally, create a blob for preview
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setImage(url);
        stopCamera(); // Stop the camera after capturing
      }
    });
  };

  const goToNextStage = async () => {
    // Prepare the payload with the base64 image string
    const payload = {
      image: String(imageBase64),
    };

    console.log('Payload:', payload);

    try {
      // Send POST request to the backend server using Axios
      const response = await axios.post('https://19cd-218-146-20-61.ngrok-free.app/start', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      
      const data = response.data;
      console.log('Response:', data);
      const userId = data.user_id;
      console.log('userId:', userId);

      if (response.status === 200) {
        console.log('Image successfully sent to the server');

        // Navigate to the /game page with state
        navigate('/game', { state: { userId: `${userId}` } });
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
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
