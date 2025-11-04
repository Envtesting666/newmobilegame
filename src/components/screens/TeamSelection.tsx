/**
 * Team Selection Screen
 */

import React from 'react';
import { LeagueType, Team } from '../../types';
import { LA_LIGA_TEAMS } from '../../data/teams/laliga';
import { SUPER_LIG_TEAMS } from '../../data/teams/superlig';
import '../../styles/screens/TeamSelection.css';

interface TeamSelectionProps {
  league: LeagueType;
  onSelect: (team: Team) => void;
}

const TeamSelection: React.FC<TeamSelectionProps> = ({ league, onSelect }) => {
  const teams = league === 'LA_LIGA' ? LA_LIGA_TEAMS : SUPER_LIG_TEAMS;
  const leagueName = league === 'LA_LIGA' ? 'La Liga' : 'Turkish Süper Lig';

  return (
    <div className="team-selection-screen">
      <div className="team-selection-content">
        <div className="header">
          <h2>{leagueName}</h2>
          <p>Select Your Team</p>
        </div>

        <div className="teams-grid">
          {teams.map((team) => (
            <div
              key={team.id}
              className="team-card"
              onClick={() => onSelect(team)}
            >
              <div className="team-header">
                <div className="team-badge">{team.shortName}</div>
                <div className="team-rating">{team.overallRating}</div>
              </div>
              <h3 className="team-name">{team.name}</h3>
              <div className="team-details">
                <div className="detail-item">
                  <span className="detail-label">Manager</span>
                  <span className="detail-value">{team.manager}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Stadium</span>
                  <span className="detail-value">{team.stadium}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Budget</span>
                  <span className="detail-value">
                    €{(team.budget / 1000000).toFixed(0)}M
                  </span>
                </div>
              </div>
              <div className="team-stats">
                <div className="stat">
                  <span className="stat-label">Reputation</span>
                  <div className="stat-bar">
                    <div
                      className="stat-fill"
                      style={{ width: `${team.reputation}%` }}
                    />
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-label">Chemistry</span>
                  <div className="stat-bar">
                    <div
                      className="stat-fill chemistry"
                      style={{ width: `${team.chemistry}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSelection;
