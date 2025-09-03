import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { getCurrentUser, logoutUser } from './api/authService';
import type { User } from './types/types';
import Home from './components/Home';
import Auth from './components/Auth';
import Play from './components/Play';
import Leaderboard from './components/Leaderboard';
import AdminRiddles from './components/AdminRiddles';
import './index.css';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <>
      <header>
        <h1>משחק החידות</h1>
        <nav>
          <Link to="/">ראשי</Link>
          <Link to="/play">שחק</Link>
          <Link to="/leaderboard">לוח תוצאות</Link>
          {currentUser?.role === 'admin' && (
            <Link to="/admin">ניהול חידות</Link>
          )}
          {!currentUser ? (
            <Link to="/auth">כניסה / הרשמה</Link>
          ) : (
            <>
              <span>שלום, {currentUser.username} ({currentUser.role})</span>
              <button onClick={handleLogout}>יציאה</button>
            </>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/play" element={<Play />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          {currentUser?.role === 'admin' && (
            <Route path="/admin" element={<AdminRiddles />} />
          )}
        </Routes>
      </main>
    </>
  );
};

export default App;