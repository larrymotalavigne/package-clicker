import { Injectable, inject, signal, computed } from '@angular/core';
import { GameStateService } from './game-state.service';
import { CHALLENGE_DEFINITIONS } from '../config/challenges.config';
import { ActiveChallenge, ChallengeConfig } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  private gameStateService = inject(GameStateService);

  readonly activeChallenge = computed(() => this.gameStateService.gameState().activeChallenge);
  readonly completedChallenges = computed(() => this.gameStateService.gameState().completedChallenges);
  readonly challengeResult = signal<{ success: boolean; reward: number } | null>(null);

  private clicksDuringChallenge = 0;
  private buildingsDuringChallenge = 0;

  getAvailableChallenges(): ChallengeConfig[] {
    const completed = this.completedChallenges();
    return CHALLENGE_DEFINITIONS.filter(c => !completed.includes(c.id));
  }

  getAllChallenges(): ChallengeConfig[] {
    return CHALLENGE_DEFINITIONS;
  }

  startChallenge(id: string): boolean {
    if (this.activeChallenge()) return false;

    const config = CHALLENGE_DEFINITIONS.find(c => c.id === id);
    if (!config) return false;

    this.clicksDuringChallenge = 0;
    this.buildingsDuringChallenge = 0;

    const challenge: ActiveChallenge = {
      id: config.id,
      type: config.type,
      progress: 0,
      target: config.target,
      remainingMs: config.durationMs,
      totalMs: config.durationMs,
    };

    this.gameStateService.updateChallenge(challenge);
    return true;
  }

  recordClick(): void {
    const ch = this.activeChallenge();
    if (!ch) return;

    if (ch.type === 'speed_click') {
      this.clicksDuringChallenge++;
      this.updateProgress(this.clicksDuringChallenge);
    } else if (ch.type === 'no_click') {
      // Clicking during no_click fails the challenge
      this.failChallenge();
    }
  }

  recordBuildingPurchase(): void {
    const ch = this.activeChallenge();
    if (!ch || ch.type !== 'building_rush') return;

    this.buildingsDuringChallenge++;
    this.updateProgress(this.buildingsDuringChallenge);
  }

  recordGoldenClick(): void {
    const ch = this.activeChallenge();
    if (!ch || ch.type !== 'golden_hunt') return;

    this.updateProgress(ch.progress + 1);
  }

  tickChallenge(deltaMs: number): void {
    const ch = this.activeChallenge();
    if (!ch) return;

    const remaining = ch.remainingMs - deltaMs;

    if (remaining <= 0) {
      this.resolveChallenge();
      return;
    }

    // Endurance: check PPS threshold
    if (ch.type === 'endurance') {
      const pps = this.gameStateService.gameState().packagesPerSecond;
      if (pps < ch.target) {
        this.failChallenge();
        return;
      }
      const elapsed = ch.totalMs - remaining;
      this.updateProgress(Math.floor(elapsed / 1000));
    }

    // No-click: track passive earnings
    if (ch.type === 'no_click') {
      const pps = this.gameStateService.gameState().packagesPerSecond;
      this.updateProgress(Math.floor(ch.progress + pps * (deltaMs / 1000)));
    }

    this.gameStateService.updateChallenge({ ...ch, remainingMs: remaining });
  }

  private updateProgress(progress: number): void {
    const ch = this.activeChallenge();
    if (!ch) return;

    if (progress >= ch.target) {
      this.completeChallenge();
      return;
    }

    this.gameStateService.updateChallenge({ ...ch, progress });
  }

  private completeChallenge(): void {
    const ch = this.activeChallenge();
    if (!ch) return;

    const config = CHALLENGE_DEFINITIONS.find(c => c.id === ch.id);
    if (!config) return;

    this.gameStateService.completeChallenge(ch.id);
    this.gameStateService.addExpressPoints(config.reward.expressPoints);

    this.challengeResult.set({ success: true, reward: config.reward.expressPoints });
    setTimeout(() => this.challengeResult.set(null), 3000);
    this.resetChallenge();
  }

  private failChallenge(): void {
    this.challengeResult.set({ success: false, reward: 0 });
    setTimeout(() => this.challengeResult.set(null), 3000);
    this.resetChallenge();
  }

  private resolveChallenge(): void {
    const ch = this.activeChallenge();
    if (!ch) return;

    if (ch.progress >= ch.target) {
      this.completeChallenge();
    } else {
      this.failChallenge();
    }
  }

  private resetChallenge(): void {
    this.clicksDuringChallenge = 0;
    this.buildingsDuringChallenge = 0;
    this.gameStateService.updateChallenge(null);
  }
}
