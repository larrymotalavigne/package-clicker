import { Injectable, computed, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { HEAVENLY_UPGRADES } from '../config/prestige.config';
import { HeavenlyUpgradeConfig } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class PrestigeService {
  readonly heavenlyUpgrades = HEAVENLY_UPGRADES;

  private gameStateService = inject(GameStateService);

  readonly currentLevel = computed(
    () => this.gameStateService.gameState().prestige.level
  );

  readonly currentPoints = computed(
    () => this.gameStateService.gameState().prestige.points
  );

  readonly pendingPrestige = computed(() => {
    const state = this.gameStateService.gameState();
    return this.calculatePrestigeLevel(
      state.prestige.totalEarnedAllTime
    );
  });

  readonly pendingGain = computed(() => {
    return Math.max(0, this.pendingPrestige() - this.currentLevel());
  });

  readonly prestigeMultiplier = computed(() => {
    const level = this.currentLevel();
    return 1 + level * 0.01;
  });

  readonly heavenlyMultiplier = computed(() => {
    const state = this.gameStateService.gameState();
    let mult = 1;
    for (const uid of state.prestige.heavenlyUpgrades) {
      const u = this.heavenlyUpgrades.find((h) => h.id === uid);
      if (!u) continue;
      for (const e of u.effects) {
        if (e.type === 'global_multiplier') mult *= e.value;
        if (e.type === 'click_multiplier') mult *= e.value;
      }
    }
    return mult;
  });

  calculatePrestigeLevel(totalEarned: number): number {
    if (totalEarned < 1e12) return 0;
    return Math.floor(Math.cbrt(totalEarned / 1e12));
  }

  canAscend(): boolean {
    return this.pendingGain() > 0;
  }

  ascend(): boolean {
    if (!this.canAscend()) return false;

    const state = this.gameStateService.gameState();
    const newLevel = this.pendingPrestige();
    const pointsGained = newLevel - state.prestige.level;

    this.gameStateService.updatePrestige({
      level: newLevel,
      points: state.prestige.points + pointsGained,
      timesAscended: state.prestige.timesAscended + 1,
    });

    const startPackages = this.getStartingPackages();
    this.gameStateService.resetForAscension(startPackages);
    return true;
  }

  purchaseHeavenlyUpgrade(upgradeId: string): boolean {
    const state = this.gameStateService.gameState();
    const upgrade = this.heavenlyUpgrades.find(
      (u) => u.id === upgradeId
    );
    if (!upgrade) return false;
    if (state.prestige.heavenlyUpgrades.includes(upgradeId)) {
      return false;
    }
    if (state.prestige.points < upgrade.price) return false;

    const hasReqs = upgrade.requires.every((r) =>
      state.prestige.heavenlyUpgrades.includes(r)
    );
    if (!hasReqs) return false;

    this.gameStateService.updatePrestige({
      points: state.prestige.points - upgrade.price,
      heavenlyUpgrades: [
        ...state.prestige.heavenlyUpgrades,
        upgradeId,
      ],
    });
    return true;
  }

  getUpgradeById(id: string): HeavenlyUpgradeConfig | undefined {
    return this.heavenlyUpgrades.find((u) => u.id === id);
  }

  isUpgradePurchased(id: string): boolean {
    return this.gameStateService
      .gameState()
      .prestige.heavenlyUpgrades.includes(id);
  }

  canAffordUpgrade(id: string): boolean {
    const u = this.getUpgradeById(id);
    if (!u) return false;
    return this.gameStateService.gameState().prestige.points >= u.price;
  }

  private getStartingPackages(): number {
    const state = this.gameStateService.gameState();
    const hvUpgrades = state.prestige.heavenlyUpgrades;
    if (hvUpgrades.includes('hv_start3')) return 100000;
    if (hvUpgrades.includes('hv_start2')) return 1000;
    if (hvUpgrades.includes('hv_start')) return 10;
    return 0;
  }
}
