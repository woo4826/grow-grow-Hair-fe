import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FinishPage.css';

const FinishPage = () => {
    const [filterImage, setFilterImage] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Retrieve the final image URL passed from the GamePage
        const finalImage = location.state.finalImage;
        console.log('Final Image:', finalImage);
        setFilterImage(finalImage);
    }, [location.state.finalImage]);

    return (
        <div className="wrapper">
            <div className="game-name">
                자라나라 잔디 잔디~
            </div>
            <div className="image-container">
                {filterImage && (
                    <img src={filterImage} alt="Final Filtered Image" className="final-image" />
                )}
            </div>
        </div>
    );
};

export default FinishPage;
