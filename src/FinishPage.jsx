import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FinishPage.css';
import hanImage from './assets/han.jpeg';

const FinishPage = () => {
    const [filterImage, setFilterImage] = useState(null);
    const [showFlash, setShowFlash] = useState(false);
    const [showFinish, setShowFinish] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const finalImage = location.state?.finalImage || hanImage;
        setFilterImage(finalImage);

        const flashTimer = setTimeout(() => {
            setShowFlash(true);
        }, 3000); // 3초 후 섬광 효과 표시

        const finishTimer = setTimeout(() => {
            setShowFinish(true);
        }, 3000); // 3.5초 후 "Finish" 텍스트 표시

        return () => {
            clearTimeout(flashTimer);
            clearTimeout(finishTimer);
        };
    }, [location.state]);

    return (
        <div className="wrapper">
            <div className="game-name">
                자라나라 잔디 잔디~
            </div>
            <div className="image-container">
                {filterImage && (
                    <img src={filterImage} alt="Final Filtered Image" className="final-image" />
                )}
                {showFlash && <div className="flash-effect"></div>}
            </div>
            {showFinish && <div className="finish-text">
                    <img src={hanImage} width="3500px" height="3200px"/>
                </div>}
        </div>
    );
};

export default FinishPage;