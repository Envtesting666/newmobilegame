/**
 * League Selection Screen
 */

import React from 'react';
import { LeagueType } from '../../types';
import '../../styles/screens/LeagueSelection.css';

interface LeagueSelectionProps {
  managerName: string;
  onSelect: (league: LeagueType) => void;
}

const LeagueSelection: React.FC<LeagueSelectionProps> = ({
  managerName,
  onSelect,
}) => {
  return (
    <div className="league-selection-screen">
      <div className="league-selection-content">
        <div className="header">
          <h2>Welcome, {managerName}!</h2>
          <p>Choose Your League</p>
        </div>

        <div className="leagues-grid">
          <div
            className="league-card"
            onClick={() => onSelect('LA_LIGA')}
          >
            <div className="league-flag">🇪🇸</div>
            <h3 className="league-name">La Liga</h3>
            <p className="league-country">Spain</p>
            <div className="league-info">
              <span className="info-item">20 Teams</span>
              <span className="info-item">Season 2024-25</span>
            </div>
            <div className="league-teams">
              <span className="team-badge">RMA</span>
              <span className="team-badge">BAR</span>
              <span className="team-badge">ATM</span>
              <span className="more">+17</span>
            </div>
          </div>

          <div
            className="league-card"
            onClick={() => onSelect('SUPER_LIG')}
          >
            <div className="league-flag">🇹🇷</div>
            <h3 className="league-name">Turkish Süper Lig</h3>
            <p className="league-country">Turkey</p>
            <div className="league-info">
              <span className="info-item">18 Teams</span>
              <span className="info-item">Season 2024-25</span>
            </div>
            <div className="league-teams">
              <span className="team-badge">GS</span>
              <span className="team-badge">FB</span>
              <span className="team-badge">BJK</span>
              <span className="more">+15</span>
            </div>
          </div>
        </div>

        <p className="language-note">
          💬 Commentary language will be automatically set based on league
        </p>
      </div>
    </div>
  );
};

export default LeagueSelection;
