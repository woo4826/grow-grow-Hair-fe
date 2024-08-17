import React from 'react';
import './FinishPage.css';

import { useLocation } from 'react-router-dom';

const FinishPage = () => {
    const location = useLocation();
    const finalImage = location.state.finalImage;
    console.log('Final Image:', finalImage);


    return (
        <div className="wrapper">
            <div className="game-name">
                자라나라 잔디 잔디~
            </div>
            <img src={finalImage} alt="final" />
        </div>
    );
};

export default FinishPage;
