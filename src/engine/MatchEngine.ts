/**
 * Match Simulation Engine
 * Multi-factor football match simulation with dynamic AI-driven events
 */

import type {
  Team,
  Match,
  MatchEvent,
  MatchStatistics,
  MatchEventType,
  Player
} from '../types';
import { geminiService } from '../services/GeminiService';

interface MatchSimulationConfig {
  useAI: boolean;
  simulationSpeed: 1 | 2 | 3;
  detailLevel: 'quick' | 'normal' | 'extended';
}

export class MatchEngine {
  private homeTeam: Team;
  private awayTeam: Team;
  private homeScore: number = 0;
  private awayScore: number = 0;
  private events: MatchEvent[] = [];
  private currentMinute: number = 0;
  private momentum: number = 0; // -100 (away dominance) to +100 (home dominance)
  private config: MatchSimulationConfig;

  constructor(
    homeTeam: Team,
    awayTeam: Team,
    config: MatchSimulationConfig = {
      useAI: true,
      simulationSpeed: 1,
      detailLevel: 'normal',
    }
  ) {
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.config = config;
  }

  /**
   * Main simulation method - runs the entire match
   */
  async simulateMatch(): Promise<Match> {
    console.log(`Starting match: ${this.homeTeam.name} vs ${this.awayTeam.name}`);

    // Pre-match analysis
    const preMatchMomentum = this.calculatePreMatchMomentum();
    this.momentum = preMatchMomentum;

    // Simulate first half
    await this.simulateHalf(1, 45);

    // Half-time event
    this.addEvent(45, 'HalfTime', 'System', undefined, 'Half-time whistle');

    // Simulate second half
    await this.simulateHalf(46, 90);

    // Full-time event
    this.addEvent(90, 'FullTime', 'System', undefined, 'Full-time whistle');

    // Build final match object
    return this.buildMatchResult();
  }

  /**
   * Calculate pre-match momentum based on multiple factors
   */
  private calculatePreMatchMomentum(): number {
    // Factor 1: Squad Quality (35% weight)
    const qualityDiff = (this.homeTeam.overallRating - this.awayTeam.overallRating) * 3.5;

    // Factor 2: Team Chemistry (15% weight)
    const chemistryDiff = (this.homeTeam.chemistry - this.awayTeam.chemistry) * 1.5;

    // Factor 3: Home Advantage (5% weight)
    const homeAdvantage = 5;

    // Factor 4: Formation matchup (10% weight)
    const formationAdvantage = this.calculateFormationMatchup() * 10;

    // Total momentum (-100 to +100)
    const totalMomentum = qualityDiff + chemistryDiff + homeAdvantage + formationAdvantage;

    return Math.max(-100, Math.min(100, totalMomentum));
  }

  /**
   * Calculate formation matchup advantage
   */
  private calculateFormationMatchup(): number {
    // Simplified formation counter system
    const formationCounters: Record<string, string[]> = {
      '4-3-3': ['4-4-2', '4-2-3-1'],
      '4-4-2': ['3-5-2', '4-3-3'],
      '4-2-3-1': ['4-4-2', '3-5-2'],
      '3-5-2': ['4-3-3', '4-2-3-1'],
    };

    const homeFormation = this.homeTeam.tactics.formation;
    const awayFormation = this.awayTeam.tactics.formation;

    if (formationCounters[homeFormation]?.includes(awayFormation)) {
      return 1; // Home team has advantage
    } else if (formationCounters[awayFormation]?.includes(homeFormation)) {
      return -1; // Away team has advantage
    }

    return 0; // Neutral
  }

  /**
   * Simulate a half of football
   */
  private async simulateHalf(startMinute: number, endMinute: number): Promise<void> {
    this.currentMinute = startMinute;

    // Dice roll for half momentum
    const halfMomentumRoll = Math.random() * 100;
    const halfMomentumAdjustment = halfMomentumRoll > 50 ? 10 : -10;
    this.momentum += halfMomentumAdjustment;

    // Event frequency based on detail level
    const eventFrequency = {
      quick: 5,
      normal: 3,
      extended: 2,
    }[this.config.detailLevel];

    while (this.currentMinute <= endMinute) {
      // Determine if an event happens this minute
      if (Math.random() < 0.15) {
        // 15% chance of event each minute
        await this.generateEvent();
      }

      this.currentMinute += eventFrequency;
    }

    this.currentMinute = endMinute;
  }

