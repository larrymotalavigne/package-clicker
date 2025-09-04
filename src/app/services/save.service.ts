import { Injectable } from '@angular/core';
import { GameState } from '../models/game.models';
import { ConfigService } from './config.service';

/**
 * Interface representing serialized save data with metadata.
 */
export interface SaveData {
  /** The game state to be saved */
  gameState: GameState;
  /** Version of the save format */
  version: string;
  /** Timestamp when the save was created */
  timestamp: number;
  /** Optional checksum for data integrity verification */
  checksum?: string;
}

/**
 * Interface representing the result of save data validation.
 */
export interface SaveValidationResult {
  /** Whether the save data is valid */
  isValid: boolean;
  /** Array of validation error messages */
  errors: string[];
  /** Whether the save data can be recovered if invalid */
  canRecover: boolean;
}

/**
 * Service responsible for saving and loading game state with advanced features
 * including data validation, corruption recovery, backup management, and import/export functionality.
 */
@Injectable({
  providedIn: 'root'
})
export class SaveService {
  private saveRetryCount = 0;

  constructor(private configService: ConfigService) {}

  /**
   * Saves the game state to localStorage with error handling and retry logic.
   * Includes checksum generation for data integrity and automatic cleanup on failure.
   * @param gameState The current game state to save
   * @returns Promise resolving to true if save was successful, false otherwise
   */
  async saveGameState(gameState: GameState): Promise<boolean> {
    try {
      const saveData: SaveData = {
        gameState,
        version: this.configService.getSaveVersion(),
        timestamp: Date.now(),
        checksum: this.generateChecksum(gameState)
      };

      const serializedData = JSON.stringify(saveData);
      localStorage.setItem(this.configService.getStorageKey(), serializedData);
      
      this.saveRetryCount = 0;
      return true;
    } catch (error) {
      console.error('Failed to save game state:', error);
      
      if (this.saveRetryCount < this.configService.getMaxSaveRetries()) {
        this.saveRetryCount++;
        // Try to free up space by removing old saves
        this.cleanupOldSaves();
        return this.saveGameState(gameState);
      }
      
      this.saveRetryCount = 0;
      return false;
    }
  }

