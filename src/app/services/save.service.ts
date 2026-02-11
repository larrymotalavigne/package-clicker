import { Injectable, inject } from '@angular/core';
import { GameState } from '../models/game.models';
import { ConfigService } from './config.service';
import { GameStateService } from './game-state.service';

export interface SaveData {
  gameState: GameState;
  version: string;
  timestamp: number;
  checksum?: string;
}

@Injectable({ providedIn: 'root' })
export class SaveService {
  private saveRetryCount = 0;

  private configService = inject(ConfigService);
  private gameStateService = inject(GameStateService);

  async saveGameState(gameState: GameState): Promise<boolean> {
    try {
      const saveData: SaveData = {
        gameState,
        version: this.configService.getSaveVersion(),
        timestamp: Date.now(),
        checksum: this.generateChecksum(gameState),
      };
      localStorage.setItem(
        this.configService.getStorageKey(),
        JSON.stringify(saveData)
      );
      this.saveRetryCount = 0;
      return true;
    } catch (error) {
      console.error('Failed to save game state:', error);
      if (
        this.saveRetryCount < this.configService.getMaxSaveRetries()
      ) {
        this.saveRetryCount++;
        this.cleanupOldSaves();
        return this.saveGameState(gameState);
      }
      this.saveRetryCount = 0;
      return false;
    }
  }

