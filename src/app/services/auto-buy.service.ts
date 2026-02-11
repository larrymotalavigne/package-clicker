import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { GameActionsService } from './game-actions.service';
import { BuildingType, getAllBuildingTypes } from '../types/building-types';

@Injectable({ providedIn: 'root' })
export class AutoBuyService {
  private gameStateService = inject(GameStateService);
  private gameActionsService = inject(GameActionsService);

  private tickAccumulator = 0;

  unlock(): boolean {
    const cost = 25;
    if (!this.gameStateService.spendExpressPoints(cost)) {
      return false;
    }
    this.gameStateService.updateAutoBuy({ autoBuyUnlocked: true });
    return true;
  }

  toggle(): void {
    const s = this.gameStateService.gameState();
    this.gameStateService.updateAutoBuy({
      autoBuyEnabled: !s.autoBuyEnabled,
    });
  }

  isUnlocked(): boolean {
    return this.gameStateService.gameState().autoBuyUnlocked;
  }

  isEnabled(): boolean {
    return this.gameStateService.gameState().autoBuyEnabled;
  }

  tick(deltaMs: number): void {
    if (!this.isUnlocked() || !this.isEnabled()) {
      return;
    }

    this.tickAccumulator += deltaMs;

    const interval =
      this.gameStateService.gameState().autoBuyInterval;

    if (this.tickAccumulator < interval) {
      return;
    }

    this.tickAccumulator = 0;
    this.buyCheapestAffordable();
  }

  private buyCheapestAffordable(): void {
    const cheapest = this.findCheapestAffordable();
    if (cheapest) {
      this.gameActionsService.buyBuilding(cheapest);
    }
  }

  private findCheapestAffordable(): BuildingType | null {
    let bestType: BuildingType | null = null;
    let bestPrice = Infinity;

    for (const type of getAllBuildingTypes()) {
      if (!this.gameActionsService.canAffordBuilding(type)) {
        continue;
      }
      const price = this.gameActionsService.getBuildingPrice(type);
      if (price < bestPrice) {
        bestPrice = price;
        bestType = type;
      }
    }

    return bestType;
  }
}