  /**
   * Loads the game state from localStorage with validation and error recovery.
   * Validates data integrity, attempts recovery for corrupted saves, and creates backups.
   * @returns The loaded game state or null if no valid save exists
   */
  loadGameState(): GameState | null {
    try {
      const saved = localStorage.getItem(this.configService.getStorageKey());
      if (!saved) {
        return null;
      }

      const saveData: SaveData = JSON.parse(saved);
      const validationResult = this.validateSaveData(saveData);

      if (!validationResult.isValid) {
        if (validationResult.canRecover) {
          console.warn('Save data has issues but can be recovered:', validationResult.errors);
          return this.recoverGameState(saveData);
        } else {
          console.error('Save data is corrupted and cannot be recovered:', validationResult.errors);
          this.backupCorruptedSave(saved);
          return null;
        }
      }

      return saveData.gameState;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }

  /**
   * Creates a backup of the current save
   */
  createBackup(): boolean {
    try {
      const currentSave = localStorage.getItem(this.configService.getStorageKey());
      if (currentSave) {
        const backupKey = `${this.configService.getStorageKey()}_backup_${Date.now()}`;
        localStorage.setItem(backupKey, currentSave);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create backup:', error);
      return false;
    }
  }

  /**
   * Exports save data as a downloadable JSON file
   */
  exportSaveData(): string | null {
    try {
      const saveData = localStorage.getItem(this.configService.getStorageKey());
      if (saveData) {
        const exportData = {
          ...JSON.parse(saveData),
          exportedAt: new Date().toISOString(),
          exportVersion: this.configService.getSaveVersion()
        };
        return JSON.stringify(exportData, null, 2);
      }
      return null;
    } catch (error) {
      console.error('Failed to export save data:', error);
      return null;
    }
  }

  /**
   * Imports save data from a JSON string
   */
  importSaveData(jsonData: string): boolean {
    try {
      const importedData = JSON.parse(jsonData);
      
      // Validate imported data structure
      if (!this.isValidImportData(importedData)) {
        throw new Error('Invalid import data structure');
      }

      // Create backup before importing
      this.createBackup();

      // Store the imported data
      const saveData: SaveData = {
        gameState: importedData.gameState,
        version: importedData.version || this.configService.getSaveVersion(),
        timestamp: Date.now()
      };

      localStorage.setItem(this.configService.getStorageKey(), JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Failed to import save data:', error);
      return false;
    }
  }

  /**
   * Lists available backups
   */
  getAvailableBackups(): Array<{key: string, timestamp: number}> {
    const backups: Array<{key: string, timestamp: number}> = [];
    const storageKey = this.configService.getStorageKey();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${storageKey}_backup_`)) {
        const timestampStr = key.replace(`${storageKey}_backup_`, '');
        const timestamp = parseInt(timestampStr, 10);
        if (!isNaN(timestamp)) {
          backups.push({ key, timestamp });
        }
      }
    }

    return backups.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Restores from a specific backup
   */
  restoreFromBackup(backupKey: string): boolean {
    try {
      const backupData = localStorage.getItem(backupKey);
      if (backupData) {
        localStorage.setItem(this.configService.getStorageKey(), backupData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return false;
    }
  }

  /**
   * Validates save data integrity
   */
  private validateSaveData(saveData: SaveData): SaveValidationResult {
    const errors: string[] = [];
    let canRecover = true;

    // Check basic structure
    if (!saveData.gameState) {
      errors.push('Missing gameState');
      canRecover = false;
    }

    if (!saveData.version) {
      errors.push('Missing version information');
    }

    // Validate gameState structure
    if (saveData.gameState) {
      const gs = saveData.gameState;
      
      if (typeof gs.packages !== 'number' || gs.packages < 0) {
        errors.push('Invalid packages value');
        canRecover = true; // Can default to 0
      }

      if (typeof gs.packagesPerSecond !== 'number' || gs.packagesPerSecond < 0) {
        errors.push('Invalid packagesPerSecond value');
        canRecover = true;
      }

      if (!gs.buildings || typeof gs.buildings !== 'object') {
        errors.push('Missing or invalid buildings data');
        canRecover = false;
      }

      if (!Array.isArray(gs.achievements)) {
        errors.push('Invalid achievements data');
        canRecover = true;
      }
    }

    // Check checksum if present
    if (saveData.checksum && saveData.gameState) {
      const calculatedChecksum = this.generateChecksum(saveData.gameState);
      if (calculatedChecksum !== saveData.checksum) {
        errors.push('Checksum mismatch - data may be corrupted');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      canRecover
    };
  }

  /**
   * Attempts to recover a damaged save file
   */
  private recoverGameState(saveData: SaveData): GameState {
    const defaultState = this.createDefaultGameState();
    const loadedState = saveData.gameState;

    return {
      packages: typeof loadedState.packages === 'number' ? Math.max(0, loadedState.packages) : 0,
      packagesPerSecond: typeof loadedState.packagesPerSecond === 'number' ? Math.max(0, loadedState.packagesPerSecond) : 0,
      packagesPerClick: typeof loadedState.packagesPerClick === 'number' ? Math.max(1, loadedState.packagesPerClick) : 1,
      buildings: this.recoverBuildings(loadedState.buildings, defaultState.buildings),
      achievements: Array.isArray(loadedState.achievements) ? loadedState.achievements : [],
      totalPackagesClicked: typeof loadedState.totalPackagesClicked === 'number' ? Math.max(0, loadedState.totalPackagesClicked) : 0,
      totalPackagesEarned: typeof loadedState.totalPackagesEarned === 'number' ? Math.max(0, loadedState.totalPackagesEarned) : 0
    };
  }

  /**
   * Recovers building data with defaults for missing buildings
   */
  private recoverBuildings(loadedBuildings: any, defaultBuildings: GameState['buildings']): GameState['buildings'] {
    const recovered: any = {};
    
    for (const [buildingId, defaultBuilding] of Object.entries(defaultBuildings)) {
      const loadedBuilding = loadedBuildings?.[buildingId];
      
      if (loadedBuilding && typeof loadedBuilding === 'object') {
        recovered[buildingId] = {
          count: typeof loadedBuilding.count === 'number' ? Math.max(0, Math.floor(loadedBuilding.count)) : 0,
          basePrice: typeof loadedBuilding.basePrice === 'number' ? loadedBuilding.basePrice : defaultBuilding.basePrice,
          pps: typeof loadedBuilding.pps === 'number' ? loadedBuilding.pps : defaultBuilding.pps
        };
      } else {
        recovered[buildingId] = { ...defaultBuilding };
      }
    }
    
    return recovered;
  }

  /**
   * Creates a default game state
   */
  private createDefaultGameState(): GameState {
    const buildings: any = {};
    this.configService.getBuildingConfigs().forEach(config => {
      buildings[config.id] = {
        count: 0,
        basePrice: config.basePrice,
        pps: config.pps
      };
    });

    return {
      packages: 0,
      packagesPerSecond: 0,
      packagesPerClick: 1,
      buildings,
      achievements: [],
      totalPackagesClicked: 0,
      totalPackagesEarned: 0
    };
  }

  /**
   * Generates a simple checksum for data integrity
   */
  private generateChecksum(gameState: GameState): string {
    const str = JSON.stringify(gameState);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Backs up corrupted save data for debugging
   */
  private backupCorruptedSave(corruptedData: string): void {
    try {
      const corruptedKey = `${this.configService.getStorageKey()}_corrupted_${Date.now()}`;
      localStorage.setItem(corruptedKey, corruptedData);
    } catch (error) {
      console.error('Failed to backup corrupted save:', error);
    }
  }

  /**
   * Cleans up old save files to free storage space
   */
  private cleanupOldSaves(): void {
    try {
      const storageKey = this.configService.getStorageKey();
      const keysToRemove: string[] = [];

      // Find old backup files (keep only the 5 most recent)
      const backups = this.getAvailableBackups();
      if (backups.length > 5) {
        keysToRemove.push(...backups.slice(5).map(backup => backup.key));
      }

      // Find old corrupted saves (keep only the 3 most recent)
      const corruptedSaves: Array<{key: string, timestamp: number}> = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${storageKey}_corrupted_`)) {
          const timestampStr = key.replace(`${storageKey}_corrupted_`, '');
          const timestamp = parseInt(timestampStr, 10);
          if (!isNaN(timestamp)) {
            corruptedSaves.push({ key, timestamp });
          }
        }
      }
      
      corruptedSaves.sort((a, b) => b.timestamp - a.timestamp);
      if (corruptedSaves.length > 3) {
        keysToRemove.push(...corruptedSaves.slice(3).map(save => save.key));
      }

      // Remove old saves
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove old save: ${key}`, error);
        }
      });
    } catch (error) {
      console.error('Failed to cleanup old saves:', error);
    }
  }

  /**
   * Validates imported data structure
   */
  private isValidImportData(data: any): boolean {
    return data && 
           typeof data === 'object' && 
           data.gameState && 
           typeof data.gameState === 'object';
  }
}