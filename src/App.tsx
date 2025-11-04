/**
 * Main Application Component
 * Handles routing and game state management
 */

import React, { useState } from 'react';
import './styles/App.css';
import { GameState, LeagueType, Team } from './types';
import WelcomeScreen from './components/screens/WelcomeScreen';
import LeagueSelection from './components/screens/LeagueSelection';
import TeamSelection from './components/screens/TeamSelection';
import HomeScreen from './components/screens/HomeScreen';
import { LA_LIGA_TEAMS } from './data/teams/laliga';
import { SUPER_LIG_TEAMS } from './data/teams/superlig';

type GameFlow = 'welcome' | 'league-select' | 'team-select' | 'home';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameFlow>('welcome');
  const [managerName, setManagerName] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState<LeagueType | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleNameSubmit = (name: string) => {
    setManagerName(name);
    setCurrentScreen('league-select');
  };

  const handleLeagueSelect = (league: LeagueType) => {
    setSelectedLeague(league);
    setCurrentScreen('team-select');
  };

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);

    // Initialize game state
    const initialGameState: GameState = {
      managerName,
      currentTeam: team,
      currentLeague: {
        id: selectedLeague!,
        name: selectedLeague === 'LA_LIGA' ? 'La Liga' : 'Turkish Süper Lig',
        country: selectedLeague === 'LA_LIGA' ? 'Spain' : 'Turkey',
        season: '2024-25',
        defaultLanguage: selectedLeague === 'LA_LIGA' ? 'en' : 'tr',
        teams: selectedLeague === 'LA_LIGA' ? LA_LIGA_TEAMS : SUPER_LIG_TEAMS,
      },
      season: '2024-25',
      currentDate: new Date('2024-08-01'),
      matchday: 1,
      standings: [],
      budget: team.budget,
      reputation: 50,
      boardExpectations: [
        {
          type: 'LeaguePosition',
          target: 'Finish Top 4',
          status: 'OnTrack',
          importance: 'High',
        },
      ],
      careerStats: {
        matchesManaged: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        winPercentage: 0,
        trophiesWon: 0,
        reputation: 50,
        specialties: {
          youthDevelopment: 5,
          tacticalKnowledge: 5,
          manManagement: 5,
          transferMarket: 5,
        },
      },
      saveDate: new Date(),
    };

    setGameState(initialGameState);
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onSubmit={handleNameSubmit} />;
      case 'league-select':
        return (
          <LeagueSelection
            managerName={managerName}
            onSelect={handleLeagueSelect}
          />
        );
      case 'team-select':
        return (
          <TeamSelection
            league={selectedLeague!}
            onSelect={handleTeamSelect}
          />
        );
      case 'home':
        return gameState ? <HomeScreen gameState={gameState} /> : null;
      default:
        return <WelcomeScreen onSubmit={handleNameSubmit} />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;
