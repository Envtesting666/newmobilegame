/**
 * League Data - La Liga and Turkish Süper Lig (2024-25 Season)
 */

import type { League } from '../types';

export const LA_LIGA: League = {
  id: 'LA_LIGA',
  name: 'La Liga',
  country: 'Spain',
  season: '2024-25',
  defaultLanguage: 'en',
  teams: [], // Populated from teams data
};

export const SUPER_LIG: League = {
  id: 'SUPER_LIG',
  name: 'Turkish Süper Lig',
  country: 'Turkey',
  season: '2024-25',
  defaultLanguage: 'tr',
  teams: [], // Populated from teams data
};

export const LEAGUES = {
  LA_LIGA,
  SUPER_LIG,
};

export default LEAGUES;
