import React, { useState, useEffect } from 'react';
import { loadRiddles, updatePlayerTime } from '../api/riddleService';
import { getCurrentUser } from '../api/authService';
import type { Riddle } from '../types/types';

type Difficulty = 'easy' | 'medium' | 'hard' | 'all';

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
  const isUserOrAdmin = true;

  useEffect(() => {
    const fetchRiddles = async () => {
      const riddles = await loadRiddles();
      setAllRiddles(riddles);
    };
    fetchRiddles();
  }, []);

  useEffect(() => {
    if (difficulty && allRiddles) {
      const riddlesToPlay =
        difficulty === 'all'
          ? allRiddles
          : allRiddles.filter((r) => r.difficulty === difficulty);

      setFilteredRiddles(riddlesToPlay);
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
    if (
      userAnswer.trim().toLowerCase() ===
      currentRiddle.correctAnswer.trim().toLowerCase()
    ) {
      const timeTaken = (Date.now() - startTime) / 1000;
      setTotalTime((prev) => prev + timeTaken);

      if (currentRiddleIndex + 1 < filteredRiddles.length) {
        setMessage('Correct! Moving to the next riddle...');
        setTimeout(() => {
          setCurrentRiddleIndex(currentRiddleIndex + 1);
          setUserAnswer('');
          setMessage('');
          setStartTime(Date.now());
        }, 1000);
      } else {
        setMessage('Well done! You finished the game!');
        setIsGameActive(false);
        saveScore();
      }
    } else {
      setMessage('Incorrect. Try again.');
    }
  };

  const saveScore = async () => {
    if (isUserOrAdmin && difficulty && difficulty !== 'all' && currentUser) {
      await updatePlayerTime(currentUser.username, difficulty, totalTime);
      alert('Your score has been saved to the leaderboard!');
    }
  };

  const renderRiddle = () => {
    const riddle = filteredRiddles[currentRiddleIndex];
    if (!riddle) return <p>No riddles available for this category.</p>;

    return (
      <div className="riddle-card">
        <h3>{riddle.name}</h3>
        <p>{riddle.taskDescription}</p>
        <form onSubmit={handleAnswerSubmit}>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer..."
            autoFocus
          />
          <button type="submit">Submit</button>
        </form>
        {message && <p className="status-message">{message}</p>}
      </div>
    );
  };

  if (!isGameActive) {
    return (
      <div className="container play-menu">
        <h2>Select difficulty</h2>
        <div className="button-group">
          <button onClick={() => setDifficulty('all')}>All riddles</button>
          <button onClick={() => setDifficulty('easy')}>Easy</button>
          <button onClick={() => setDifficulty('medium')}>Medium</button>
          <button onClick={() => setDifficulty('hard')}>Hard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container play-page">
      <h2>Active game ({difficulty})</h2>
      {renderRiddle()}
    </div>
  );
};

export default Play;
