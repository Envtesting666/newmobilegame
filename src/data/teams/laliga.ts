/**
 * La Liga Teams Data (2024-25 Season)
 * Real teams with current information
 */

import type { Team } from '../../types';

export const REAL_MADRID: Team = {
  id: 'real_madrid',
  name: 'Real Madrid',
  shortName: 'RMA',
  league: 'LA_LIGA',
  overallRating: 89,
  stadium: 'Santiago Bernabéu',
  manager: 'Carlo Ancelotti',
  budget: 150000000,
  reputation: 95,
  chemistry: 85,
  players: [], // Populated separately
  tactics: {
    formation: '4-3-3',
    mentality: 'Attacking',
    buildUpStyle: 'Mixed',
    defensiveLine: 'High',
    width: 'Wide',
    tempo: 'Fast',
    playerRoles: {} as any,
  },
};

export const BARCELONA: Team = {
  id: 'barcelona',
  name: 'FC Barcelona',
  shortName: 'BAR',
  league: 'LA_LIGA',
  overallRating: 87,
  stadium: 'Camp Nou',
  manager: 'Xavi Hernández',
  budget: 80000000,
  reputation: 94,
  chemistry: 82,
  players: [],
  tactics: {
    formation: '4-3-3',
    mentality: 'Attacking',
    buildUpStyle: 'ShortPassing',
    defensiveLine: 'High',
    width: 'Wide',
    tempo: 'Fast',
    playerRoles: {} as any,
  },
};

export const ATLETICO_MADRID: Team = {
  id: 'atletico_madrid',
  name: 'Atlético Madrid',
  shortName: 'ATM',
  league: 'LA_LIGA',
  overallRating: 86,
  stadium: 'Cívitas Metropolitano',
  manager: 'Diego Simeone',
  budget: 100000000,
  reputation: 88,
  chemistry: 88,
  players: [],
  tactics: {
    formation: '3-5-2',
    mentality: 'Balanced',
    buildUpStyle: 'CounterAttack',
    defensiveLine: 'Deep',
    width: 'Balanced',
    tempo: 'Normal',
    playerRoles: {} as any,
  },
};

export const REAL_SOCIEDAD: Team = {
  id: 'real_sociedad',
  name: 'Real Sociedad',
  shortName: 'RSO',
  league: 'LA_LIGA',
  overallRating: 82,
  stadium: 'Reale Arena',
  manager: 'Imanol Alguacil',
  budget: 45000000,
  reputation: 78,
  chemistry: 84,
  players: [],
  tactics: {
    formation: '4-2-3-1',
    mentality: 'Balanced',
    buildUpStyle: 'ShortPassing',
    defensiveLine: 'Normal',
    width: 'Wide',
    tempo: 'Fast',
    playerRoles: {} as any,
  },
};

export const ATHLETIC_BILBAO: Team = {
  id: 'athletic_bilbao',
  name: 'Athletic Club',
  shortName: 'ATH',
  league: 'LA_LIGA',
  overallRating: 81,
  stadium: 'San Mamés',
  manager: 'Ernesto Valverde',
  budget: 40000000,
  reputation: 76,
  chemistry: 86,
  players: [],
  tactics: {
    formation: '4-4-2',
    mentality: 'Attacking',
    buildUpStyle: 'Mixed',
    defensiveLine: 'Normal',
    width: 'Balanced',
    tempo: 'Fast',
    playerRoles: {} as any,
  },
};

export const VILLARREAL: Team = {
  id: 'villarreal',
  name: 'Villarreal CF',
  shortName: 'VIL',
  league: 'LA_LIGA',
  overallRating: 81,
  stadium: 'Estadio de la Cerámica',
  manager: 'Marcelino García Toral',
  budget: 50000000,
  reputation: 77,
  chemistry: 80,
  players: [],
  tactics: {
    formation: '4-4-2',
    mentality: 'Balanced',
    buildUpStyle: 'Mixed',
    defensiveLine: 'Normal',
    width: 'Balanced',
    tempo: 'Normal',
    playerRoles: {} as any,
  },
};

export const SEVILLA: Team = {
  id: 'sevilla',
  name: 'Sevilla FC',
  shortName: 'SEV',
  league: 'LA_LIGA',
  overallRating: 80,
  stadium: 'Ramón Sánchez Pizjuán',
  manager: 'Quique Sánchez Flores',
  budget: 45000000,
  reputation: 79,
  chemistry: 75,
  players: [],
  tactics: {
    formation: '4-3-3',
    mentality: 'Balanced',
    buildUpStyle: 'Mixed',
    defensiveLine: 'Normal',
    width: 'Wide',
    tempo: 'Normal',
    playerRoles: {} as any,
  },
};

export const REAL_BETIS: Team = {
  id: 'real_betis',
  name: 'Real Betis',
  shortName: 'BET',
  league: 'LA_LIGA',
  overallRating: 80,
  stadium: 'Benito Villamarín',
  manager: 'Manuel Pellegrini',
  budget: 42000000,
  reputation: 75,
  chemistry: 81,
  players: [],
  tactics: {
    formation: '4-2-3-1',
    mentality: 'Attacking',
    buildUpStyle: 'ShortPassing',
    defensiveLine: 'High',
    width: 'Wide',
    tempo: 'Fast',
    playerRoles: {} as any,
  },
};

export const VALENCIA: Team = {
  id: 'valencia',
  name: 'Valencia CF',
  shortName: 'VAL',
  league: 'LA_LIGA',
  overallRating: 79,
  stadium: 'Mestalla',
  manager: 'Rubén Baraja',
  budget: 35000000,
  reputation: 77,
  chemistry: 73,
  players: [],
  tactics: {
    formation: '4-4-2',
    mentality: 'Balanced',
    buildUpStyle: 'Mixed',
    defensiveLine: 'Normal',
    width: 'Balanced',
    tempo: 'Normal',
    playerRoles: {} as any,
  },
};

export const GIRONA: Team = {
  id: 'girona',
  name: 'Girona FC',
  shortName: 'GIR',
  league: 'LA_LIGA',
  overallRating: 78,
  stadium: 'Estadi Montilivi',
  manager: 'Míchel',
  budget: 30000000,
  reputation: 70,
  chemistry: 83,
  players: [],
  tactics: {
    formation: '4-2-3-1',
    mentality: 'Attacking',
    buildUpStyle: 'Mixed',
    defensiveLine: 'High',
    width: 'Wide',
    tempo: 'Fast',
    playerRoles: {} as any,
  },
};

// Export all La Liga teams
export const LA_LIGA_TEAMS: Team[] = [
  REAL_MADRID,
  BARCELONA,
  ATLETICO_MADRID,
  REAL_SOCIEDAD,
  ATHLETIC_BILBAO,
  VILLARREAL,
  SEVILLA,
  REAL_BETIS,
  VALENCIA,
  GIRONA,
];

export default LA_LIGA_TEAMS;
