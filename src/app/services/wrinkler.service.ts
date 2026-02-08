import { Injectable, computed, inject } from '@angular/core';
import { GameStateService } from './game-state.service';

const MAX_WRINKLERS = 10;
const SPAWN_CHANCE = 0.001;
const DIVERT_PERCENT = 0.05;
const POP_BONUS = 1.1;

@Injectable({ providedIn: 'root' })
export class WrinklerService {
  private gameStateService = inject(GameStateService);

  readonly wrinklers = computed(
    () => this.gameStateService.gameState().wrinklers
  );

  readonly activeCount = computed(() => this.wrinklers().length);

  readonly totalDiverted = computed(
    () => this.wrinklers().reduce((t, w) => t + w.eaten, 0)
  );

  readonly divertFraction = computed(
    () => this.activeCount() * DIVERT_PERCENT
  );

  tick(ppsThisTick: number): number {
    const state = this.gameStateService.gameState();
    let wrinklers = [...state.wrinklers];

    if (wrinklers.length < MAX_WRINKLERS && Math.random() < SPAWN_CHANCE) {
      wrinklers.push({
        id: Date.now(),
        eaten: 0,
        spawnTime: Date.now(),
        angle: Math.random() * 360,
      });
    }

    const divertPerWrinkler = ppsThisTick * DIVERT_PERCENT;
    const totalDiverted = divertPerWrinkler * wrinklers.length;

    if (wrinklers.length > 0) {
      wrinklers = wrinklers.map((w) => ({
        ...w,
        eaten: w.eaten + divertPerWrinkler,
      }));
      this.gameStateService.updateWrinklers(wrinklers);
    }

    return totalDiverted;
  }

  pop(wrinklerId: number): number {
    const state = this.gameStateService.gameState();
    const wrinkler = state.wrinklers.find((w) => w.id === wrinklerId);
    if (!wrinkler) return 0;

    const reward = wrinkler.eaten * POP_BONUS;
    const remaining = state.wrinklers.filter(
      (w) => w.id !== wrinklerId
    );
    this.gameStateService.updateWrinklers(remaining);
    this.gameStateService.updatePackages(state.packages + reward);
    return reward;
  }

  popAll(): number {
    const state = this.gameStateService.gameState();
    let totalReward = 0;
    for (const w of state.wrinklers) {
      totalReward += w.eaten * POP_BONUS;
    }
    this.gameStateService.updateWrinklers([]);
    if (totalReward > 0) {
      this.gameStateService.updatePackages(
        state.packages + totalReward
      );
    }
    return totalReward;
  }
}
