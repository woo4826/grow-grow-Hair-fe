import React from 'react';
import { Link } from 'react-router-dom';
import './MainScreen.css';

const MainScreen = () => {
  return (
    <div className="main-screen">
      <h1 className="title">대머리 잔디 키우기 게임</h1>
      <p className="sub-title">대머리를 키워보세요!</p>
      <img className="game-image" src="src/assets/growgrow.jpg" alt="grass" />

      <Link to="/screenshot">
        <button className="main-button">Game Start</button>
      </Link>
    </div>
  );
};

export default MainScreen;
