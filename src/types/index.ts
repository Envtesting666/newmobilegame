/**
 * Core Type Definitions for Football Manager AI
 * Real-world football data structures for 2024-25 season
 */

// ==================== LEAGUES ====================

export type LeagueType = 'LA_LIGA' | 'SUPER_LIG';

export interface League {
  id: LeagueType;
  name: string;
  country: string;
  season: string;
  teams: Team[];
  defaultLanguage: 'en' | 'tr';
}

// ==================== TEAMS ====================

export interface Team {
  id: string;
  name: string;
  shortName: string;
  league: LeagueType;
  overallRating: number;
  stadium: string;
  manager: string;
  budget: number;
  reputation: number;
  chemistry: number;
  players: Player[];
  tactics: TacticalSetup;
}

// ==================== PLAYERS ====================

export interface Player {
  id: string;
  name: string;
  team: string;
  league: LeagueType;
  position: Position;
  age: number;
  nationality: string;
  overallRating: number;
  potential: number;
  attributes: PlayerAttributes;
  preferredFoot: 'Left' | 'Right' | 'Both';
  weakFoot: 1 | 2 | 3 | 4 | 5;
  skillMoves: 1 | 2 | 3 | 4 | 5;
  workRates: WorkRate;
  value: number;
  wage: number;
  contractUntil: number;
  traits: string[];
  form: number;
  morale: MoraleState;
  matchSharpness: number;
  injuryStatus?: InjuryStatus;
  personalityType: PersonalityType;
}

export type Position =
  | 'GK'
  | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB'
  | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM'
  | 'LW' | 'RW' | 'ST' | 'CF';

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export type WorkRate =
  | 'Low/Low' | 'Low/Medium' | 'Low/High'
  | 'Medium/Low' | 'Medium/Medium' | 'Medium/High'
  | 'High/Low' | 'High/Medium' | 'High/High';

export type MoraleState = 'Excellent' | 'Good' | 'Okay' | 'Poor' | 'VeryPoor';

export interface InjuryStatus {
  type: string;
  weeksOut: number;
}

export type PersonalityType = 'Humble' | 'Confident' | 'Emotional' | 'Professional' | 'Arrogant';

// ==================== TACTICS ====================

export type Formation =
  | '4-3-3' | '4-3-3-Attack' | '4-3-3-Defend' | '4-3-3-Holding'
  | '4-4-2' | '4-4-2-Flat' | '4-4-2-Diamond'
  | '4-2-3-1' | '4-2-3-1-Wide' | '4-2-3-1-Narrow'
  | '3-5-2' | '3-4-3' | '5-3-2' | '4-1-4-1';

export interface TacticalSetup {
  formation: Formation;
  mentality: Mentality;
  buildUpStyle: BuildUpStyle;
  defensiveLine: DefensiveLine;
  width: Width;
  tempo: Tempo;
  playerRoles: Record<Position, PlayerRole>;
}

export type Mentality = 'UltraDefensive' | 'Defensive' | 'Balanced' | 'Attacking' | 'UltraAttacking';
export type BuildUpStyle = 'ShortPassing' | 'Mixed' | 'LongBall' | 'CounterAttack';
export type DefensiveLine = 'Deep' | 'Normal' | 'High' | 'Pressing';
export type Width = 'Narrow' | 'Balanced' | 'Wide';
export type Tempo = 'Slow' | 'Normal' | 'Fast';

export type PlayerRole =
  | 'SweeperKeeper' | 'TraditionalGK'
  | 'BallPlayingDefender' | 'Stopper'
  | 'AttackingWingBack' | 'DefensiveFullBack'
  | 'DeepLyingPlaymaker' | 'BoxToBox' | 'Anchor'
  | 'Playmaker' | 'ShadowStriker'
  | 'InsideForward' | 'TraditionalWinger'
  | 'TargetMan' | 'Poacher' | 'FalseNine';

// ==================== MATCH ENGINE ====================

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: Date;
  stadium: string;
  attendance: number;
  weather: WeatherCondition;
  referee: string;
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  statistics: MatchStatistics;
  commentary: CommentaryLine[];
  status: MatchStatus;
}

export type MatchStatus = 'Scheduled' | 'InProgress' | 'HalfTime' | 'Completed' | 'Abandoned';

export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Windy';

