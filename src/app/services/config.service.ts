import { Injectable } from '@angular/core';
import { Achievement, BuildingConfig } from '../models/game.models';
import { BuildingType } from '../types/building-types';
import { BUILDING_CONFIGS } from '../config/buildings.config';
import { ACHIEVEMENT_DEFINITIONS } from '../config/achievements.config';

export interface GameConfig {
  gameLoop: { intervalMs: number; autoSaveIntervalMs: number };
  gameplay: { basePriceMultiplier: number; achievementCheckChance: number };
  performance: { clickDebounceMs: number; maxSaveRetries: number };
  save: { version: string; storageKey: string };
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly gameConfig: GameConfig = {
    gameLoop: { intervalMs: 100, autoSaveIntervalMs: 30000 },
    gameplay: { basePriceMultiplier: 1.15, achievementCheckChance: 0.1 },
    performance: { clickDebounceMs: 50, maxSaveRetries: 3 },
    save: { version: '2.0.0', storageKey: 'packageClickerSave' },
  };

  private readonly buildingConfigs: BuildingConfig[] = BUILDING_CONFIGS;
  private readonly achievementDefs: Achievement[] = ACHIEVEMENT_DEFINITIONS;

  private formatCache = new Map<string, string>();
  private readonly maxCacheSize = 1000;
  private readonly suffixes = [
    '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
  ];
  private readonly divisors = [
    1, 1e3, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24, 1e27, 1e30, 1e33,
  ];

  getGameConfig(): GameConfig {
    return { ...this.gameConfig };
  }

  getGameLoopInterval(): number {
    return this.gameConfig.gameLoop.intervalMs;
  }

  getAutoSaveInterval(): number {
    return this.gameConfig.gameLoop.autoSaveIntervalMs;
  }

  getBasePriceMultiplier(): number {
    return this.gameConfig.gameplay.basePriceMultiplier;
  }

  getAchievementCheckChance(): number {
    return this.gameConfig.gameplay.achievementCheckChance;
  }

  getClickDebounceTime(): number {
    return this.gameConfig.performance.clickDebounceMs;
  }

  getMaxSaveRetries(): number {
    return this.gameConfig.performance.maxSaveRetries;
  }

  getSaveVersion(): string {
    return this.gameConfig.save.version;
  }

  getStorageKey(): string {
    return this.gameConfig.save.storageKey;
  }

  getBuildingConfigs(): BuildingConfig[] {
    return [...this.buildingConfigs];
  }

  getBuildingConfig(buildingId: string): BuildingConfig | undefined {
    return this.buildingConfigs.find((c) => c.id === buildingId);
  }

  getBuildingIds(): string[] {
    return this.buildingConfigs.map((c) => c.id);
  }

  isBuildingType(value: string): value is BuildingType {
    return this.buildingConfigs.some((c) => c.id === value);
  }

  getAchievementDefinitions(): Achievement[] {
    return [...this.achievementDefs];
  }

  getAchievementDefinition(id: string): Achievement | undefined {
    return this.achievementDefs.find((a) => a.id === id);
  }

  getAchievementsByType(type: Achievement['type']): Achievement[] {
    return this.achievementDefs.filter((a) => a.type === type);
  }

  calculateBuildingPrice(basePrice: number, count: number): number {
    return Math.floor(
      basePrice * Math.pow(this.getBasePriceMultiplier(), count)
    );
  }

  formatNumber(num: number): string {
    if (!isFinite(num) || isNaN(num)) return '0';
    if (num < 0) return '-' + this.formatNumber(-num);

    const cacheKey = num.toString();
    const cached = this.formatCache.get(cacheKey);
    if (cached) return cached;

    let result: string;

    if (num < 1000) {
      result = Math.floor(num).toString();
    } else {
      let si = 0;
      for (let i = this.divisors.length - 1; i >= 0; i--) {
        if (num >= this.divisors[i]) {
          si = i;
          break;
        }
      }
      const q = num / this.divisors[si];
      result =
        q < 10 && si <= 3
          ? (Math.floor(q * 10) / 10).toString() + this.suffixes[si]
          : Math.floor(q).toString() + this.suffixes[si];
    }

    if (this.formatCache.size >= this.maxCacheSize) {
      this.formatCache.clear();
    }
    this.formatCache.set(cacheKey, result);
    return result;
  }

  formatNumberPrecise(num: number, precision: number = 2): string {
    if (!isFinite(num) || isNaN(num)) return '0';
    if (num < 1000) return num.toFixed(precision);

    let si = 0;
    for (let i = this.divisors.length - 1; i >= 0; i--) {
      if (num >= this.divisors[i]) {
        si = i;
        break;
      }
    }
    return (num / this.divisors[si]).toFixed(precision) + this.suffixes[si];
  }

  clearFormatCache(): void {
    this.formatCache.clear();
  }
}
