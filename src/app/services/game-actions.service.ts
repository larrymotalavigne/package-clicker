import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { ConfigService } from './config.service';
import { AchievementService } from './achievement.service';
import { SaveService } from './save.service';
import { UpgradeService } from './upgrade.service';
import { GoldenPackageService } from './golden-package.service';
import { PrestigeService } from './prestige.service';
import { WrinklerService } from './wrinkler.service';
import { EventService } from './event.service';
import { BuildingType } from '../types/building-types';

@Injectable({ providedIn: 'root' })
export class GameActionsService {
  private lastClickTime = 0;
  private pendingUpdates = {
    packages: null as number | null,
    packagesEarned: 0,
    packagesClicked: 0,
    needsPpsUpdate: false,
    needsAchievementCheck: false,
  };
  private updatesPending = false;

  private gameStateService = inject(GameStateService);
  private configService = inject(ConfigService);
  private achievementService = inject(AchievementService);
  private saveService = inject(SaveService);
  private upgradeService = inject(UpgradeService);
  private goldenPackageService = inject(GoldenPackageService);
  private prestigeService = inject(PrestigeService);
  private wrinklerService = inject(WrinklerService);
  private eventService = inject(EventService);

  clickPackage(): void {
    const now = Date.now();
    const debounce = this.configService.getClickDebounceTime();
    if (now - this.lastClickTime < debounce) return;
    this.lastClickTime = now;

    const state = this.gameStateService.gameState();
    const perClick = this.getEffectiveClickValue(state);

    this.pendingUpdates.packages =
      (this.pendingUpdates.packages ?? state.packages) + perClick;
    this.pendingUpdates.packagesEarned += perClick;
    this.pendingUpdates.packagesClicked += 1;
    this.pendingUpdates.needsAchievementCheck = true;
    this.scheduleUpdate();
  }

  buyBuilding(buildingType: string): boolean {
    if (!this.configService.isBuildingType(buildingType)) return false;
    if (!this.canAffordBuilding(buildingType)) return false;

    const state = this.gameStateService.gameState();
    const data =
      state.buildings[buildingType as keyof typeof state.buildings];
    const price = this.getBuildingPrice(buildingType);

    this.gameStateService.updatePackages(state.packages - price);
    this.gameStateService.updateBuilding(buildingType, {
      count: data.count + 1,
    });

    this.pendingUpdates.needsPpsUpdate = true;
    this.pendingUpdates.needsAchievementCheck = true;
    this.scheduleUpdate();
    return true;
  }

  canAffordBuilding(buildingType: string): boolean {
    if (!this.configService.isBuildingType(buildingType)) return false;
    const state = this.gameStateService.gameState();
    const available =
      this.pendingUpdates.packages ?? state.packages;
    return available >= this.getBuildingPrice(buildingType);
  }

  getBuildingPrice(buildingType: string): number {
    if (!this.configService.isBuildingType(buildingType)) return 0;
    const state = this.gameStateService.gameState();
    const data =
      state.buildings[buildingType as keyof typeof state.buildings];
    const base = this.configService.calculateBuildingPrice(
      data.basePrice,
      data.count
    );
    return Math.floor(base * this.eventService.getBuildingPriceMultiplier());
  }

  generatePassiveIncome(): void {
    const state = this.gameStateService.gameState();
    const rawPps = this.getEffectivePps(state);
    if (rawPps <= 0) return;

    const wrinklerDivert = this.wrinklerService.tick(rawPps / 10);
    const netIncome = rawPps / 10 - wrinklerDivert;

    if (netIncome > 0) {
      this.pendingUpdates.packages =
        (this.pendingUpdates.packages ?? state.packages) + netIncome;
      this.pendingUpdates.packagesEarned += netIncome;
    }

    if (Math.random() < 0.01) {
      this.pendingUpdates.needsAchievementCheck = true;
    }

    this.scheduleUpdate();
  }

  recalculatePps(): void {
    const state = this.gameStateService.gameState();
    const pps = this.calculateRawPps(state);
    this.gameStateService.updatePackagesPerSecond(pps);
  }

