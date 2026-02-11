import { Injectable, computed, inject } from '@angular/core';
import { GreatDelayStage } from '../models/game.models';
import { GameStateService } from './game-state.service';
import {
  GREAT_DELAY_STAGES,
  GREAT_DELAY_NEWS,
  GreatDelayStageConfig,
} from '../config/great-delay.config';

@Injectable({ providedIn: 'root' })
export class GreatDelayService {
  private readonly gameStateService = inject(GameStateService);

  readonly stage = computed<GreatDelayStage>(
    () => this.gameStateService.gameState().greatDelayStage
  );

  readonly isPledged = computed<boolean>(
    () => this.gameStateService.gameState().greatDelayPledged
  );

  readonly stageConfig = computed<GreatDelayStageConfig>(
    () => GREAT_DELAY_STAGES[this.stage()]
  );

  /** Check if the Great Delay should advance based on sorting facility count. */
  checkStageAdvance(): void {
    const state = this.gameStateService.gameState();
    const grandmaCount = state.buildings.grandma.count;
    const currentStage = state.greatDelayStage;

    if (state.greatDelayPledged) {
      return;
    }

    const newStage = this.findHighestStage(grandmaCount);

    if (newStage > currentStage) {
      this.gameStateService.updateGreatDelay(newStage, false);
    }
  }

  /** Pledge Order: pay 10% of packages to reset to stage 0. */
  pledgeOrder(): void {
    const state = this.gameStateService.gameState();
    const cost = Math.floor(state.packages * 0.1);
    this.gameStateService.updatePackages(state.packages - cost);
    this.gameStateService.updateGreatDelay(0, true);
  }

  /** Get the wrinkler spawn rate multiplier for the current stage. */
  getWrinklerSpawnMult(): number {
    return this.stageConfig().wrinklerSpawnMult;
  }

  /** Get the wrinkler divert percent for the current stage. */
  getDivertPercent(): number {
    return this.stageConfig().wrinklerDivertPercent;
  }

  /** Get the wrinkler return percent for the current stage. */
  getReturnPercent(): number {
    return this.stageConfig().wrinklerReturnPercent;
  }

  /** Get the background tint color for the current stage. */
  getTintColor(): string {
    return this.stageConfig().tintColor;
  }

  /** Get a random Great Delay news message, or null if at stage 0. */
  getRandomNews(): string | null {
    if (this.stage() === 0) {
      return null;
    }
    const index = Math.floor(Math.random() * GREAT_DELAY_NEWS.length);
    return GREAT_DELAY_NEWS[index];
  }

  /** Find the highest stage whose threshold is met. */
  private findHighestStage(grandmaCount: number): GreatDelayStage {
    let result: GreatDelayStage = 0;

    for (const config of GREAT_DELAY_STAGES) {
      if (grandmaCount >= config.sortingFacilityThreshold) {
        result = config.stage;
      }
    }

    return result;
  }
}
