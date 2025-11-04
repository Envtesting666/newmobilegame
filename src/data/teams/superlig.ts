/**
 * Turkish Süper Lig Teams Data (2024-25 Season)
 * Real teams with current information
 */

import type { Team } from '../../types';

export const GALATASARAY: Team = {
  id: 'galatasaray',
  name: 'Galatasaray SK',
  shortName: 'GS',
  league: 'SUPER_LIG',
  overallRating: 84,
  stadium: 'Türk Telekom Stadium',
  manager: 'Okan Buruk',
  budget: 60000000,
  reputation: 82,
  chemistry: 88,
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

export const FENERBAHCE: Team = {
  id: 'fenerbahce',
  name: 'Fenerbahçe SK',
  shortName: 'FB',
  league: 'SUPER_LIG',
  overallRating: 83,
  stadium: 'Şükrü Saracoğlu Stadium',
  manager: 'İsmail Kartal',
  budget: 55000000,
  reputation: 81,
  chemistry: 85,
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

export const BESIKTAS: Team = {
  id: 'besiktas',
  name: 'Beşiktaş JK',
  shortName: 'BJK',
  league: 'SUPER_LIG',
  overallRating: 82,
  stadium: 'Vodafone Park',
  manager: 'Şenol Güneş',
  budget: 48000000,
  reputation: 80,
  chemistry: 82,
  players: [],
  tactics: {
    formation: '4-4-2',
    mentality: 'Balanced',
    buildUpStyle: 'Mixed',
    defensiveLine: 'Normal',
    width: 'Balanced',
    tempo: 'Fast',
    playerRoles: {} as any,
  },
};

export const TRABZONSPOR: Team = {
  id: 'trabzonspor',
  name: 'Trabzonspor',
  shortName: 'TS',
  league: 'SUPER_LIG',
  overallRating: 80,
  stadium: 'Şenol Güneş Stadium',
  manager: 'Abdullah Avcı',
  budget: 35000000,
  reputation: 76,
  chemistry: 84,
  players: [],
  tactics: {
    formation: '4-2-3-1',
    mentality: 'Attacking',
    buildUpStyle: 'Mixed',
    defensiveLine: 'Normal',
    width: 'Wide',
    tempo: 'Fast',
    playerRoles: {} as any,
  },
};

export const BASAKSEHIR: Team = {
  id: 'basaksehir',
  name: 'İstanbul Başakşehir',
  shortName: 'BAŞ',
  league: 'SUPER_LIG',
  overallRating: 79,
  stadium: 'Başakşehir Fatih Terim Stadium',
  manager: 'Çağdaş Atan',
  budget: 32000000,
  reputation: 74,
  chemistry: 80,
  players: [],
  tactics: {
    formation: '4-3-3',
    mentality: 'Balanced',
    buildUpStyle: 'Mixed',
    defensiveLine: 'Normal',
    width: 'Balanced',
    tempo: 'Normal',
    playerRoles: {} as any,
  },
};

export const ADANA_DEMIRSPOR: Team = {
  id: 'adana_demirspor',
  name: 'Adana Demirspor',
  shortName: 'ADS',
  league: 'SUPER_LIG',
  overallRating: 77,
  stadium: '5 Ocak Fatih Terim Stadium',
  manager: 'Vincenzo Montella',
  budget: 28000000,
  reputation: 70,
  chemistry: 78,
  players: [],
  tactics: {
    formation: '3-5-2',
    mentality: 'Balanced',
    buildUpStyle: 'Mixed',
    defensiveLine: 'Normal',
    width: 'Wide',
    tempo: 'Normal',
    playerRoles: {} as any,
  },
};

export const ANTALYASPOR: Team = {
  id: 'antalyaspor',
  name: 'Antalyaspor',
  shortName: 'ANT',
  league: 'SUPER_LIG',
  overallRating: 76,
  stadium: 'Antalya Stadium',
  manager: 'Nuri Şahin',
  budget: 22000000,
  reputation: 68,
  chemistry: 79,
  players: [],
  tactics: {
    formation: '4-2-3-1',
    mentality: 'Balanced',
    buildUpStyle: 'Mixed',
    defensiveLine: 'Normal',
    width: 'Balanced',
    tempo: 'Normal',
    playerRoles: {} as any,
  },
};

export const KASIMPASA: Team = {
  id: 'kasimpasa',
  name: 'Kasımpaşa SK',
  shortName: 'KAS',
  league: 'SUPER_LIG',
  overallRating: 75,
  stadium: 'Recep Tayyip Erdoğan Stadium',
  manager: 'Hakan Kutlu',
  budget: 20000000,
  reputation: 66,
  chemistry: 75,
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

export const SAMSUNSPOR: Team = {
  id: 'samsunspor',
  name: 'Samsunspor',
  shortName: 'SAM',
  league: 'SUPER_LIG',
  overallRating: 74,
  stadium: 'Samsun 19 Mayıs Stadium',
  manager: 'Markus Gisdol',
  budget: 18000000,
  reputation: 64,
  chemistry: 80,
  players: [],
  tactics: {
    formation: '4-3-3',
    mentality: 'Attacking',
    buildUpStyle: 'Mixed',
    defensiveLine: 'Normal',
    width: 'Wide',
    tempo: 'Fast',
    playerRoles: {} as any,
  },
};

export const ALANYASPOR: Team = {
  id: 'alanyaspor',
  name: 'Alanyaspor',
  shortName: 'ALA',
  league: 'SUPER_LIG',
  overallRating: 74,
  stadium: 'Bahçeşehir Okulları Stadium',
  manager: 'Fatih Tekke',
  budget: 18000000,
  reputation: 65,
  chemistry: 76,
  players: [],
  tactics: {
    formation: '4-2-3-1',
    mentality: 'Balanced',
    buildUpStyle: 'Mixed',
    defensiveLine: 'Normal',
    width: 'Balanced',
    tempo: 'Normal',
    playerRoles: {} as any,
  },
};

// Export all Süper Lig teams
export const SUPER_LIG_TEAMS: Team[] = [
  GALATASARAY,
  FENERBAHCE,
  BESIKTAS,
  TRABZONSPOR,
  BASAKSEHIR,
  ADANA_DEMIRSPOR,
  ANTALYASPOR,
  KASIMPASA,
  SAMSUNSPOR,
  ALANYASPOR,
];

export default SUPER_LIG_TEAMS;
