import React, { useState } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../api/authService';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = isLogin ? await loginUser(username, password) : await registerUser(username, password);

    if (success) {
      onAuthSuccess(getCurrentUser());
      navigate('/');
    } else {
      setError(isLogin ? 'Invalid username or password.' : 'Registration failed. The user may already exist.');
    }
  };

  return (
    <div className="container auth-form">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="primary-btn">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button className="link-btn" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Register here." : "Already have an account? Login here."}
      </button>
    </div>
  );
};

export default Auth;
