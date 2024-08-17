import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FinishPage.css';

const FinishPage = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [imageBase64, setImageBase64] = useState(null);
    const [filterImage, setFilterImage] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const filterImgRef = useRef(null); // Reference to the filter image for displaying on top of video

    const location = useLocation();

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
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Draw the video frame
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Draw the filter image on top
        if (filterImgRef.current) {
            context.drawImage(filterImgRef.current, 0, 0, canvas.width, canvas.height);
        }

        // Save the captured image as base64
        const base64Image = canvas.toDataURL('image/png');
        setImageBase64(base64Image);
        stopCamera();
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'FilteredScreenshot.png';
        link.click();
    };

    useEffect(() => {
        // Replace with the final image URL you passed from GamePage
        const finalImage = location.state.finalImage;
        console.log('Final Image:', finalImage);
        setFilterImage(finalImage);

        // Create an image element for the filter image
        const img = new Image();
        img.src = finalImage;
        img.onload = () => {
            filterImgRef.current = img;
        };
    }, [location.state.finalImage]);

    return (
        <div className="wrapper">
            <div className="game-name">
                자라나라 잔디 잔디~
            </div>
            <div className="finish-container">
                <div className="webcam-section">
                    <video ref={videoRef} className="webcam-video" autoPlay playsInline></video>
                    <button onClick={startCamera} className="webcam-button">
                        Start Camera
                    </button>
                    {isStreaming && (
                        <>
                            <button onClick={captureImage} className="webcam-button">
                                Capture Image
                            </button>
                        </>
                    )}
                </div>
                <canvas ref={canvasRef} className="finish-canvas"></canvas>
                {imageBase64 && (
                    <>
                        <button onClick={handleSave} className="save-button">
                            Save Screenshot
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FinishPage;
