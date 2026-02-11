import { Injectable, signal, computed } from '@angular/core';
import {
  GameState,
  Building,
  PrestigeState,
  GameSettings,
  ActiveEvent,
  ActiveChallenge,
  ActiveContract,
  ActiveResearch,
  RareLoot,
  EasterEggsState,
  Employee,
  KingdomState,
  GreatDelayStage,
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

  addExpressPoints(amount: number): void {
    this._gameState.update((s) => ({
      ...s,
      expressPoints: s.expressPoints + amount,
      totalExpressPointsEarned: s.totalExpressPointsEarned + amount,
    }));
  }

  spendExpressPoints(amount: number): boolean {
    const s = this._gameState();
    if (s.expressPoints < amount) return false;
    this._gameState.update((st) => ({
      ...st,
      expressPoints: st.expressPoints - amount,
    }));
    return true;
  }

  addRareLoot(loot: RareLoot): void {
    this._gameState.update((s) => ({
      ...s,
      rareLoot: [...s.rareLoot, loot],
    }));
  }

  updateChallenge(challenge: ActiveChallenge | null): void {
    this._gameState.update((s) => ({
      ...s,
      activeChallenge: challenge,
    }));
  }

  completeChallenge(id: string): void {
    this._gameState.update((s) => ({
      ...s,
      activeChallenge: null,
      completedChallenges: [...s.completedChallenges, id],
    }));
  }

  unlockLore(ids: string[]): void {
    this._gameState.update((s) => ({
      ...s,
      loreUnlocked: [...s.loreUnlocked, ...ids],
    }));
  }

  updateContracts(contracts: ActiveContract[]): void {
    this._gameState.update((s) => ({
      ...s,
      activeContracts: contracts,
    }));
  }

  completeContract(id: string): void {
    this._gameState.update((s) => ({
      ...s,
      completedContractIds: [...s.completedContractIds, id],
      totalContractsCompleted: s.totalContractsCompleted + 1,
    }));
  }

  updateLastSaveTime(): void {
    this._gameState.update((s) => ({
      ...s,
      lastSaveTime: Date.now(),
    }));
  }

  updateEasterEggs(updates: Partial<EasterEggsState>): void {
    this._gameState.update((s) => ({
      ...s,
      easterEggs: { ...s.easterEggs, ...updates },
    }));
  }

  updateDailyLogin(streak: number, date: string, days: number): void {
    this._gameState.update((s) => ({
      ...s,
      dailyStreak: streak,
      lastLoginDate: date,
      totalDaysPlayed: days,
    }));
  }

  updatePackageTypeCounts(counts: Record<string, number>): void {
    this._gameState.update((s) => ({
      ...s,
      packageTypeCounts: counts,
    }));
  }

  updateAutoBuy(u: Partial<Pick<GameState, 'autoBuyUnlocked' | 'autoBuyEnabled' | 'autoBuyInterval'>>): void {
    this._gameState.update((s) => ({ ...s, ...u }));
  }

  updateStockPortfolio(portfolio: Record<string, number>): void {
    this._gameState.update((s) => ({
      ...s,
      stockPortfolio: portfolio,
    }));
  }

  addStockProfit(amount: number): void {
    this._gameState.update((s) => ({
      ...s,
      stockProfitTotal: s.stockProfitTotal + amount,
    }));
  }

  updateResearch(research: ActiveResearch | null): void {
    this._gameState.update((s) => ({
      ...s,
      activeResearch: research,
    }));
  }

  completeResearch(nodeId: string): void {
    this._gameState.update((s) => ({
      ...s,
      completedResearch: [...s.completedResearch, nodeId],
      activeResearch: null,
    }));
  }

  updateRoutes(routes: string[]): void {
    this._gameState.update((s) => ({
      ...s,
      assignedRoutes: routes,
    }));
  }

  updateStamps(stamps: number, progress: number): void {
    this._gameState.update((s) => ({
      ...s,
      priorityStamps: stamps,
      stampProgress: progress,
    }));
  }

  updateBuildingLevel(buildingType: string, level: number): void {
    this._gameState.update((s) => ({
      ...s,
      buildingLevels: { ...s.buildingLevels, [buildingType]: level },
    }));
  }

  updateEmployees(employees: Employee[]): void {
    this._gameState.update((s) => ({
      ...s,
      employees,
    }));
  }

  incrementEmployeesHired(): void {
    this._gameState.update((s) => ({
      ...s,
      totalEmployeesHired: s.totalEmployeesHired + 1,
    }));
  }

  updateGreatDelay(stage: GreatDelayStage, pledged: boolean): void {
    this._gameState.update((s) => ({
      ...s,
      greatDelayStage: stage,
      greatDelayPledged: pledged,
    }));
  }

  updateKingdom(kingdom: KingdomState): void {
    this._gameState.update((s) => ({
      ...s,
      kingdom,
    }));
  }

  updateAutomation(unlocked: string[], enabled: string[]): void {
    this._gameState.update((s) => ({
      ...s,
      unlockedAutomation: unlocked,
      enabledAutomation: enabled,
    }));
  }

  updateSeasonHighScore(score: number): void {
    this._gameState.update((s) => ({
      ...s,
      seasonHighScore: Math.max(s.seasonHighScore, score),
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
      expressPoints: current.expressPoints,
      totalExpressPointsEarned: current.totalExpressPointsEarned,
      rareLoot: current.rareLoot,
      completedChallenges: current.completedChallenges,
      loreUnlocked: current.loreUnlocked,
      completedContractIds: current.completedContractIds,
      totalContractsCompleted: current.totalContractsCompleted,
      lastSaveTime: Date.now(),
      easterEggs: current.easterEggs,
      // Persistent across ascension
      dailyStreak: current.dailyStreak,
      lastLoginDate: current.lastLoginDate,
      totalDaysPlayed: current.totalDaysPlayed,
      completedResearch: current.completedResearch,
      priorityStamps: current.priorityStamps,
      stampProgress: current.stampProgress,
      buildingLevels: current.buildingLevels,
      employees: current.employees,
      totalEmployeesHired: current.totalEmployeesHired,
      kingdom: current.kingdom,
      leaderboardSeed: current.leaderboardSeed,
      seasonHighScore: current.seasonHighScore,
      unlockedAutomation: current.unlockedAutomation,
      enabledAutomation: current.enabledAutomation,
      autoBuyUnlocked: current.autoBuyUnlocked,
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
        corporateLevel: 0,
        corporatePoints: 0,
        corporateUpgrades: [],
      },
      goldenPackageClicks: 0,
      wrinklers: [],
      settings: {
        particleEffects: true,
        shortNumbers: true,
        showBuffTimers: true,
        soundEnabled: false,
        theme: 'dark',
      },
      totalBuildingsEver: 0,
      totalPlayTime: 0,
      lastTickTime: Date.now(),
      activeBuffs: [],
      activeEvents: [],
      totalEventsExperienced: 0,
      expressPoints: 0,
      totalExpressPointsEarned: 0,
      rareLoot: [],
      activeChallenge: null,
      completedChallenges: [],
      loreUnlocked: [],
      activeContracts: [],
      completedContractIds: [],
      totalContractsCompleted: 0,
      lastSaveTime: Date.now(),
      easterEggs: {
        konamiUsed: false,
        rapidClickTimestamps: [],
      },
      // Phase 1
      dailyStreak: 0,
      lastLoginDate: '',
      totalDaysPlayed: 0,
      packageTypeCounts: {},
      autoBuyUnlocked: false,
      autoBuyEnabled: false,
      autoBuyInterval: 10000,
      // Phase 2
      stockPortfolio: {},
      stockProfitTotal: 0,
      completedResearch: [],
      activeResearch: null,
      assignedRoutes: [],
      priorityStamps: 0,
      stampProgress: 0,
      buildingLevels: {},
      employees: [],
      totalEmployeesHired: 0,
      // Phase 3
      greatDelayStage: 0 as const,
      greatDelayPledged: false,
      kingdom: { cities: [], totalEpGenerated: 0 },
      leaderboardSeed: Math.floor(Math.random() * 1e9),
      seasonHighScore: 0,
      unlockedAutomation: [],
      enabledAutomation: [],
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
    merged.expressPoints = merged.expressPoints || 0;
    merged.totalExpressPointsEarned = merged.totalExpressPointsEarned || 0;
    merged.rareLoot = merged.rareLoot || [];
    merged.activeChallenge = null;
    merged.completedChallenges = merged.completedChallenges || [];
    merged.loreUnlocked = merged.loreUnlocked || [];
    merged.activeContracts = [];
    merged.completedContractIds = merged.completedContractIds || [];
    merged.totalContractsCompleted = merged.totalContractsCompleted || 0;
    merged.lastSaveTime = merged.lastSaveTime || Date.now();
    merged.easterEggs = {
      ...def.easterEggs,
      ...(merged.easterEggs || {}),
    };

    // Phase 1: Small features
    merged.dailyStreak = merged.dailyStreak || 0;
    merged.lastLoginDate = merged.lastLoginDate || '';
    merged.totalDaysPlayed = merged.totalDaysPlayed || 0;
    merged.packageTypeCounts = merged.packageTypeCounts || {};
    merged.autoBuyUnlocked = merged.autoBuyUnlocked || false;
    merged.autoBuyEnabled = merged.autoBuyEnabled || false;
    merged.autoBuyInterval = merged.autoBuyInterval || 10000;

    // Phase 2: Medium features
    merged.stockPortfolio = merged.stockPortfolio || {};
    merged.stockProfitTotal = merged.stockProfitTotal || 0;
    merged.completedResearch = merged.completedResearch || [];
    merged.activeResearch = null;
    merged.assignedRoutes = merged.assignedRoutes || [];
    merged.priorityStamps = merged.priorityStamps || 0;
    merged.stampProgress = merged.stampProgress || 0;
    merged.buildingLevels = merged.buildingLevels || {};
    merged.employees = merged.employees || [];
    merged.totalEmployeesHired = merged.totalEmployeesHired || 0;

    // Phase 3: Large features
    merged.greatDelayStage = (merged.greatDelayStage || 0) as GameState['greatDelayStage'];
    merged.greatDelayPledged = merged.greatDelayPledged || false;
    merged.kingdom = merged.kingdom || { cities: [], totalEpGenerated: 0 };
    merged.leaderboardSeed = merged.leaderboardSeed || Math.floor(Math.random() * 1e9);
    merged.seasonHighScore = merged.seasonHighScore || 0;
    merged.unlockedAutomation = merged.unlockedAutomation || [];
    merged.enabledAutomation = merged.enabledAutomation || [];

    // Ensure prestige has corporate fields
    merged.prestige.corporateLevel = merged.prestige.corporateLevel || 0;
    merged.prestige.corporatePoints = merged.prestige.corporatePoints || 0;
    merged.prestige.corporateUpgrades = merged.prestige.corporateUpgrades || [];

    return merged;
  }
}
