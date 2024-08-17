import React from 'react';
import { Link } from 'react-router-dom';
import './MainScreen.css';

const MainScreen = () => {
  return (
    <div className="main-screen">
      <h1 className="title">💥 대머리 잔디 폭풍 성장 게임 💥</h1>
      <p className="sub-title">대머리의 꿈을 이뤄보세요! 🌱</p>

      <Link to="/screenshot">
        <button className="main-button">🔥 폭풍 성장 시작! 🔥</button>
      </Link>

      {/* 첫 번째 이미지 */}
      <img className="game-image center" src="src/assets/growgrow.jpg" alt="grass 1" />

      {/* 두 번째 이미지 */}
      <img className="game-image right" src="src/assets/growgrow_2.jpg" alt="grass 2" />

      {/* 막 돌아다니는 세 번째 이미지 */}
      <img className="game-image moving" src="src/assets/growgrow_3.png" alt="grass 3" />

      {/* 커졌다 작아졌다 하면서 천천히 돌아다니는 네 번째 이미지 */}
      <img className="game-image roaming" src="src/assets/growgrow_4.png" alt="grass 4" />

      <p className="crazy-text">이건 정말 대머리에게만 허락된 특권입니다! 😱</p>
    </div>
  );
};

export default MainScreen;