export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  team: string;
  player?: string;
  description: string;
  impact: number;
}

export type MatchEventType =
  | 'Goal' | 'OwnGoal' | 'Penalty' | 'MissedPenalty'
  | 'YellowCard' | 'RedCard' | 'Substitution'
  | 'Shot' | 'ShotOnTarget' | 'ShotBlocked' | 'Save'
  | 'Corner' | 'Freekick' | 'Offside'
  | 'Injury' | 'VAR' | 'HalfTime' | 'FullTime';

export interface MatchStatistics {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  passes: [number, number];
  passAccuracy: [number, number];
  tackles: [number, number];
  fouls: [number, number];
  corners: [number, number];
  offsides: [number, number];
}

export interface CommentaryLine {
  minute: number;
  text: string;
  audioUrl?: string;
  language: 'en' | 'tr';
  excitement: number;
}

// ==================== TRANSFERS ====================

export interface Transfer {
  id: string;
  player: Player;
  fromTeam: Team;
  toTeam: Team;
  fee: number;
  wage: number;
  contractLength: number;
  bonuses: TransferBonus[];
  status: TransferStatus;
  negotiationHistory: NegotiationMessage[];
}

export type TransferStatus =
  | 'Scouting' | 'Negotiating' | 'PersonalTerms' | 'Medical'
  | 'Completed' | 'Rejected' | 'Failed';

export interface TransferBonus {
  type: 'Appearances' | 'Goals' | 'TrophyWin' | 'SellOn';
  amount: number;
  condition: string;
}

export interface NegotiationMessage {
  from: 'User' | 'Club' | 'Agent';
  message: string;
  timestamp: Date;
  offer?: TransferOffer;
}

export interface TransferOffer {
  fee: number;
  wage: number;
  contractYears: number;
  bonuses: TransferBonus[];
  sellOnClause?: number;
}

// ==================== SOCIAL MEDIA ====================

export interface Tweet {
  id: string;
  author: TweetAuthor;
  content: string;
  timestamp: Date;
  likes: number;
  retweets: number;
  replies: number;
  imageUrl?: string;
  context: TweetContext;
}

export interface TweetAuthor {
  username: string;
  displayName: string;
  type: 'Fan' | 'Journalist' | 'Player' | 'Club' | 'Hater' | 'Rival';
  team?: string;
  verified: boolean;
}

export interface TweetContext {
  relatedMatch?: string;
  relatedPlayer?: string;
  relatedTransfer?: string;
  eventType: string;
}

// ==================== GAME STATE ====================

export interface GameState {
  managerName: string;
  currentTeam: Team;
  currentLeague: League;
  season: string;
  currentDate: Date;
  matchday: number;
  standings: LeagueStanding[];
  nextMatch?: Match;
  budget: number;
  reputation: number;
  boardExpectations: BoardExpectation[];
  careerStats: CareerStats;
  saveDate: Date;
}

export interface LeagueStanding {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface BoardExpectation {
  type: 'LeaguePosition' | 'CupRun' | 'YouthDevelopment' | 'FinancialBalance';
  target: string;
  status: 'Achieved' | 'OnTrack' | 'AtRisk' | 'Failed';
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface CareerStats {
  matchesManaged: number;
  wins: number;
  draws: number;
  losses: number;
  winPercentage: number;
  trophiesWon: number;
  reputation: number;
  specialties: ManagerSpecialty;
}

export interface ManagerSpecialty {
  youthDevelopment: number;
  tacticalKnowledge: number;
  manManagement: number;
  transferMarket: number;
}

// ==================== AI INTEGRATION ====================

export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AIPromptContext {
  gameState: GameState;
  recentEvents: MatchEvent[];
  playerInvolvement: Player[];
  teamForm: number;
  rivalryLevel: number;
}

export interface CommentaryRequest {
  language: 'en' | 'tr';
  event: MatchEvent;
  context: AIPromptContext;
  previousCommentary: CommentaryLine[];
}

export interface TweetGenerationRequest {
  persona: TweetAuthor['type'];
  context: TweetContext;
  gameContext: AIPromptContext;
}

export interface DialogueRequest {
  type: 'PressConference' | 'Transfer' | 'PlayerConversation' | 'BoardMeeting';
  context: AIPromptContext;
  previousMessages: string[];
}
