import { Injectable, signal, computed, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { DAILY_REWARDS } from '../config/daily-rewards.config';
import { DailyRewardConfig, ActiveBuff } from '../models/game.models';

const MS_PER_DAY = 86400000;
const STREAK_RESET_THRESHOLD = MS_PER_DAY * 2;

@Injectable({ providedIn: 'root' })
export class DailyRewardService {
  private gameStateService = inject(GameStateService);

  readonly showPopup = signal(false);

  readonly currentDay = computed(() => {
    const streak = this.gameStateService.gameState().dailyStreak;
    return (streak % 7) + 1;
  });

  readonly streak = computed(() => {
    return this.gameStateService.gameState().dailyStreak;
  });

  getRewards(): DailyRewardConfig[] {
    return DAILY_REWARDS;
  }

  checkLogin(): void {
    const state = this.gameStateService.gameState();
    const today = this.getTodayString();

    if (state.lastLoginDate === today) {
      return;
    }

    const newStreak = this.calculateStreak(state.lastLoginDate, state.dailyStreak);
    const newDays = state.totalDaysPlayed + 1;

    this.gameStateService.updateDailyLogin(newStreak, today, newDays);
    this.showPopup.set(true);
  }

  claimReward(): void {
    const day = this.currentDay();
    const reward = DAILY_REWARDS.find((r) => r.day === day);

    if (!reward) {
      this.showPopup.set(false);
      return;
    }

    this.applyReward(reward);
    this.showPopup.set(false);
  }

  private applyReward(reward: DailyRewardConfig): void {
    switch (reward.reward.type) {
      case 'ep':
        this.gameStateService.addExpressPoints(reward.reward.value);
        break;
      case 'packages':
        this.addPackageReward(reward.reward.value);
        break;
      case 'buff':
        this.addFrenzyBuff(reward.reward.value);
        break;
    }
  }

  private addPackageReward(amount: number): void {
    const state = this.gameStateService.gameState();
    this.gameStateService.updatePackages(state.packages + amount);
  }

  private addFrenzyBuff(durationMs: number): void {
    const buff: ActiveBuff = {
      id: 'daily_frenzy_' + Date.now(),
      name: 'Daily Frenzy',
      type: 'frenzy',
      multiplier: 7,
      remainingMs: durationMs,
      totalMs: durationMs,
    };

    const state = this.gameStateService.gameState();
    this.gameStateService.updateActiveBuffs([...state.activeBuffs, buff]);
  }

  private calculateStreak(lastDate: string, currentStreak: number): number {
    if (!lastDate) {
      return 1;
    }

    const last = new Date(lastDate + 'T00:00:00').getTime();
    const now = new Date(this.getTodayString() + 'T00:00:00').getTime();
    const gap = now - last;

    if (gap >= STREAK_RESET_THRESHOLD) {
      return 1;
    }

    return currentStreak + 1;
  }

  getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }
}
