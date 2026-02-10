import { Injectable, signal, computed } from '@angular/core';
import {
  GameState,
  Building,
  PrestigeState,
  GameSettings,
  ActiveEvent,
} from '../models/game.models';
import { BUILDING_CONFIGS } from '../config/buildings.config';
import { BuildingType, isBuildingType } from '../types/building-types';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private _gameState = signal<GameState>(this.getDefaultGameState());

  readonly gameState = this._gameState.asReadonly();

  readonly packagesPerSecond = computed(
    () => this._gameState().packagesPerSecond
  );

  readonly totalBuildings = computed(() => {
    const b = this._gameState().buildings;
    return Object.values(b).reduce((t, bl) => t + bl.count, 0);
  });

  constructor() {
    this.loadFromLocalStorage();
  }

  updatePackages(packages: number): void {
    this._gameState.update((s) => ({ ...s, packages }));
  }

  updateTotalPackagesEarned(earned: number): void {
    this._gameState.update((s) => ({
      ...s,
      totalPackagesEarned: s.totalPackagesEarned + earned,
      prestige: {
        ...s.prestige,
        totalEarnedAllTime: s.prestige.totalEarnedAllTime + earned,
      },
    }));
  }

  updateTotalPackagesClicked(clicked: number = 1): void {
    this._gameState.update((s) => ({
      ...s,
      totalPackagesClicked: s.totalPackagesClicked + clicked,
    }));
  }

  updateBuilding(buildingType: string, updates: Partial<Building>): void {
    if (!isBuildingType(buildingType)) {
      throw new Error(`Invalid building type: ${buildingType}`);
    }
    this._gameState.update((s) => ({
      ...s,
      buildings: {
        ...s.buildings,
        [buildingType]: {
          ...s.buildings[buildingType as BuildingType],
          ...updates,
        },
      },
      totalBuildingsEver:
        updates.count !== undefined
          ? s.totalBuildingsEver + 1
          : s.totalBuildingsEver,
    }));
  }

  updatePackagesPerSecond(pps?: number): void {
    if (pps !== undefined) {
      this._gameState.update((s) => ({ ...s, packagesPerSecond: pps }));
      return;
    }
    const state = this._gameState();
    const newPps = Object.values(state.buildings).reduce(
      (total, b) => total + b.count * b.pps,
      0
    );
    this._gameState.update((s) => ({ ...s, packagesPerSecond: newPps }));
  }

  addAchievement(achievementId: string): void {
    this._gameState.update((s) => ({
      ...s,
      achievements: [...s.achievements, achievementId],
    }));
  }

  addPurchasedUpgrade(upgradeId: string): void {
    this._gameState.update((s) => ({
      ...s,
      purchasedUpgrades: [...s.purchasedUpgrades, upgradeId],
    }));
  }

  updateActiveBuffs(buffs: GameState['activeBuffs']): void {
    this._gameState.update((s) => ({ ...s, activeBuffs: buffs }));
  }

  incrementGoldenClicks(): void {
    this._gameState.update((s) => ({
      ...s,
      goldenPackageClicks: s.goldenPackageClicks + 1,
    }));
  }

  updateWrinklers(wrinklers: GameState['wrinklers']): void {
    this._gameState.update((s) => ({ ...s, wrinklers }));
  }

  updateSettings(settings: Partial<GameSettings>): void {
    this._gameState.update((s) => ({
      ...s,
      settings: { ...s.settings, ...settings },
    }));
  }

  updatePrestige(prestige: Partial<PrestigeState>): void {
    this._gameState.update((s) => ({
      ...s,
      prestige: { ...s.prestige, ...prestige },
    }));
  }

  updatePlayTime(delta: number): void {
    this._gameState.update((s) => ({
      ...s,
      totalPlayTime: s.totalPlayTime + delta,
      lastTickTime: Date.now(),
    }));
  }

  updateActiveEvents(events: ActiveEvent[]): void {
    this._gameState.update((s) => ({ ...s, activeEvents: events }));
  }

  addActiveEvent(event: ActiveEvent): void {
    this._gameState.update((s) => ({
      ...s,
      activeEvents: [...s.activeEvents, event],
    }));
  }

  incrementEventsExperienced(): void {
    this._gameState.update((s) => ({
      ...s,
      totalEventsExperienced: s.totalEventsExperienced + 1,
    }));
  }

  setFullState(state: GameState): void {
    this._gameState.set(state);
  }

  resetState(): void {
    this._gameState.set(this.getDefaultGameState());
  }

  resetForAscension(startingPackages: number): void {
    const current = this._gameState();
    const defaultState = this.getDefaultGameState();
    this._gameState.set({
      ...defaultState,
      packages: startingPackages,
      prestige: current.prestige,
      settings: current.settings,
      goldenPackageClicks: current.goldenPackageClicks,
      totalPlayTime: current.totalPlayTime,
      lastTickTime: Date.now(),
      totalEventsExperienced: current.totalEventsExperienced,
    });
  }

  getDefaultGameState(): GameState {
    const buildings: Record<string, Building> = {};
    BUILDING_CONFIGS.forEach((config) => {
      buildings[config.id] = {
        count: 0,
        basePrice: config.basePrice,
        pps: config.pps,
      };
    });

    return {
      packages: 0,
      packagesPerSecond: 0,
      packagesPerClick: 1,
      buildings: buildings as GameState['buildings'],
      achievements: [],
      totalPackagesClicked: 0,
      totalPackagesEarned: 0,
      purchasedUpgrades: [],
      prestige: {
        level: 0,
        points: 0,
        totalEarnedAllTime: 0,
        heavenlyUpgrades: [],
        timesAscended: 0,
      },
      goldenPackageClicks: 0,
      wrinklers: [],
      settings: {
        particleEffects: true,
        shortNumbers: true,
        showBuffTimers: true,
      },
      totalBuildingsEver: 0,
      totalPlayTime: 0,
      lastTickTime: Date.now(),
      activeBuffs: [],
      activeEvents: [],
      totalEventsExperienced: 0,
    };
  }

  private loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('packageClickerSave');
      if (saved) {
        const parsed = JSON.parse(saved);
        const gs = parsed.gameState || parsed;
        if (this.validateGameState(gs)) {
          this._gameState.set(this.mergeWithDefaults(gs));
        }
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  }

  private validateGameState(state: unknown): boolean {
    const s = state as Record<string, unknown>;
    return (
      !!s &&
      typeof s['packages'] === 'number' &&
      typeof s['packagesPerSecond'] === 'number' &&
      typeof s['packagesPerClick'] === 'number' &&
      typeof s['buildings'] === 'object' &&
      Array.isArray(s['achievements'])
    );
  }

  private mergeWithDefaults(loaded: Record<string, unknown>): GameState {
    const def = this.getDefaultGameState();
    const merged = { ...def, ...loaded } as GameState;

    merged.buildings = { ...def.buildings };
    const lb = loaded['buildings'] as Record<string, Building> | undefined;
    if (lb) {
      for (const key of Object.keys(def.buildings)) {
        if (lb[key]) {
          merged.buildings[key as BuildingType] = {
            ...def.buildings[key as BuildingType],
            ...lb[key],
          };
        }
      }
    }

    merged.prestige = { ...def.prestige, ...(merged.prestige || {}) };
    merged.settings = { ...def.settings, ...(merged.settings || {}) };
    merged.purchasedUpgrades = merged.purchasedUpgrades || [];
    merged.activeBuffs = merged.activeBuffs || [];
    merged.wrinklers = [];
    merged.goldenPackageClicks = merged.goldenPackageClicks || 0;
    merged.totalBuildingsEver = merged.totalBuildingsEver || 0;
    merged.totalPlayTime = merged.totalPlayTime || 0;
    merged.lastTickTime = merged.lastTickTime || Date.now();
    merged.activeEvents = [];
    merged.totalEventsExperienced = merged.totalEventsExperienced || 0;

    return merged;
  }
}