  /**
   * Generate a match event using AI or traditional logic
   */
  private async generateEvent(): Promise<void> {
    if (this.config.useAI) {
      await this.generateAIEvent();
    } else {
      this.generateTraditionalEvent();
    }
  }

  /**
   * AI-powered event generation using Gemini
   */
  private async generateAIEvent(): Promise<void> {
    try {
      const event = await geminiService.generateMatchEvent(
        this.currentMinute,
        this.homeTeam,
        this.awayTeam,
        [this.homeScore, this.awayScore],
        this.momentum
      );

      if (event.type !== 'Nothing') {
        this.processEvent(event);
      }
    } catch (error) {
      console.error('AI event generation failed, using fallback:', error);
      this.generateTraditionalEvent();
    }
  }

  /**
   * Traditional dice-roll event generation
   */
  private generateTraditionalEvent(): void {
    // Determine attacking team based on momentum
    const attackingTeam = this.determineAttackingTeam();
    const defendingTeam = attackingTeam === 'home' ? 'away' : 'home';

    // Roll dice for event type
    const eventRoll = Math.random() * 100;

    // Adjust probabilities based on momentum and team strength
    const attackStrength = this.getTeamAttackStrength(attackingTeam);
    const defenseStrength = this.getTeamDefenseStrength(defendingTeam);

    const goalProbability = this.calculateGoalProbability(attackStrength, defenseStrength);

    if (eventRoll < goalProbability) {
      // GOAL!
      this.processGoal(attackingTeam);
    } else if (eventRoll < goalProbability + 15) {
      // Shot on target
      this.processShot(attackingTeam, 'ShotOnTarget');
    } else if (eventRoll < goalProbability + 30) {
      // Shot off target
      this.processShot(attackingTeam, 'Shot');
    } else if (eventRoll < goalProbability + 40) {
      // Corner
      this.processCorner(attackingTeam);
    } else if (eventRoll < goalProbability + 50) {
      // Foul
      this.processFoul(defendingTeam);
    }

    // Momentum shift
    this.adjustMomentum(eventRoll);
  }

  /**
   * Determine which team is attacking based on momentum
   */
  private determineAttackingTeam(): 'home' | 'away' {
    const roll = Math.random() * 100;
    const homeChance = 50 + (this.momentum * 0.3); // Momentum affects possession

    return roll < homeChance ? 'home' : 'away';
  }

  /**
   * Calculate goal probability
   */
  private calculateGoalProbability(attackStrength: number, defenseStrength: number): number {
    const baseProbability = 3; // 3% base chance per event
    const strengthDiff = (attackStrength - defenseStrength) / 10;

    return Math.max(1, Math.min(15, baseProbability + strengthDiff));
  }

  /**
   * Get team attack strength
   */
  private getTeamAttackStrength(team: 'home' | 'away'): number {
    const teamObj = team === 'home' ? this.homeTeam : this.awayTeam;
    return teamObj.overallRating;
  }

  /**
   * Get team defense strength
   */
  private getTeamDefenseStrength(team: 'home' | 'away'): number {
    const teamObj = team === 'home' ? this.homeTeam : this.awayTeam;
    return teamObj.overallRating;
  }

  /**
   * Process a goal event
   */
  private processGoal(team: 'home' | 'away'): void {
    const teamObj = team === 'home' ? this.homeTeam : this.awayTeam;
    const scorer = this.selectRandomAttacker(teamObj);

    if (team === 'home') {
      this.homeScore++;
    } else {
      this.awayScore++;
    }

    this.addEvent(
      this.currentMinute,
      'Goal',
      teamObj.name,
      scorer.name,
      `GOAL! ${scorer.name} scores for ${teamObj.name}!`
    );

    // Momentum shift after goal
    this.momentum += team === 'home' ? 20 : -20;

    console.log(`⚽ ${this.currentMinute}' - GOAL! ${scorer.name} (${teamObj.name})`);
  }

