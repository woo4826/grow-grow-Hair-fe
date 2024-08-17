import React, { useRef, useState } from 'react';
import { saveAs } from 'file-saver';

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [image, setImage] = useState(null);

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
        stopCamera(); // Stop the camera after capturing
      }
    });
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      {!isStreaming && !image && <button onClick={startCamera}>Start Camera</button>}
      {isStreaming && <button onClick={captureImage}>Capture Image</button>}
      {image && <button onClick={() => setImage(null)}>Retake Photo</button>}
      {image && <img src={image} alt="Captured" />}
    </div>
  );
};

export default WebcamCapture;
