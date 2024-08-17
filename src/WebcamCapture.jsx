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
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setImage(url);
        stopCamera();
      }
    });
  };

  const goToNextStage = async () => {
    const formData = new FormData();

    // Upscale the image before sending it to the backend
    upscaleImage(canvasRef.current, 900, 900) // Example: upscale to 800x600
      .then(async (upscaledBlob) => {
        if (upscaledBlob) {
          formData.append('file', upscaledBlob, 'upscaled-image.png');

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
            const baseImage = data.bald_image;

            if (response.status === 200) {
              console.log('Image successfully sent to the server');
              // Navigate to the /game page with state
              navigate('/game', { state: { userId: `${userId}`, baseImage: `${baseImage}` } });
            } else {
              console.error('Failed to upload image');
            }
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        } else {
          console.error('Failed to create upscaled Blob');
        }
      });
  };

  // Function to upscale the image using a new canvas
  const upscaleImage = (canvas, targetWidth, targetHeight) => {
    return new Promise((resolve) => {
      const upscaledCanvas = document.createElement('canvas');
      upscaledCanvas.width = targetWidth;
      upscaledCanvas.height = targetHeight;
      const context = upscaledCanvas.getContext('2d');

      // Draw the original image onto the upscaled canvas with the new dimensions
      context.drawImage(canvas, 0, 0, targetWidth, targetHeight);

      // Convert the upscaled canvas to Blob
      upscaledCanvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  };

  return (
    <div className="webcam-container">
      {!image && (
        <>
          <div className="video-wrapper">
            <video ref={videoRef} className="webcam-video" autoPlay playsInline></video>
            {/* 회전하는 이미지 추가 */}
            {isStreaming && (
              <>
                <img src="src/assets/growgrow_3.png" alt="grass 3" className="rotating-image left" />
                <img src="src/assets/growgrow_4.png" alt="grass 4" className="rotating-image right" />
                <img src="src/assets/octopus-dance.gif" alt="octopus" className="octopus-gif" />
              </>
            )}
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