  loadGameState(): GameState | null {
    try {
      const saved = localStorage.getItem(
        this.configService.getStorageKey()
      );
      if (!saved) return null;

      const data = JSON.parse(saved);
      const gs = data.gameState || data;

      if (!this.isValidGameState(gs)) {
        console.error('Invalid save data');
        return null;
      }

      return this.migrateState(gs, data.version);
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }

  exportSaveData(): string | null {
    try {
      const data = localStorage.getItem(
        this.configService.getStorageKey()
      );
      if (!data) return null;
      return JSON.stringify(
        { ...JSON.parse(data), exportedAt: new Date().toISOString() },
        null,
        2
      );
    } catch {
      return null;
    }
  }

  importSaveData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      const gs = imported.gameState || imported;
      if (!this.isValidGameState(gs)) return false;

      this.createBackup();
      const migrated = this.migrateState(gs, imported.version);
      const saveData: SaveData = {
        gameState: migrated,
        version: this.configService.getSaveVersion(),
        timestamp: Date.now(),
      };
      localStorage.setItem(
        this.configService.getStorageKey(),
        JSON.stringify(saveData)
      );
      this.gameStateService.setFullState(migrated);
      return true;
    } catch {
      return false;
    }
  }

  createBackup(): boolean {
    try {
      const current = localStorage.getItem(
        this.configService.getStorageKey()
      );
      if (current) {
        const key = `${this.configService.getStorageKey()}_backup_${Date.now()}`;
        localStorage.setItem(key, current);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  wipeSave(): void {
    localStorage.removeItem(this.configService.getStorageKey());
    this.gameStateService.resetState();
  }

  private migrateState(
    gs: Record<string, unknown>,
    _version?: string
  ): GameState {
    const defaults = this.gameStateService.getDefaultGameState();

    const migrated = { ...defaults } as GameState;

    // Core fields from v1
    if (typeof gs['packages'] === 'number')
      migrated.packages = gs['packages'] as number;
    if (typeof gs['packagesPerSecond'] === 'number')
      migrated.packagesPerSecond = gs['packagesPerSecond'] as number;
    if (typeof gs['packagesPerClick'] === 'number')
      migrated.packagesPerClick = gs['packagesPerClick'] as number;
    if (typeof gs['totalPackagesClicked'] === 'number')
      migrated.totalPackagesClicked = gs['totalPackagesClicked'] as number;
    if (typeof gs['totalPackagesEarned'] === 'number')
      migrated.totalPackagesEarned = gs['totalPackagesEarned'] as number;
    if (Array.isArray(gs['achievements']))
      migrated.achievements = this.migrateAchievements(
        gs['achievements'] as string[]
      );

    // Buildings
    const loadedBuildings = gs['buildings'] as
      | Record<string, { count: number; basePrice: number; pps: number }>
      | undefined;
    if (loadedBuildings && typeof loadedBuildings === 'object') {
      for (const key of Object.keys(defaults.buildings)) {
        const lb = loadedBuildings[key];
        if (lb && typeof lb.count === 'number') {
          (migrated.buildings as Record<string, typeof lb>)[key] = {
            ...defaults.buildings[key as keyof typeof defaults.buildings],
            count: Math.max(0, lb.count),
          };
        }
      }
    }

    // v2 fields with defaults
    if (Array.isArray(gs['purchasedUpgrades']))
      migrated.purchasedUpgrades = gs['purchasedUpgrades'] as string[];
    if (gs['prestige'] && typeof gs['prestige'] === 'object')
      migrated.prestige = {
        ...defaults.prestige,
        ...(gs['prestige'] as object),
      };
    if (typeof gs['goldenPackageClicks'] === 'number')
      migrated.goldenPackageClicks = gs['goldenPackageClicks'] as number;
    if (gs['settings'] && typeof gs['settings'] === 'object')
      migrated.settings = {
        ...defaults.settings,
        ...(gs['settings'] as object),
      };
    if (typeof gs['totalBuildingsEver'] === 'number')
      migrated.totalBuildingsEver = gs['totalBuildingsEver'] as number;
    if (typeof gs['totalPlayTime'] === 'number')
      migrated.totalPlayTime = gs['totalPlayTime'] as number;
    if (Array.isArray(gs['activeBuffs']))
      migrated.activeBuffs = gs['activeBuffs'] as GameState['activeBuffs'];
    if (typeof gs['totalEventsExperienced'] === 'number')
      migrated.totalEventsExperienced = gs['totalEventsExperienced'] as number;

    // Always reset ephemeral state
    migrated.wrinklers = [];
    migrated.activeEvents = [];
    migrated.lastTickTime = Date.now();

    // New fields migration
    if (typeof gs['expressPoints'] === 'number')
      migrated.expressPoints = gs['expressPoints'] as number;
    if (typeof gs['totalExpressPointsEarned'] === 'number')
      migrated.totalExpressPointsEarned = gs['totalExpressPointsEarned'] as number;
    if (Array.isArray(gs['rareLoot']))
      migrated.rareLoot = gs['rareLoot'] as GameState['rareLoot'];
    migrated.activeChallenge = null;
    if (Array.isArray(gs['completedChallenges']))
      migrated.completedChallenges = gs['completedChallenges'] as string[];
    if (Array.isArray(gs['loreUnlocked']))
      migrated.loreUnlocked = gs['loreUnlocked'] as string[];
    if (typeof gs['lastSaveTime'] === 'number')
      migrated.lastSaveTime = gs['lastSaveTime'] as number;

    // Contracts
    if (Array.isArray(gs['completedContractIds']))
      migrated.completedContractIds = gs['completedContractIds'] as string[];
    if (typeof gs['totalContractsCompleted'] === 'number')
      migrated.totalContractsCompleted = gs['totalContractsCompleted'] as number;

    // Phase 1: Small features
    if (typeof gs['dailyStreak'] === 'number')
      migrated.dailyStreak = gs['dailyStreak'] as number;
    if (typeof gs['lastLoginDate'] === 'string')
      migrated.lastLoginDate = gs['lastLoginDate'] as string;
    if (typeof gs['totalDaysPlayed'] === 'number')
      migrated.totalDaysPlayed = gs['totalDaysPlayed'] as number;
    if (gs['packageTypeCounts'] && typeof gs['packageTypeCounts'] === 'object')
      migrated.packageTypeCounts = gs['packageTypeCounts'] as Record<string, number>;
    if (typeof gs['autoBuyUnlocked'] === 'boolean')
      migrated.autoBuyUnlocked = gs['autoBuyUnlocked'] as boolean;
    if (typeof gs['autoBuyEnabled'] === 'boolean')
      migrated.autoBuyEnabled = gs['autoBuyEnabled'] as boolean;
    if (typeof gs['autoBuyInterval'] === 'number')
      migrated.autoBuyInterval = gs['autoBuyInterval'] as number;

    // Phase 2: Medium features
    if (gs['stockPortfolio'] && typeof gs['stockPortfolio'] === 'object')
      migrated.stockPortfolio = gs['stockPortfolio'] as Record<string, number>;
    if (typeof gs['stockProfitTotal'] === 'number')
      migrated.stockProfitTotal = gs['stockProfitTotal'] as number;
    if (Array.isArray(gs['completedResearch']))
      migrated.completedResearch = gs['completedResearch'] as string[];
    migrated.activeResearch = null;
    if (Array.isArray(gs['assignedRoutes']))
      migrated.assignedRoutes = gs['assignedRoutes'] as string[];
    if (typeof gs['priorityStamps'] === 'number')
      migrated.priorityStamps = gs['priorityStamps'] as number;
    if (typeof gs['stampProgress'] === 'number')
      migrated.stampProgress = gs['stampProgress'] as number;
    if (gs['buildingLevels'] && typeof gs['buildingLevels'] === 'object')
      migrated.buildingLevels = gs['buildingLevels'] as Record<string, number>;
    if (Array.isArray(gs['employees']))
      migrated.employees = gs['employees'] as GameState['employees'];
    if (typeof gs['totalEmployeesHired'] === 'number')
      migrated.totalEmployeesHired = gs['totalEmployeesHired'] as number;

    // Phase 3: Large features
    if (typeof gs['greatDelayStage'] === 'number')
      migrated.greatDelayStage = gs['greatDelayStage'] as GameState['greatDelayStage'];
    if (typeof gs['greatDelayPledged'] === 'boolean')
      migrated.greatDelayPledged = gs['greatDelayPledged'] as boolean;
    if (gs['kingdom'] && typeof gs['kingdom'] === 'object')
      migrated.kingdom = gs['kingdom'] as GameState['kingdom'];
    if (typeof gs['leaderboardSeed'] === 'number')
      migrated.leaderboardSeed = gs['leaderboardSeed'] as number;
    if (typeof gs['seasonHighScore'] === 'number')
      migrated.seasonHighScore = gs['seasonHighScore'] as number;
    if (Array.isArray(gs['unlockedAutomation']))
      migrated.unlockedAutomation = gs['unlockedAutomation'] as string[];
    if (Array.isArray(gs['enabledAutomation']))
      migrated.enabledAutomation = gs['enabledAutomation'] as string[];

    // Prestige corporate fields
    const prestObj = gs['prestige'] as Record<string, unknown> | undefined;
    if (prestObj) {
      if (typeof prestObj['corporateLevel'] === 'number')
        migrated.prestige.corporateLevel = prestObj['corporateLevel'] as number;
      if (typeof prestObj['corporatePoints'] === 'number')
        migrated.prestige.corporatePoints = prestObj['corporatePoints'] as number;
      if (Array.isArray(prestObj['corporateUpgrades']))
        migrated.prestige.corporateUpgrades = prestObj['corporateUpgrades'] as string[];
    }

    // Ensure prestige totalEarnedAllTime is at least totalPackagesEarned
    if (
      migrated.prestige.totalEarnedAllTime < migrated.totalPackagesEarned
    ) {
      migrated.prestige.totalEarnedAllTime =
        migrated.totalPackagesEarned;
    }

    return migrated;
  }

  private migrateAchievements(old: string[]): string[] {
    const LEGACY_MAP: Record<string, string> = {
      first_click: 'click_1',
      hundred_clicks: 'click_100',
      thousand_packages: 'pkg_1k',
      ten_thousand_packages: 'pkg_10k',
      hundred_thousand_packages: 'pkg_100k',
      first_cursor: 'cursor_1',
      ten_cursors: 'cursor_10',
      first_grandma: 'grandma_1',
      first_farm: 'farm_1',
      first_factory: 'factory_1',
      first_ceo: 'ceo_1',
      first_package: 'pkg_1',
      hundred_packages: 'pkg_100',
      first_truck: 'cursor_1',
      ten_trucks: 'cursor_10',
      first_facility: 'grandma_1',
      first_warehouse: 'warehouse_1',
      first_airport: 'airport_1',
      first_spaceport: 'spaceport_1',
      fast_clicker: 'click_100',
      million_packages: 'pkg_1m',
    };

    return old.map((id) => LEGACY_MAP[id] || id);
  }

  private isValidGameState(state: unknown): boolean {
    const s = state as Record<string, unknown>;
    return (
      !!s &&
      typeof s['packages'] === 'number' &&
      typeof s['buildings'] === 'object' &&
      Array.isArray(s['achievements'])
    );
  }

  private generateChecksum(gs: GameState): string {
    const str = JSON.stringify(gs);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private cleanupOldSaves(): void {
    try {
      const key = this.configService.getStorageKey();
      const backups: { k: string; t: number }[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(`${key}_backup_`)) {
          const t = parseInt(k.replace(`${key}_backup_`, ''), 10);
          if (!isNaN(t)) backups.push({ k, t });
        }
      }
      backups.sort((a, b) => b.t - a.t);
      for (const b of backups.slice(5)) {
        localStorage.removeItem(b.k);
      }
    } catch {
      // ignore
    }
  }
}
