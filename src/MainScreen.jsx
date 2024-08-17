import React from 'react';
import { Link } from 'react-router-dom';
import './MainScreen.css';

const MainScreen = () => {
  return (
    <div className="main-screen">
      <h1>대머리 잔디 키우기 게임</h1>
        <p>대머리를 키워보세요!</p>
        <img src="src/assets/growgrow.jpg" alt="grass" />
      <Link to="/screenshot">
        <button>Game Start</button>
      </Link>
    </div>
  );
};

export default MainScreen;
