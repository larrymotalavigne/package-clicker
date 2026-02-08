import { GameState, Achievement, BuildingConfig } from '../models/game.models';
import { BuildingType } from '../types/building-types';

export interface IGameStateService {
  readonly gameState: any;
  readonly packagesPerSecond: any;
  readonly totalBuildings: any;
  updatePackages(packages: number): void;
  updateTotalPackagesEarned(earned: number): void;
  updateTotalPackagesClicked(clicked?: number): void;
  updateBuilding(buildingType: string, updates: any): void;
  updatePackagesPerSecond(pps?: number): void;
  addAchievement(achievementId: string): void;
  addPurchasedUpgrade(upgradeId: string): void;
  resetState(): void;
}

export interface IConfigService {
  getGameLoopInterval(): number;
  getAutoSaveInterval(): number;
  getBasePriceMultiplier(): number;
  getClickDebounceTime(): number;
  getSaveVersion(): string;
  getStorageKey(): string;
  getBuildingConfigs(): BuildingConfig[];
  getBuildingConfig(buildingId: string): BuildingConfig | undefined;
  getBuildingIds(): string[];
  isBuildingType(value: string): value is BuildingType;
  getAchievementDefinitions(): Achievement[];
  calculateBuildingPrice(basePrice: number, count: number): number;
  formatNumber(num: number): string;
}

export interface ISaveService {
  saveGameState(gameState: GameState): Promise<boolean>;
  loadGameState(): GameState | null;
  exportSaveData(): string | null;
  importSaveData(jsonData: string): boolean;
  createBackup(): boolean;
  wipeSave(): void;
}

export interface IGameActionsService {
  clickPackage(): void;
  buyBuilding(buildingType: string): boolean;
  canAffordBuilding(buildingType: string): boolean;
  getBuildingPrice(buildingType: string): number;
  generatePassiveIncome(): void;
  recalculatePps(): void;
  resetGame(): void;
}
