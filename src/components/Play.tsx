import React, { useState, useEffect } from 'react';
import { loadRiddles, updatePlayerTime } from '../api/riddleService';
import { getCurrentUser } from '../api/authService';
import { Riddle } from '../types';

type Difficulty = 'easy' | 'medium' | 'hard';

const Play: React.FC = () => {
  const [allRiddles, setAllRiddles] = useState<Riddle[] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [filteredRiddles, setFilteredRiddles] = useState<Riddle[]>([]);
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const currentUser = getCurrentUser();
  const isUserOrAdmin = currentUser && (currentUser.role === 'user' || currentUser.role === 'admin');

  useEffect(() => {
    const fetchRiddles = async () => {
      const riddles = await loadRiddles();
      setAllRiddles(riddles);
    };
    fetchRiddles();
  }, []);

  useEffect(() => {
    if (difficulty && allRiddles) {
      setFilteredRiddles(allRiddles.filter(r => r.difficulty === difficulty));
      setCurrentRiddleIndex(0);
      setIsGameActive(true);
      setStartTime(Date.now());
      setTotalTime(0);
      setMessage('');
    }
  }, [difficulty, allRiddles]);

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGameActive) return;

    const currentRiddle = filteredRiddles[currentRiddleIndex];
    if (userAnswer.trim().toLowerCase() === currentRiddle.correctAnswer.trim().toLowerCase()) {
      const timeTaken = (Date.now() - startTime) / 1000;
      setTotalTime(prev => prev + timeTaken);
      
      if (currentRiddleIndex + 1 < filteredRiddles.length) {
        setMessage('נכון! עובר לחידה הבאה...');
        setTimeout(() => {
          setCurrentRiddleIndex(currentRiddleIndex + 1);
          setUserAnswer('');
          setMessage('');
          setStartTime(Date.now());
        }, 1000);
      } else {
        setMessage('כל הכבוד! סיימת את המשחק!');
        setIsGameActive(false);
        saveScore();
      }
    } else {
      setMessage('טעות. נסה שוב.');
    }
  };

  const saveScore = async () => {
    if (isUserOrAdmin && difficulty) {
      await updatePlayerTime(currentUser.username, difficulty, totalTime);
      alert('התוצאה נשמרה בלוח התוצאות!');
    }
  };

  const renderRiddle = () => {
    const riddle = filteredRiddles[currentRiddleIndex];
    if (!riddle) return <p>אין חידות בקטגוריה זו.</p>;

    return (
      <div className="riddle-card">
        <h3>{riddle.name}</h3>
        <p>{riddle.taskDescription}</p>
        <form onSubmit={handleAnswerSubmit}>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="הקלד את תשובתך..."
            autoFocus
          />
          <button type="submit">שלח</button>
        </form>
        {message && <p className="status-message">{message}</p>}
      </div>
    );
  };

  if (!isGameActive) {
    return (
      <div className="container play-menu">
        <h2>בחר רמת קושי</h2>
        <div className="button-group">
          <button onClick={() => setDifficulty('easy')}>קל</button>
          <button onClick={() => setDifficulty('medium')}>בינוני</button>
          <button onClick={() => setDifficulty('hard')}>קשה</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container play-page">
      <h2>משחק פעיל ({difficulty})</h2>
      {renderRiddle()}
    </div>
  );
};

export default Play;