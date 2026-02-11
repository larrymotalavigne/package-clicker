import { Injectable, computed, inject } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({ providedIn: 'root' })
export class PriorityStampService {
  private readonly gameStateService = inject(GameStateService);

  readonly STAMP_INTERVAL = 3600000; // 1 hour in ms

  readonly stamps = computed(
    () => this.gameStateService.gameState().priorityStamps
  );

  readonly progress = computed(
    () => this.gameStateService.gameState().stampProgress
  );

  tick(deltaMs: number): void {
    const state = this.gameStateService.gameState();
    let newProgress = state.stampProgress + deltaMs;
    let newStamps = state.priorityStamps;

    if (newProgress >= this.STAMP_INTERVAL) {
      newStamps += 1;
      newProgress -= this.STAMP_INTERVAL;
    }

    this.gameStateService.updateStamps(newStamps, newProgress);
  }

  levelUpBuilding(buildingType: string): boolean {
    const state = this.gameStateService.gameState();
    if (state.priorityStamps < 1) {
      return false;
    }

    const currentLevel = state.buildingLevels[buildingType] || 0;
    const newLevel = currentLevel + 1;

    this.gameStateService.updateStamps(
      state.priorityStamps - 1,
      state.stampProgress
    );
    this.gameStateService.updateBuildingLevel(buildingType, newLevel);
    return true;
  }

  getBuildingLevel(buildingType: string): number {
    return (
      this.gameStateService.gameState().buildingLevels[buildingType] || 0
    );
  }

  getBuildingLevelBonus(buildingType: string): number {
    return 1 + this.getBuildingLevel(buildingType) * 0.05;
  }

  getProgressPercent(): number {
    const state = this.gameStateService.gameState();
    return (state.stampProgress / this.STAMP_INTERVAL) * 100;
  }
}
