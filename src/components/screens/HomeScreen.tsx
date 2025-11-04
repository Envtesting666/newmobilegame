/**
 * Home Screen - Main Game Hub
 */

import React from 'react';
import { GameState } from '../../types';
import '../../styles/screens/HomeScreen.css';

interface HomeScreenProps {
  gameState: GameState;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ gameState }) => {
  return (
    <div className="home-screen">
      <header className="top-bar">
        <div className="manager-info">
          <span className="manager-name">{gameState.managerName}</span>
          <span className="team-name">{gameState.currentTeam.name}</span>
        </div>
        <div className="date-info">
          <span>{gameState.currentDate.toLocaleDateString()}</span>
          <span>Matchday {gameState.matchday}</span>
        </div>
      </header>

      <div className="home-content">
        <section className="next-match-card card">
          <h2>📊 Next Match</h2>
          <div className="match-preview">
            <p className="coming-soon">Match scheduling coming soon!</p>
            <p className="placeholder-text">
              Your next opponent will be displayed here
            </p>
          </div>
          <div className="match-actions">
            <button className="primary-button">Team Sheet</button>
            <button className="secondary-button">Press Conference</button>
          </div>
        </section>

        <section className="twitter-feed-card card">
          <h2>📱 Latest News</h2>
          <div className="feed-placeholder">
            <p>Twitter/X feed coming soon!</p>
            <p className="placeholder-text">
              Live updates and reactions will appear here
            </p>
          </div>
        </section>

        <section className="league-table-card card">
          <h2>🏆 League Table</h2>
          <div className="table-preview">
            <div className="table-row">
              <span className="position">1.</span>
              <span className="team-name">Sample Team 1</span>
              <span className="points">Pts: 72</span>
            </div>
            <div className="table-row highlight">
              <span className="position">2.</span>
              <span className="team-name">{gameState.currentTeam.shortName}</span>
              <span className="points">Pts: 70 ⬆</span>
            </div>
            <div className="table-row">
              <span className="position">3.</span>
              <span className="team-name">Sample Team 2</span>
              <span className="points">Pts: 68</span>
            </div>
          </div>
        </section>

        <section className="career-stats-card card">
          <h2>📈 Career Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Matches</span>
              <span className="stat-value">
                {gameState.careerStats.matchesManaged}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Win %</span>
              <span className="stat-value">
                {gameState.careerStats.winPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Reputation</span>
              <span className="stat-value">{gameState.reputation}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Trophies</span>
              <span className="stat-value">
                {gameState.careerStats.trophiesWon}
              </span>
            </div>
          </div>
        </section>
      </div>

      <nav className="bottom-nav">
        <button className="nav-button active">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>
        <button className="nav-button">
          <span className="nav-icon">👥</span>
          <span className="nav-label">Squad</span>
        </button>
        <button className="nav-button">
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Tactics</span>
        </button>
        <button className="nav-button">
          <span className="nav-icon">💰</span>
          <span className="nav-label">Transfers</span>
        </button>
      </nav>
    </div>
  );
};

export default HomeScreen;
