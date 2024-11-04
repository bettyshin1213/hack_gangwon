import React, { useState, useEffect } from 'react';
import './Quiz.css';

const quizData = [
  {
    question: "메트암페타민과 암페타민의 차이점은 무엇인가요?",
    options: [
      "메트암페타민은 비의료적 사용이 많고, 암페타민은 의료용으로 주로 사용된다.",
      "메트암페타민은 낮은 중독성을 가지며, 암페타민은 높은 중독성을 가진다.",
      "메트암페타민은 항상 합법이며, 암페타민은 불법이다.",
      "메트암페타민과 암페타민은 동일한 화학 구조를 가진다."
    ],
    correctAnswer: 0
  },
  {
    question: "마약류 관리법에 따라 마약류의 소지 및 유통을 금지하는 이유는 무엇인가요?",
    options: [
      "마약류가 일반 의약품과 유사하게 사용될 수 있기 때문에",
      "마약류가 중독성과 건강에 해로운 영향을 미칠 수 있기 때문에",
      "마약류가 모든 연령대에서 안전하게 사용될 수 있기 때문에",
      "마약류가 사회적으로 긍정적인 영향을 미칠 수 있기 때문에"
    ],
    correctAnswer: 1
  },
  {
    question: "마약류의 정의에 포함되지 않는 것은 무엇인가요?",
    options: [
      "대마와 그 추출물",
      "마약 성분이 포함된 진통제",
      "향정신성의약품과 그 제조물",
      "일반 의약품에 사용되는 비타민"
    ],
    correctAnswer: 3
  },
  {
    question: "의료용 마약류의 올바른 사용에 대한 올바른 기준은 무엇인가요?",
    options: [
      "개인의 필요에 따라 자유롭게 사용하기",
      "처방받지 않은 경우에도 사용하는 것 허용",
      "반드시 필요한 경우에만 사용하기",
      "마약류를 안전하게 보관하는 것이 우선"
    ],
    correctAnswer: 2
  },
  {
    question: "마약 예방 교육을 위한 효과적인 가족 자조 모임의 주요 목적은 무엇인가요?",
    options: [
      "법적 처벌의 강화",
      "약물 사용에 대한 정보 제공",
      "사회적 낙인을 증가시키기",
      "약물 남용의 위험성 무시하기"
    ],
    correctAnswer: 1
  },
  {
    question: "다음 중 대마초가 뇌에서 유발하는 주요한 효과가 아닌 것은 무엇인가요?",
    options: [
      "목적지향적 활동 감소",
      "장기 기억과 공간 개념 향상",
      "감정적 행동 변화",
      "쾌락 경험 증가"
    ],
    correctAnswer: 2
  },
  {
    question: "청소년들이 마약 사용을 예방하기 위해 알아야 할 가장 중요한 이유는 무엇인가요?",
    options: [
        "마약은 단기적으로 기분을 좋게 한다.",
        "마약 사용은 건강과 안전에 심각한 위험을 초래할 수 있다.",
        "마약은 사회적 인정을 받을 수 있는 방법이다.",
        "모든 사람들이 마약을 사용하기 때문에 괜찮다."
    ],
    correctAnswer: 2
  },
  {
    question: "흡연이 어린이와 청소년에게 미치는 영향으로 올바르지 않은 것은 무엇인가요?",
    options: [
        "폐 기능 저하",
        "뇌 발달에 부정적인 영향",
        "체중 증가",
        "심혈관 질환 위험 증가"
    ],
    correctAnswer: 3
  },
  {

    "question": "청소년들이 마약 사용을 예방하기 위해 알아야 할 가장 중요한 이유는 무엇인가요?",
    "options": [
        "마약은 단기적으로 기분을 좋게 한다.",
        "마약 사용은 건강과 안전에 심각한 위험을 초래할 수 있다.",
        "마약은 사회적 인정을 받을 수 있는 방법이다.",
        "모든 사람들이 마약을 사용하기 때문에 괜찮다."
    ],
    correctAnswer: 2
  }

];

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  }, []);

  const handleAnswerClick = (selectedAnswerIndex) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswer;

    setSelectedAnswer(selectedAnswerIndex);
    setAnswerStatus(isCorrect ? '정답입니다!' : '틀렸습니다.');
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setAnswerStatus(null);
      setSelectedAnswer(null);
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
      } else {
        setShowScore(true);
      }
    }, 2000);
  };

  const restartQuiz = () => {
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  if (questions.length === 0) {
    return <div>퀴즈를 불러오는 중...</div>;
  }

  return (
    <div className="quiz-container">
      {showScore ? (
        <div className="score-section">
          <div className="score-text">당신의 점수: {score} / {questions.length}</div>
          <button className="restart-button" onClick={restartQuiz}>다시 시작</button>
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>질문 {currentQuestionIndex + 1}</span>/{questions.length}
            </div>
            <div className="question-text">{questions[currentQuestionIndex].question}</div>
          </div>
          <div className="answer-section">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button 
                key={index} 
                onClick={() => handleAnswerClick(index)} 
                disabled={selectedAnswer !== null}
                className={
                  selectedAnswer !== null
                    ? index === questions[currentQuestionIndex].correctAnswer
                      ? 'correct'
                      : index === selectedAnswer
                      ? 'incorrect'
                      : ''
                    : ''
                }
              >
                {option}
              </button>
            ))}
          </div>
          {answerStatus && <div className="answer-status">{answerStatus}</div>}
        </>
      )}
    </div>
  );
}

export default Quiz;
