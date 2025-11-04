/**
 * Data Exports
 * Centralized export for all game data
 */

// Leagues
export { LEAGUES, LA_LIGA, SUPER_LIG } from './leagues';

// Teams
export { LA_LIGA_TEAMS } from './teams/laliga';
export { SUPER_LIG_TEAMS } from './teams/superlig';

// Players
export { REAL_MADRID_PLAYERS } from './players/realMadridPlayers';
export { GALATASARAY_PLAYERS } from './players/galatasarayPlayers';

// Helper function to get team by ID
export const getTeamById = (teamId: string) => {
  const allTeams = [...require('./teams/laliga').LA_LIGA_TEAMS, ...require('./teams/superlig').SUPER_LIG_TEAMS];
  return allTeams.find(team => team.id === teamId);
};

// Helper function to populate team players
export const populateTeamPlayers = (team: any) => {
  if (team.id === 'real_madrid') {
    return { ...team, players: require('./players/realMadridPlayers').REAL_MADRID_PLAYERS };
  } else if (team.id === 'galatasaray') {
    return { ...team, players: require('./players/galatasarayPlayers').GALATASARAY_PLAYERS };
  }
  // For other teams, return empty players array (to be populated later)
  return { ...team, players: [] };
};
