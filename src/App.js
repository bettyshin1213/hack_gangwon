import React, { useState, useEffect } from 'react';
import './App.css';
import Quiz from './Quiz';
import Header from './Header';
import StartScreen from './StartScreen';
import { FullPageChat } from "flowise-embed-react";
import data from './functions/newsData.json';
import { useTranslation } from 'react-i18next';
import './i18n';  // 방금 만든 i18n 설정 파일을 import

function App() {
  const [started, setStarted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [articles, setArticles] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setArticles(data); // Data.json의 내용을 articles 상태에 설정합니다.
  }, []);

  const handleStart = () => {
    setStarted(true);
  };

  const handleHomeClick = () => {
    setShowQuiz(false);
  };

  if (!started) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div className="App">
      <Header 
        showQuizButton={!showQuiz} 
        onQuizClick={() => setShowQuiz(true)} 
        onHomeClick={handleHomeClick}
      />
      <main className="App-main">
        {showQuiz ? (
          <Quiz />
        ) : (
          <div className="content-container">
            <section className="chatbot-section">
              <div className="chat-container">
                <FullPageChat
                  chatflowid="bf97e04d-7f6e-4500-b490-e4ee644f9526"
                  initialMessage={t("Hello! Do you have any questions about drugs?")}
                  apiHost="https://flow.edutrack.kr"
                  theme={{
                    chatWindow: {
                      width: '100%',
                      height: '100%',
                      containerWidth: '100%',
                      containerHeight: '100%',
                    }
                  }}
                  defaultLanguage="ko"
                />
              </div>
            </section>
            <section className="news-section">
              <h2>관련 뉴스</h2>
              <div className="article-container">
                <div className="article-scroll">
                  {articles.map((article, index) => (
                    <article key={index} className="news-article">
                      <h3 onClick={() => window.open(article.url, '_blank')} style={{cursor: 'pointer'}}>
                        {article.title}
                      </h3>
                      <p style={{fontSize: '0.9em'}}>{article.summary}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      <footer className="App-footer">
        <p>© 2024 DND 1.0 All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
