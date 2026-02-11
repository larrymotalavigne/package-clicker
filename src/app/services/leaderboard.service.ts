import { Injectable, inject, signal, computed } from '@angular/core';
import { LeaderboardEntry } from '../models/game.models';
import { GameStateService } from './game-state.service';

const FIRST_NAMES: string[] = [
  'Speed', 'Mega', 'Ultra', 'Lucky', 'Swift',
  'Turbo', 'Power', 'Flash', 'Storm', 'Blaze',
  'Pixel', 'Quantum', 'Neo', 'Dark', 'Star',
  'Gold', 'Silver', 'Iron', 'Steel', 'Thunder',
];

const LAST_NAMES: string[] = [
  'Clicker', 'Shipper', 'Sender', 'Packer', 'Runner',
  'Hauler', 'Mover', 'Loader', 'Driver', 'Flyer',
  'Boss', 'King', 'Pro', 'Master', 'Wizard',
  'Legend', 'Hero', 'Chief', 'Elite', 'Prime',
];

const SEASON_DURATION_MS = 604800000; // 7 days
const COMPETITOR_COUNT = 50;

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly gameStateService = inject(GameStateService);

  readonly entries = signal<LeaderboardEntry[]>([]);

  readonly playerRank = computed(() => {
    const e = this.entries();
    const p = e.find((x) => x.isPlayer);
    return p?.rank ?? 51;
  });

  readonly seasonTimer = signal(SEASON_DURATION_MS);

  private rngSeed = 0;
  private competitorScores: number[] = [];
  private competitorNames: string[] = [];

  init(): void {
    const seed = this.gameStateService.gameState().leaderboardSeed;
    this.rngSeed = seed || 1;
    this.generateCompetitors();
    this.buildEntries();
  }

  tickLeaderboard(deltaMs: number): void {
    this.decrementTimer(deltaMs);
    this.advanceCompetitorScores();
    this.buildEntries();
  }

  isSeasonEnd(): boolean {
    return this.seasonTimer() <= 0;
  }

  resetSeason(): void {
    const playerScore = this.getPlayerScore();
    this.gameStateService.updateSeasonHighScore(playerScore);
    this.seasonTimer.set(SEASON_DURATION_MS);
    this.rngSeed = Date.now() % 2147483647 || 1;
    this.generateCompetitors();
    this.buildEntries();
  }

  getPlayerScore(): number {
    return this.gameStateService.gameState().totalPackagesEarned;
  }

  private nextRandom(): number {
    this.rngSeed = (this.rngSeed * 16807) % 2147483647;
    return this.rngSeed / 2147483647;
  }

  private generateCompetitors(): void {
    this.competitorNames = [];
    this.competitorScores = [];
    for (let i = 0; i < COMPETITOR_COUNT; i++) {
      this.competitorNames.push(this.generateName());
      this.competitorScores.push(this.generateInitialScore(i));
    }
  }

  private generateName(): string {
    const fi = Math.floor(this.nextRandom() * FIRST_NAMES.length);
    const li = Math.floor(this.nextRandom() * LAST_NAMES.length);
    return FIRST_NAMES[fi] + ' ' + LAST_NAMES[li];
  }

  private generateInitialScore(index: number): number {
    const t = index / (COMPETITOR_COUNT - 1);
    const base = 100 * Math.pow(1e7, t);
    const jitter = 0.5 + this.nextRandom();
    return Math.floor(base * jitter);
  }

  private decrementTimer(deltaMs: number): void {
    const current = this.seasonTimer();
    this.seasonTimer.set(Math.max(0, current - deltaMs));
  }

  private advanceCompetitorScores(): void {
    for (let i = 0; i < this.competitorScores.length; i++) {
      const growth = this.competitorScores[i] * 0.0001 * this.nextRandom();
      this.competitorScores[i] = Math.floor(
        this.competitorScores[i] + growth
      );
    }
  }

  private buildEntries(): void {
    const playerScore = this.getPlayerScore();
    const all: LeaderboardEntry[] = this.buildCompetitorEntries();
    all.push({ name: 'You', score: playerScore, rank: 0, isPlayer: true });
    this.sortAndRank(all);
    this.entries.set(all);
  }

  private buildCompetitorEntries(): LeaderboardEntry[] {
    const result: LeaderboardEntry[] = [];
    for (let i = 0; i < this.competitorScores.length; i++) {
      result.push({
        name: this.competitorNames[i],
        score: this.competitorScores[i],
        rank: 0,
        isPlayer: false,
      });
    }
    return result;
  }

  private sortAndRank(list: LeaderboardEntry[]): void {
    list.sort((a, b) => b.score - a.score);
    for (let i = 0; i < list.length; i++) {
      list[i].rank = i + 1;
    }
  }
}