  resetGame(): void {
    this.gameStateService.resetState();
    this.achievementService.resetAchievements();
    this.clearPendingUpdates();
  }

  flushPendingUpdates(): void {
    if (!this.updatesPending) return;

    const updates = this.pendingUpdates;

    if (updates.packages !== null) {
      this.gameStateService.updatePackages(updates.packages);
    }
    if (updates.packagesEarned > 0) {
      this.gameStateService.updateTotalPackagesEarned(
        updates.packagesEarned
      );
    }
    if (updates.packagesClicked > 0) {
      this.gameStateService.updateTotalPackagesClicked(
        updates.packagesClicked
      );
    }
    if (updates.needsPpsUpdate) {
      this.recalculatePps();
    }
    if (updates.needsAchievementCheck) {
      const state = this.gameStateService.gameState();
      const result =
        this.achievementService.checkAchievements(state);
      for (const id of result.newlyUnlocked) {
        this.gameStateService.addAchievement(id);
      }
    }

    this.clearPendingUpdates();
  }

  getGameStats(): {
    totalPackages: number;
    packagesPerSecond: number;
    totalBuildings: number;
    totalClicks: number;
    achievementProgress: number;
  } {
    const state = this.gameStateService.gameState();
    const stats = this.achievementService.getAchievementStats(state);
    return {
      totalPackages: state.totalPackagesEarned,
      packagesPerSecond: state.packagesPerSecond,
      totalBuildings: this.gameStateService.totalBuildings(),
      totalClicks: state.totalPackagesClicked,
      achievementProgress: stats.progressPercentage,
    };
  }

  getEffectiveClickValue(
    state = this.gameStateService.gameState()
  ): number {
    let base = state.packagesPerClick;
    base *= this.upgradeService.getClickMultiplier();
    base *= this.goldenPackageService.getClickMultiplier();
    base *= this.eventService.getClickMultiplier();

    const ppsPercent = this.upgradeService.getClickPpsPercent();
    if (ppsPercent > 0) {
      base += state.packagesPerSecond * (ppsPercent / 100);
    }

    base *= this.prestigeService.prestigeMultiplier();
    return base;
  }

  getEffectivePps(
    state = this.gameStateService.gameState()
  ): number {
    return this.calculateRawPps(state);
  }

  private calculateRawPps(state = this.gameStateService.gameState()): number {
    let total = 0;
    const buildings = state.buildings;

    for (const [id, building] of Object.entries(buildings)) {
      if (building.count <= 0) continue;
      const basePps = building.count * building.pps;
      const mult = this.upgradeService.getBuildingMultiplier(
        id as BuildingType
      );
      const eventBoost = this.eventService.getBuildingBoostMultiplier(id);
      total += basePps * mult * eventBoost;
    }

    total *= this.upgradeService.getGlobalMultiplier();
    total *= this.goldenPackageService.getProductionMultiplier();
    total *= this.prestigeService.prestigeMultiplier();
    total *= this.prestigeService.heavenlyMultiplier();
    total *= this.eventService.getProductionMultiplier();

    return total;
  }

  getBuildingEfficiency(buildingType: string): number {
    if (!this.configService.isBuildingType(buildingType)) return 0;
    const config = this.configService.getBuildingConfig(buildingType);
    if (!config) return 0;
    const state = this.gameStateService.gameState();
    const data =
      state.buildings[buildingType as keyof typeof state.buildings];
    const price = this.configService.calculateBuildingPrice(
      data.basePrice,
      data.count
    );
    const mult = this.upgradeService.getBuildingMultiplier(
      buildingType as BuildingType
    );
    return (config.pps * mult) / price;
  }

  private scheduleUpdate(): void {
    if (this.updatesPending) return;
    this.updatesPending = true;
    requestAnimationFrame(() => this.flushPendingUpdates());
  }

  private clearPendingUpdates(): void {
    this.pendingUpdates = {
      packages: null,
      packagesEarned: 0,
      packagesClicked: 0,
      needsPpsUpdate: false,
      needsAchievementCheck: false,
    };
    this.updatesPending = false;
  }
}
