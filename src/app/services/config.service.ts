import { Injectable } from '@angular/core';
import { Achievement, BuildingConfig } from '../models/game.models';
import { BuildingType } from '../types/building-types';

export interface GameConfig {
  gameLoop: {
    intervalMs: number;
    autoSaveIntervalMs: number;
  };
  gameplay: {
    basePriceMultiplier: number;
    achievementCheckChance: number;
  };
  performance: {
    clickDebounceMs: number;
    maxSaveRetries: number;
  };
  save: {
    version: string;
    storageKey: string;
  };
}

/**
 * Central configuration service that manages all game constants, building definitions,
 * achievement definitions, and utility functions for the Package Clicker game.
 * Provides centralized access to configuration data and helper methods.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  private readonly gameConfig: GameConfig = {
    gameLoop: {
      intervalMs: 100,
      autoSaveIntervalMs: 30000
    },
    gameplay: {
      basePriceMultiplier: 1.15,
      achievementCheckChance: 0.1
    },
    performance: {
      clickDebounceMs: 50,
      maxSaveRetries: 3
    },
    save: {
      version: '1.0.0',
      storageKey: 'packageClickerSave'
    }
  };

  private readonly buildingConfigs: BuildingConfig[] = [
    {
      id: 'cursor',
      name: 'Cursor',
      description: 'Autoclicks once every 10 seconds.',
      icon: '👆',
      basePrice: 15,
      pps: 0.1
    },
    {
      id: 'grandma',
      name: 'Grandma',
      description: 'A nice grandma to package packages.',
      icon: '👵',
      basePrice: 100,
      pps: 1
    },
    {
      id: 'farm',
      name: 'Farm',
      description: 'Grows package plants.',
      icon: '🌾',
      basePrice: 1100,
      pps: 8
    },
    {
      id: 'mine',
      name: 'Mine',
      description: 'Mines packages from underground.',
      icon: '⛏️',
      basePrice: 12000,
      pps: 47
    },
    {
      id: 'factory',
      name: 'Factory',
      description: 'Produces packages automatically.',
      icon: '🏭',
      basePrice: 130000,
      pps: 260
    },
    {
      id: 'bank',
      name: 'Bank',
      description: 'Generates packages from interest.',
      icon: '🏦',
      basePrice: 1400000,
      pps: 1400
    },
    {
      id: 'warehouse',
      name: 'Warehouse',
      description: 'Stores and distributes packages.',
      icon: '🏭',
      basePrice: 20000000,
      pps: 7800
    },
    {
      id: 'airport',
      name: 'Airport',
      description: 'Ships packages worldwide.',
      icon: '✈️',
      basePrice: 330000000,
      pps: 44000
    },
    {
      id: 'spaceport',
      name: 'Spaceport',
      description: 'Delivers packages to space.',
      icon: '🚀',
      basePrice: 5100000000,
      pps: 260000
    },
    {
      id: 'ceo',
      name: 'CEO',
      description: 'Manages the entire operation.',
      icon: '🤵',
      basePrice: 75000000000,
      pps: 1600000
    }
  ];

  private readonly achievementDefinitions: Achievement[] = [
    {
      id: 'first_click',
      name: 'First Package',
      description: 'Click your first package',
      requirement: 1,
      type: 'clicks'
    },
    {
      id: 'hundred_clicks',
      name: 'Package Clicker',
      description: 'Click 100 packages',
      requirement: 100,
      type: 'clicks'
    },
    {
      id: 'thousand_packages',
      name: 'Package Collector',
      description: 'Earn 1,000 packages',
      requirement: 1000,
      type: 'packages'
    },
    {
      id: 'ten_thousand_packages',
      name: 'Package Hoarder',
      description: 'Earn 10,000 packages',
      requirement: 10000,
      type: 'packages'
    },
    {
      id: 'hundred_thousand_packages',
      name: 'Package Millionaire',
      description: 'Earn 100,000 packages',
      requirement: 100000,
      type: 'packages'
    },
    {
      id: 'first_cursor',
      name: 'First Helper',
      description: 'Buy your first Cursor',
      requirement: 1,
      type: 'cursor'
    },
    {
      id: 'ten_cursors',
      name: 'Cursor Army',
      description: 'Own 10 Cursors',
      requirement: 10,
      type: 'cursor'
    },
    {
      id: 'first_grandma',
      name: 'Grandma\'s Help',
      description: 'Buy your first Grandma',
      requirement: 1,
      type: 'grandma'
    },
    {
      id: 'first_farm',
      name: 'Farming Packages',
      description: 'Buy your first Farm',
      requirement: 1,
      type: 'farm'
    },
    {
      id: 'first_factory',
      name: 'Industrial Revolution',
      description: 'Buy your first Factory',
      requirement: 1,
      type: 'factory'
    },
    {
      id: 'first_ceo',
      name: 'Corporate Success',
      description: 'Buy your first CEO',
      requirement: 1,
      type: 'ceo'
    }
  ];

  /**
   * Returns a copy of the complete game configuration object.
   * @returns A deep copy of the game configuration
   */
  getGameConfig(): GameConfig {
    return { ...this.gameConfig };
  }

  /**
   * Gets the game loop interval in milliseconds.
   * @returns The interval between game loop iterations
   */
  getGameLoopInterval(): number {
    return this.gameConfig.gameLoop.intervalMs;
  }

  /**
   * Gets the auto-save interval in milliseconds.
   * @returns The interval between automatic game saves
   */
  getAutoSaveInterval(): number {
    return this.gameConfig.gameLoop.autoSaveIntervalMs;
  }

  /**
   * Gets the base price multiplier used for building cost scaling.
   * @returns The multiplier applied to building prices for each purchase
   */
  getBasePriceMultiplier(): number {
    return this.gameConfig.gameplay.basePriceMultiplier;
  }

  /**
   * Gets the chance percentage for achievement checking optimization.
   * @returns The probability (0-1) of checking achievements in each game loop
   */
  getAchievementCheckChance(): number {
    return this.gameConfig.gameplay.achievementCheckChance;
  }

  /**
   * Gets the click debounce time in milliseconds for performance optimization.
   * @returns The minimum time between click events to prevent spam
   */
  getClickDebounceTime(): number {
    return this.gameConfig.performance.clickDebounceMs;
  }

  /**
   * Gets the maximum number of save operation retries.
   * @returns The maximum retry attempts for failed save operations
   */
  getMaxSaveRetries(): number {
    return this.gameConfig.performance.maxSaveRetries;
  }

  /**
   * Gets the current save system version for compatibility checking.
   * @returns The version string of the save data format
   */
  getSaveVersion(): string {
    return this.gameConfig.save.version;
  }

  /**
   * Gets the localStorage key used for saving game data.
   * @returns The storage key for game save data
   */
  getStorageKey(): string {
    return this.gameConfig.save.storageKey;
  }

  /**
   * Returns a copy of all building configurations.
   * @returns Array of all available building configurations
   */
  getBuildingConfigs(): BuildingConfig[] {
    return [...this.buildingConfigs];
  }

  /**
   * Gets a specific building configuration by ID.
   * @param buildingId The unique identifier of the building
   * @returns The building configuration or undefined if not found
   */
  getBuildingConfig(buildingId: string): BuildingConfig | undefined {
    return this.buildingConfigs.find(config => config.id === buildingId);
  }

  /**
   * Gets all valid building IDs.
   * @returns Array of all building type identifiers
   */
  getBuildingIds(): string[] {
    return this.buildingConfigs.map(config => config.id);
  }

  /**
   * Type guard to check if a string is a valid building type.
   * @param value The string to validate
   * @returns True if the value is a valid building type
   */
  isBuildingType(value: string): value is BuildingType {
    return this.buildingConfigs.some(config => config.id === value);
  }

  /**
   * Returns a copy of all achievement definitions.
   * @returns Array of all available achievement definitions
   */
  getAchievementDefinitions(): Achievement[] {
    return [...this.achievementDefinitions];
  }

  /**
   * Gets a specific achievement definition by ID.
   * @param achievementId The unique identifier of the achievement
   * @returns The achievement definition or undefined if not found
   */
  getAchievementDefinition(achievementId: string): Achievement | undefined {
    return this.achievementDefinitions.find(achievement => achievement.id === achievementId);
  }

  /**
   * Gets all achievements of a specific type.
   * @param type The type of achievements to filter by
   * @returns Array of achievements matching the specified type
   */
  getAchievementsByType(type: Achievement['type']): Achievement[] {
    return this.achievementDefinitions.filter(achievement => achievement.type === type);
  }

  /**
   * Calculates the price of a building based on its base price and current count.
   * @param basePrice The base price of the building
   * @param count The current number of buildings owned
   * @returns The calculated price for the next building purchase
   */
  calculateBuildingPrice(basePrice: number, count: number): number {
    return Math.floor(basePrice * Math.pow(this.getBasePriceMultiplier(), count));
  }

  // Number formatting cache for performance optimization
  private formatCache = new Map<string, string>();
  private readonly maxCacheSize = 1000;
  private readonly suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  private readonly divisors = [1, 1000, 1000000, 1000000000, 1000000000000, 
                              1000000000000000, 1000000000000000000, 1000000000000000000000,
                              1000000000000000000000000, 1000000000000000000000000000,
                              1000000000000000000000000000000, 1000000000000000000000000000000000];

  /**
   * Formats numbers for display with K/M/B/T suffixes and caching for performance.
   * Uses an optimized algorithm with pre-calculated divisors and LRU cache.
   * @param num The number to format
   * @returns Formatted string with appropriate suffix (e.g., "1.5K", "2.3M")
   */
  formatNumber(num: number): string {
    // Handle edge cases quickly
    if (!isFinite(num) || isNaN(num)) {
      return '0';
    }
    
    if (num < 0) {
      return '-' + this.formatNumber(-num);
    }
    
    // Use cache for frequently formatted numbers
    const cacheKey = num.toString();
    const cached = this.formatCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let result: string;

    // Optimized formatting using pre-calculated divisors
    if (num < 1000) {
      result = Math.floor(num).toString();
    } else {
      // Find the appropriate suffix using binary search for very large numbers
      let suffixIndex = 0;
      for (let i = this.divisors.length - 1; i >= 0; i--) {
        if (num >= this.divisors[i]) {
          suffixIndex = i;
          break;
        }
      }
      
      const divisor = this.divisors[suffixIndex];
      const suffix = this.suffixes[suffixIndex];
      
      if (suffixIndex === 0) {
        result = Math.floor(num).toString();
      } else {
        const quotient = num / divisor;
        // Show decimal places for smaller values, whole numbers for larger
        if (quotient < 10 && suffixIndex <= 3) {
          result = (Math.floor(quotient * 10) / 10).toString() + suffix;
        } else {
          result = Math.floor(quotient).toString() + suffix;
        }
      }
    }

    // Cache the result if cache isn't full
    if (this.formatCache.size < this.maxCacheSize) {
      this.formatCache.set(cacheKey, result);
    } else if (this.formatCache.size >= this.maxCacheSize) {
      // Clear cache when it gets too large (LRU would be better but this is simpler)
      this.formatCache.clear();
      this.formatCache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Optimized formatting for UI display with precision control.
   * @param num The number to format
   * @param precision The number of decimal places to show (default: 2)
   * @returns Formatted string with specified precision and suffix
   */
  formatNumberPrecise(num: number, precision: number = 2): string {
    if (!isFinite(num) || isNaN(num)) {
      return '0';
    }
    
    if (num < 1000) {
      return num.toFixed(precision);
    }

    // Find appropriate suffix
    let suffixIndex = 0;
    for (let i = this.divisors.length - 1; i >= 0; i--) {
      if (num >= this.divisors[i]) {
        suffixIndex = i;
        break;
      }
    }

    const divisor = this.divisors[suffixIndex];
    const suffix = this.suffixes[suffixIndex];
    const quotient = num / divisor;

    return quotient.toFixed(precision) + suffix;
  }

  /**
   * Clears the number format cache (useful for testing or memory management).
   */
  clearFormatCache(): void {
    this.formatCache.clear();
  }

  /**
   * Checks if the application is running in development mode.
   * @returns True if in development environment
   */
  isDevelopment(): boolean {
    return !this.isProduction();
  }

  /**
   * Checks if the application is running in production mode.
   * @returns True if in production environment
   */
  isProduction(): boolean {
    // This could be determined by environment variables or build flags
    return false; // For now, default to development
  }

  /**
   * Gets the appropriate log level based on the current environment.
   * @returns The log level string for the current environment
   */
  getLogLevel(): 'debug' | 'info' | 'warn' | 'error' {
    return this.isDevelopment() ? 'debug' : 'warn';
  }
}