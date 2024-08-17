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
      setIsStreaming(true);
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
    setIsStreaming(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Ensure canvas dimensions match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas content to base64 string
    const base64Image = canvas.toDataURL('image/png');
    setImageBase64(base64Image); // Store the base64 string

    // Create a Blob for the captured image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setImage(url);
        stopCamera(); // Stop the camera after capturing
      } else {
        console.error('Failed to create Blob from canvas');
      }
    }, 'image/png');
  };

  const goToNextStage = async () => {
    const formData = new FormData();

    // Convert canvas content to Blob
    canvasRef.current.toBlob(async (blob) => {
      if (blob) {
        formData.append('file', blob, 'captured-image.png');

        try {
          // Send POST request to the backend server using Axios
          const response = await axios.post('https://19cd-218-146-20-61.ngrok-free.app/start_game2', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
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
      } else {
        console.error('Failed to create Blob for FormData');
      }
    }, 'image/png');
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
      <canvas ref={canvasRef} className="webcam-canvas" style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default WebcamCapture;