  /**
   * Process a shot event
   */
  private processShot(team: 'home' | 'away', type: 'Shot' | 'ShotOnTarget'): void {
    const teamObj = team === 'home' ? this.homeTeam : this.awayTeam;
    const shooter = this.selectRandomAttacker(teamObj);

    const description = type === 'ShotOnTarget'
      ? `${shooter.name} shoots on target!`
      : `${shooter.name} takes a shot, but it's off target.`;

    this.addEvent(this.currentMinute, type, teamObj.name, shooter.name, description);
  }

  /**
   * Process a corner event
   */
  private processCorner(team: 'home' | 'away'): void {
    const teamObj = team === 'home' ? this.homeTeam : this.awayTeam;

    this.addEvent(
      this.currentMinute,
      'Corner',
      teamObj.name,
      undefined,
      `Corner kick for ${teamObj.name}`
    );
  }

  /**
   * Process a foul event
   */
  private processFoul(team: 'home' | 'away'): void {
    const teamObj = team === 'home' ? this.homeTeam : this.awayTeam;
    const fouler = this.selectRandomDefender(teamObj);

    this.addEvent(
      this.currentMinute,
      'Freekick',
      teamObj.name,
      fouler.name,
      `Foul by ${fouler.name}`
    );

    // Chance of yellow card
    if (Math.random() < 0.15) {
      this.addEvent(
        this.currentMinute,
        'YellowCard',
        teamObj.name,
        fouler.name,
        `Yellow card for ${fouler.name}!`
      );
    }
  }

  /**
   * Process event from AI or traditional generation
   */
  private processEvent(event: any): void {
    const team = event.team === 'home' ? this.homeTeam : this.awayTeam;

    if (event.type === 'Goal') {
      if (event.team === 'home') {
        this.homeScore++;
      } else {
        this.awayScore++;
      }
    }

    this.addEvent(
      this.currentMinute,
      event.type,
      team.name,
      event.player,
      event.description
    );
  }

  /**
   * Add event to match timeline
   */
  private addEvent(
    minute: number,
    type: MatchEventType,
    team: string,
    player: string | undefined,
    description: string
  ): void {
    this.events.push({
      minute,
      type,
      team,
      player,
      description,
      impact: this.calculateEventImpact(type),
    });
  }

  /**
   * Calculate event impact on match
   */
  private calculateEventImpact(type: MatchEventType): number {
    const impactMap: Record<MatchEventType, number> = {
      'Goal': 10,
      'OwnGoal': 10,
      'Penalty': 9,
      'MissedPenalty': 8,
      'RedCard': 9,
      'YellowCard': 4,
      'Substitution': 3,
      'Shot': 2,
      'ShotOnTarget': 5,
      'ShotBlocked': 3,
      'Save': 6,
      'Corner': 4,
      'Freekick': 3,
      'Offside': 2,
      'Injury': 5,
      'VAR': 7,
      'HalfTime': 0,
      'FullTime': 0,
    };

    return impactMap[type] || 0;
  }

  /**
   * Adjust momentum after events
   */
  private adjustMomentum(eventRoll: number): void {
    const adjustment = (Math.random() - 0.5) * 10;
    this.momentum += adjustment;
    this.momentum = Math.max(-100, Math.min(100, this.momentum));
  }

  /**
   * Select random attacker from team
   */
  private selectRandomAttacker(team: Team): Player {
    const attackers = team.players.filter(p =>
      ['ST', 'CF', 'LW', 'RW', 'CAM'].includes(p.position)
    );

    if (attackers.length === 0) {
      // Fallback to any player
      return team.players[Math.floor(Math.random() * team.players.length)] || {
        name: 'Unknown Player',
      } as Player;
    }

    // Weight selection by attacking attributes
    const weightedSelection = attackers.map(p => ({
      player: p,
      weight: p.attributes.shooting + p.attributes.dribbling + p.form * 5,
    }));

    const totalWeight = weightedSelection.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of weightedSelection) {
      random -= item.weight;
      if (random <= 0) {
        return item.player;
      }
    }

