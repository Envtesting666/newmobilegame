/**
 * Welcome Screen - Manager Name Input
 */

import React, { useState } from 'react';
import '../../styles/screens/WelcomeScreen.css';

interface WelcomeScreenProps {
  onSubmit: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      setError('Manager name must be at least 2 characters');
      return;
    }

    if (name.trim().length > 30) {
      setError('Manager name must be less than 30 characters');
      return;
    }

    onSubmit(name.trim());
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="logo-section">
          <div className="logo">⚽</div>
          <h1 className="title">Football Manager AI</h1>
          <p className="subtitle">Dynamic LLM-Powered Simulation</p>
        </div>

        <form className="name-input-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="manager-name">Enter Your Name</label>
            <input
              id="manager-name"
              type="text"
              placeholder="Manager Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              autoFocus
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button type="submit" className="primary-button">
            Start Career
          </button>
        </form>

        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <span className="feature-text">AI-Powered Gameplay</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎙️</span>
            <span className="feature-text">Live Commentary</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <span className="feature-text">Dynamic Social Media</span>
          </div>
        </div>

        <p className="powered-by">Powered by Google Gemini AI</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
