import { Injectable, computed, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { ConfigService } from './config.service';
import { UPGRADE_DEFINITIONS } from '../config/upgrades.config';
import { UpgradeConfig, UpgradeEffect, GameState } from '../models/game.models';
import { BuildingType } from '../types/building-types';

@Injectable({ providedIn: 'root' })
export class UpgradeService {
  private readonly upgrades = UPGRADE_DEFINITIONS;

  private gameStateService = inject(GameStateService);
  private configService = inject(ConfigService);

  readonly availableUpgrades = computed(() => {
    const state = this.gameStateService.gameState();
    return this.getAvailableUpgrades(state);
  });

  readonly purchasedCount = computed(() => {
    return this.gameStateService.gameState().purchasedUpgrades.length;
  });

  getAvailableUpgrades(state: GameState): UpgradeConfig[] {
    return this.upgrades.filter(
      (u) =>
        !state.purchasedUpgrades.includes(u.id) &&
        this.meetsRequirement(u, state)
    );
  }

  purchaseUpgrade(upgradeId: string): boolean {
    const state = this.gameStateService.gameState();
    const upgrade = this.upgrades.find((u) => u.id === upgradeId);
    if (!upgrade) return false;
    if (state.purchasedUpgrades.includes(upgradeId)) return false;

    const isEP = upgrade.currency === 'express_points';
    const available = isEP ? state.expressPoints : state.packages;
    if (available < upgrade.price) return false;
    if (!this.meetsRequirement(upgrade, state)) return false;

    if (isEP) {
      this.gameStateService.spendExpressPoints(upgrade.price);
    } else {
      this.gameStateService.updatePackages(state.packages - upgrade.price);
    }
    this.gameStateService.addPurchasedUpgrade(upgradeId);
    return true;
  }

  getUpgradeEffects(upgradeId: string): UpgradeEffect[] {
    const u = this.upgrades.find((up) => up.id === upgradeId);
    return u ? u.effects : [];
  }

  getBuildingMultiplier(buildingType: BuildingType): number {
    const state = this.gameStateService.gameState();
    let mult = 1;
    for (const uid of state.purchasedUpgrades) {
      const u = this.upgrades.find((up) => up.id === uid);
      if (!u) continue;
      for (const e of u.effects) {
        if (e.type === 'building_multiplier' && e.buildingType === buildingType) {
          mult *= e.value;
        }
      }
    }
    return mult;
  }

  getClickMultiplier(): number {
    return this.getMultiplier('click_multiplier');
  }

  getGlobalMultiplier(): number {
    return this.getMultiplier('global_multiplier');
  }

  getCostReduction(): number {
    return this.getMultiplier('building_cost_reduction');
  }

  getGoldenFrequencyMult(): number {
    return this.getMultiplier('golden_frequency');
  }

  getClickPpsPercent(): number {
    const state = this.gameStateService.gameState();
    let total = 0;
    for (const uid of state.purchasedUpgrades) {
      const u = this.upgrades.find((up) => up.id === uid);
      if (!u) continue;
      for (const e of u.effects) {
        if (e.type === 'click_add_pps_percent') {
          total += e.value;
        }
      }
    }
    return total;
  }

  getUpgradeById(id: string): UpgradeConfig | undefined {
    return this.upgrades.find((u) => u.id === id);
  }

  private getMultiplier(type: string): number {
    const state = this.gameStateService.gameState();
    let mult = 1;
    for (const uid of state.purchasedUpgrades) {
      const u = this.upgrades.find((up) => up.id === uid);
      if (!u) continue;
      for (const e of u.effects) {
        if (e.type === type) {
          mult *= e.value;
        }
      }
    }
    return mult;
  }

  private meetsRequirement(upgrade: UpgradeConfig, state: GameState): boolean {
    const req = upgrade.requirement;
    switch (req.type) {
      case 'building_count':
        if (!req.buildingType) return false;
        return (state.buildings[req.buildingType]?.count ?? 0) >= req.value;
      case 'total_packages':
        return state.totalPackagesEarned >= req.value;
      case 'upgrade_count':
        return state.purchasedUpgrades.length >= req.value;
      case 'clicks':
        return state.totalPackagesClicked >= req.value;
      case 'express_points':
        return state.totalExpressPointsEarned >= req.value;
      case 'challenge_count':
        return state.completedChallenges.length >= req.value;
      default:
        return false;
    }
  }
}