    return attackers[0];
  }

  /**
   * Select random defender from team
   */
  private selectRandomDefender(team: Team): Player {
    const defenders = team.players.filter(p =>
      ['CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM'].includes(p.position)
    );

    if (defenders.length === 0) {
      return team.players[Math.floor(Math.random() * team.players.length)] || {
        name: 'Unknown Player',
      } as Player;
    }

    return defenders[Math.floor(Math.random() * defenders.length)];
  }

  /**
   * Build final match statistics
   */
  private calculateStatistics(): MatchStatistics {
    const homeEvents = this.events.filter(e => e.team === this.homeTeam.name);
    const awayEvents = this.events.filter(e => e.team === this.awayTeam.name);

    const homeShots = homeEvents.filter(e => ['Shot', 'ShotOnTarget', 'Goal'].includes(e.type)).length;
    const awayShots = awayEvents.filter(e => ['Shot', 'ShotOnTarget', 'Goal'].includes(e.type)).length;

    const homeShotsOnTarget = homeEvents.filter(e => ['ShotOnTarget', 'Goal'].includes(e.type)).length;
    const awayShotsOnTarget = awayEvents.filter(e => ['ShotOnTarget', 'Goal'].includes(e.type)).length;

    const homeCorners = homeEvents.filter(e => e.type === 'Corner').length;
    const awayCorners = awayEvents.filter(e => e.type === 'Corner').length;

    const homeFouls = homeEvents.filter(e => e.type === 'Freekick').length;
    const awayFouls = awayEvents.filter(e => e.type === 'Freekick').length;

    // Calculate possession based on events
    const totalEvents = homeEvents.length + awayEvents.length;
    const homePossession = totalEvents > 0 ? Math.round((homeEvents.length / totalEvents) * 100) : 50;
    const awayPossession = 100 - homePossession;

    return {
      possession: [homePossession, awayPossession],
      shots: [homeShots, awayShots],
      shotsOnTarget: [homeShotsOnTarget, awayShotsOnTarget],
      passes: [450 + Math.random() * 200, 450 + Math.random() * 200], // Simulated
      passAccuracy: [75 + Math.random() * 15, 75 + Math.random() * 15], // Simulated
      tackles: [15 + Math.floor(Math.random() * 10), 15 + Math.floor(Math.random() * 10)],
      fouls: [homeFouls, awayFouls],
      corners: [homeCorners, awayCorners],
      offsides: [
        this.events.filter(e => e.team === this.homeTeam.name && e.type === 'Offside').length,
        this.events.filter(e => e.team === this.awayTeam.name && e.type === 'Offside').length,
      ],
    };
  }

  /**
   * Build final match result
   */
  private buildMatchResult(): Match {
    return {
      id: `match_${Date.now()}`,
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      date: new Date(),
      stadium: this.homeTeam.stadium,
      attendance: Math.floor(30000 + Math.random() * 50000),
      weather: this.getRandomWeather(),
      referee: this.getRandomReferee(),
      homeScore: this.homeScore,
      awayScore: this.awayScore,
      events: this.events,
      statistics: this.calculateStatistics(),
      commentary: [], // Generated separately
      status: 'Completed',
    };
  }

  /**
   * Get random weather condition
   */
  private getRandomWeather(): any {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Windy'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  /**
   * Get random referee
   */
  private getRandomReferee(): string {
    const referees = [
      'Antonio Mateu Lahoz',
      'José María Sánchez',
      'Carlos Del Cerro Grande',
      'Cüneyt Çakır',
      'Halil Umut Meler',
    ];
    return referees[Math.floor(Math.random() * referees.length)];
  }
}

export default MatchEngine;
