import React from 'react';
import './StartScreen.css'; // CSS 파일 경로를 확인하세요
import logo from './logo.png'; // logo.png 파일을 import 합니다

const StartScreen = ({ onStart }) => {
  return (
    <div id="start-screen" className="start-screen">
      <div className="content">
        <div className="logo-container" onClick={onStart}>
          <img src={logo} alt="마약 예방 교육 센터 로고" className="logo" />
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
