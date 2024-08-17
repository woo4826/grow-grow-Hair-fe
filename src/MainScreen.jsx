import React from 'react';
import { Link } from 'react-router-dom';
import './MainScreen.css';

const MainScreen = () => {
  return (
    <div className="main-screen">
      <h1>대머리 잔디 키우기 게임</h1>
        <p>대머리를 키워보세요!</p>
        <img src="https://cdn.pixabay.com/photo/2016/11/21/17/17/barber-1845906_960_720.jpg" alt="grass" />
      <Link to="/screenshot">
        <button>Game Start</button>
      </Link>
    </div>
  );
};

export default MainScreen;
