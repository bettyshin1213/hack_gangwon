import React from 'react';
import './Header.css';
import logo from './logo.png'; // logo 이미지 import

function Header({ showQuizButton, onQuizClick, onHomeClick }) {
  return (
    <header className="App-header">
      <img 
        src={logo} 
        alt="로고" 
        onClick={onHomeClick} 
        style={{
          cursor: 'pointer',
          height: '50px',
          width: '170px',  // 원하는 너비
        }} 
      />
      {showQuizButton && (
        <button className="header-button" onClick={onQuizClick}>
          퀴즈 풀기
        </button>
      )}
    </header>
  );
}

export default Header;
