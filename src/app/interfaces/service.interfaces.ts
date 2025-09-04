import { GameState, Achievement, BuildingConfig } from '../models/game.models';
import { BuildingType } from '../types/building-types';

/**
 * Interface for core game state management service.
 * Defines methods for managing game state using Angular signals.
 */
export interface IGameStateService {
  /** Readonly signal providing access to the current game state */
  readonly gameState: any; // Signal type
  /** Readonly signal providing access to achievement definitions */
  readonly achievements: any; // Signal type  
  /** Computed signal that returns the current packages per second rate */
  readonly packagesPerSecond: any; // Computed signal type
  /** Computed signal that calculates the total number of buildings owned */
  readonly totalBuildings: any; // Computed signal type

  /** Updates the current number of packages owned by the player */
  updatePackages(packages: number): void;
  /** Increments the total number of packages earned throughout the game */
  updateTotalPackagesEarned(earned: number): void;
  /** Increments the total number of packages clicked by the player */
  updateTotalPackagesClicked(clicked?: number): void;
  /** Updates a specific building's properties in the game state */
  updateBuilding(buildingType: string, updates: any): void;
  /** Recalculates and updates the total packages per second based on all owned buildings */
  updatePackagesPerSecond(): void;
  /** Adds a new achievement to the player's unlocked achievements list */
  addAchievement(achievementId: string): void;
  /** Resets the entire game state to default values */
  resetState(): void;
}

/**
 * Interface for configuration service that manages game constants, building definitions,
 * achievement definitions, and utility functions.
 */
export interface IConfigService {
  /** Returns a copy of the complete game configuration object */
  getGameConfig(): any;
  /** Gets the game loop interval in milliseconds */
  getGameLoopInterval(): number;
  /** Gets the auto-save interval in milliseconds */
  getAutoSaveInterval(): number;
  /** Gets the base price multiplier used for building cost scaling */
  getBasePriceMultiplier(): number;
  /** Gets the chance percentage for achievement checking optimization */
  getAchievementCheckChance(): number;
  /** Gets the click debounce time in milliseconds for performance optimization */
  getClickDebounceTime(): number;
  /** Gets the maximum number of save operation retries */
  getMaxSaveRetries(): number;
  /** Gets the current save system version for compatibility checking */
  getSaveVersion(): string;
  /** Gets the localStorage key used for saving game data */
  getStorageKey(): string;

  /** Returns a copy of all building configurations */
  getBuildingConfigs(): BuildingConfig[];
  /** Gets a specific building configuration by ID */
  getBuildingConfig(buildingId: string): BuildingConfig | undefined;
  /** Gets all valid building IDs */
  getBuildingIds(): string[];
  /** Type guard to check if a string is a valid building type */
  isBuildingType(value: string): value is BuildingType;

  /** Returns a copy of all achievement definitions */
  getAchievementDefinitions(): Achievement[];
  /** Gets a specific achievement definition by ID */
  getAchievementDefinition(achievementId: string): Achievement | undefined;
  /** Gets all achievements of a specific type */
  getAchievementsByType(type: Achievement['type']): Achievement[];

  /** Calculates the price of a building based on its base price and current count */
  calculateBuildingPrice(basePrice: number, count: number): number;
  /** Formats numbers for display with K/M/B/T suffixes and caching for performance */
  formatNumber(num: number): string;
  /** Checks if the application is running in development mode */
  isDevelopment(): boolean;
  /** Checks if the application is running in production mode */
  isProduction(): boolean;
  /** Gets the appropriate log level based on the current environment */
  getLogLevel(): 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Interface for save service that handles game state persistence.
 */
export interface ISaveService {
  /** Saves the game state to localStorage with error handling and retry logic */
  saveGameState(gameState: GameState): Promise<boolean>;
  /** Loads the game state from localStorage with validation and error recovery */
  loadGameState(): GameState | null;
  /** Creates a backup of the current save */
  createBackup(): boolean;
  /** Exports save data as a downloadable JSON file */
  exportSaveData(): string | null;
  /** Imports save data from a JSON string */
  importSaveData(jsonData: string): boolean;
  /** Lists available backups */
  getAvailableBackups(): Array<{key: string, timestamp: number}>;
  /** Restores from a specific backup */
  restoreFromBackup(backupKey: string): boolean;
}

/**
 * Interface for achievement service that manages achievement tracking and unlocking.
 */
export interface IAchievementService {
  /** Readonly signal providing access to all achievement definitions */
  readonly achievements: any; // Signal type
  /** Readonly signal providing access to the set of unlocked achievement IDs */
  readonly unlockedAchievements: any; // Signal type
  /** Computed signal that returns the number of unlocked achievements */
  readonly unlockedCount: any; // Computed signal type
  /** Computed signal that returns the total number of achievements available */
  readonly totalCount: any; // Computed signal type
  /** Computed signal that calculates the completion percentage */
  readonly completionPercentage: any; // Computed signal type

  /** Sets the unlocked achievements from game state */
  setUnlockedAchievements(unlockedIds: string[]): void;
  /** Checks for newly unlocked achievements based on current game state */
  checkAchievements(gameState: GameState): any; // AchievementCheckResult type
  /** Gets achievement progress for display */
  getAchievementProgress(gameState: GameState): any[]; // AchievementProgress[] type
  /** Gets all achievements sorted by category and unlock status */
  getAchievementsByCategory(): { [category: string]: any[] };
  /** Gets achievements by unlock status */
  getUnlockedAchievements(): Achievement[];
  /** Gets locked achievements */
  getLockedAchievements(): Achievement[];
  /** Gets achievements that are close to being unlocked */
  getAlmostUnlockedAchievements(gameState: GameState): any[]; // AchievementProgress[] type
  /** Manually unlocks an achievement */
  unlockAchievement(achievementId: string): boolean;
  /** Resets all achievements */
  resetAchievements(): void;
  /** Gets statistics about achievement progress */
  getAchievementStats(gameState: GameState): any; // Stats object type
}

/**
 * Interface for game actions service that handles player interactions.
 */
export interface IGameActionsService {
  /** Handles package clicking with debouncing and batch updates */
  clickPackage(): void;
  /** Handles building purchases with validation and optimized updates */
  buyBuilding(buildingType: string): boolean;
  /** Checks if player can afford a building */
  canAffordBuilding(buildingType: string): boolean;
  /** Gets the current price for a building */
  getBuildingPrice(buildingType: string): number;
  /** Resets the entire game state */
  resetGame(): void;
}

// Performance optimization interface
export interface IPerformanceService {
  debounceClick(callback: () => void): void;
  optimizeGameLoop(callback: () => void): void;
  shouldUpdateUI(): boolean;
  measurePerformance(operation: string, fn: () => void): void;
}

// Logging interface
export interface ILogService {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, error?: any, ...args: any[]): void;
  setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void;
}

// Building management interface
export interface IBuildingService {
  getBuildingPrice(buildingType: string, currentCount: number): number;
  canAffordBuilding(buildingType: string, availablePackages: number): boolean;
  purchaseBuilding(buildingType: string): boolean;
  getBuildingStats(buildingType: string): any;
  getTotalBuildingValue(): number;
  getBuildingEfficiency(buildingType: string): number;
}

// Validation interface
export interface IValidationService {
  validateGameState(state: any): boolean;
  validateBuildingPurchase(buildingType: string, packages: number): boolean;
  validateSaveData(data: any): boolean;
  sanitizeInput(input: any): any;
}