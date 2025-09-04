import { Injectable } from '@angular/core';
import { GameState, Achievement, Building } from '../models/game.models';
import { BUILDING_CONFIGS, getBuildingConfig } from '../config/buildings.config';
import { BuildingType, isBuildingType, validateBuildingType } from '../types/building-types';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameState: GameState = {
    packages: 0,
    packagesPerSecond: 0,
    packagesPerClick: 1,
    buildings: this.initializeBuildings(),
    achievements: [],
    totalPackagesClicked: 0,
    totalPackagesEarned: 0
  };

  private achievementDefinitions: Achievement[] = [
    { id: 'first_package', name: 'First Package!', description: 'Ship your first package', requirement: 1, type: 'packages' },
    { id: 'hundred_packages', name: 'Century Delivery', description: 'Ship 100 packages', requirement: 100, type: 'packages' },
    { id: 'thousand_packages', name: 'Millennium Express', description: 'Ship 1,000 packages', requirement: 1000, type: 'packages' },
    { id: 'first_truck', name: 'Fleet Starter', description: 'Buy your first delivery truck', requirement: 1, type: 'cursor' },
    { id: 'ten_trucks', name: 'Truck Fleet', description: 'Own 10 delivery trucks', requirement: 10, type: 'cursor' },
    { id: 'first_facility', name: 'Industrial Growth', description: 'Build your first sorting facility', requirement: 1, type: 'grandma' },
    { id: 'first_warehouse', name: 'Storage Empire', description: 'Build your first mega warehouse', requirement: 1, type: 'warehouse' },
    { id: 'first_airport', name: 'Sky High Logistics', description: 'Build your first international airport', requirement: 1, type: 'airport' },
    { id: 'first_spaceport', name: 'To Infinity and Beyond', description: 'Build your first space delivery port', requirement: 1, type: 'spaceport' },
    { id: 'first_ceo', name: 'Executive Decision', description: 'Hire Frederic W Smith himself!', requirement: 1, type: 'ceo' },
    { id: 'fast_clicker', name: 'Speed Demon', description: 'Click 100 times', requirement: 100, type: 'clicks' },
    { id: 'million_packages', name: 'Million Mile Delivery', description: 'Ship 1,000,000 packages', requirement: 1000000, type: 'packages' }
  ];

  constructor() {
    this.loadGameState();
    this.updatePackagesPerSecond();
    // Initial check without caring about new achievements
    this.checkAchievements();
  }

  private initializeBuildings(): GameState['buildings'] {
    const buildings: any = {};
    BUILDING_CONFIGS.forEach(config => {
      buildings[config.id] = {
        count: 0,
        basePrice: config.basePrice,
        pps: config.pps
      };
    });
    return buildings as GameState['buildings'];
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  getAchievements(): Achievement[] {
    return this.achievementDefinitions.map(achievement => ({
      ...achievement,
      unlocked: this.gameState.achievements.includes(achievement.id)
    }));
  }

  clickPackage(): Achievement[] {
    this.gameState.packages += this.gameState.packagesPerClick;
    this.gameState.totalPackagesClicked++;
    this.gameState.totalPackagesEarned += this.gameState.packagesPerClick;
    return this.checkAchievements();
  }

  generatePackages(): Achievement[] {
    const newAchievements: Achievement[] = [];
    if (this.gameState.packagesPerSecond > 0) {
      const packagesToAdd = this.gameState.packagesPerSecond / 10;
      this.gameState.packages += packagesToAdd;
      this.gameState.totalPackagesEarned += packagesToAdd;
      
      if (Math.random() < 0.1) {
        newAchievements.push(...this.checkAchievements());
      }
    }
    return newAchievements;
  }

  buyBuilding(buildingType: string): Achievement[] {
    const building = this.gameState.buildings[buildingType as keyof typeof this.gameState.buildings];
    const price = this.getBuildingPrice(buildingType);
    
    if (this.gameState.packages >= price) {
      this.gameState.packages -= price;
      building.count++;
      this.updatePackagesPerSecond();
      return this.checkAchievements();
    }
    return [];
  }

  getBuildingPrice(buildingType: string): number {
    const building = this.gameState.buildings[buildingType as keyof typeof this.gameState.buildings];
    return Math.floor(building.basePrice * Math.pow(1.15, building.count));
  }

  private updatePackagesPerSecond(): void {
    this.gameState.packagesPerSecond = 0;
    Object.values(this.gameState.buildings).forEach(building => {
      this.gameState.packagesPerSecond += building.count * building.pps;
    });
  }

  private checkAchievements(): Achievement[] {
    const newAchievements: Achievement[] = [];
    
    this.achievementDefinitions.forEach(achievement => {
      if (!this.gameState.achievements.includes(achievement.id)) {
        let earned = false;
        
        switch (achievement.type) {
          case 'packages':
            earned = this.gameState.totalPackagesEarned >= achievement.requirement;
            break;
          case 'clicks':
            earned = this.gameState.totalPackagesClicked >= achievement.requirement;
            break;
          default:
            if (achievement.type in this.gameState.buildings) {
              const building = this.gameState.buildings[achievement.type as keyof typeof this.gameState.buildings];
              earned = building.count >= achievement.requirement;
            }
            break;
        }
        
        if (earned) {
          this.gameState.achievements.push(achievement.id);
          newAchievements.push(achievement);
        }
      }
    });
    
    return newAchievements;
  }

  formatNumber(num: number): string {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
  }

  saveGameState(): boolean {
    try {
      // Validate game state before saving
      if (!this.validateGameState(this.gameState)) {
        console.error('Invalid game state, cannot save');
        return false;
      }

      const serializedState = JSON.stringify(this.gameState);
      
      // Check if localStorage is available
      if (typeof Storage === 'undefined') {
        console.error('localStorage is not supported');
        return false;
      }

      localStorage.setItem('packageClickerSave', serializedState);
      
      // Verify the save was successful
      const verification = localStorage.getItem('packageClickerSave');
      if (verification !== serializedState) {
        console.error('Save verification failed');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to save game state:', error);
      return false;
    }
  }

  private loadGameState(): void {
    try {
      // Check if localStorage is available
      if (typeof Storage === 'undefined') {
        console.warn('localStorage is not supported, using default game state');
        return;
      }

      const saved = localStorage.getItem('packageClickerSave');
      if (!saved) {
        console.log('No saved game found, starting fresh');
        return;
      }

      const loadedState = JSON.parse(saved);
      
      // Validate loaded state
      if (!this.validateGameState(loadedState)) {
        console.warn('Corrupted save data detected, falling back to backup or default');
        this.handleCorruptedSave();
        return;
      }

      // Merge loaded state with default state to handle missing properties
      this.gameState = this.mergeGameStates(this.gameState, loadedState);
      console.log('Game state loaded successfully');

    } catch (error) {
      console.error('Failed to load game state:', error);
      this.handleCorruptedSave();
    }
  }

  private validateGameState(state: any): state is GameState {
    if (!state || typeof state !== 'object') {
      return false;
    }

    // Check required properties
    const requiredProperties = ['packages', 'packagesPerSecond', 'packagesPerClick', 'buildings', 'achievements', 'totalPackagesClicked', 'totalPackagesEarned'];
    for (const prop of requiredProperties) {
      if (!(prop in state)) {
        console.error(`Missing required property: ${prop}`);
        return false;
      }
    }

    // Validate numeric properties
    if (typeof state.packages !== 'number' || state.packages < 0) {
      console.error('Invalid packages value');
      return false;
    }

    if (typeof state.packagesPerSecond !== 'number' || state.packagesPerSecond < 0) {
      console.error('Invalid packagesPerSecond value');
      return false;
    }

    // Validate buildings object
    if (!state.buildings || typeof state.buildings !== 'object') {
      console.error('Invalid buildings object');
      return false;
    }

    // Validate each building
    for (const buildingId of Object.keys(state.buildings)) {
      if (!isBuildingType(buildingId)) {
        console.error(`Invalid building type: ${buildingId}`);
        return false;
      }

      const building = state.buildings[buildingId];
      if (!building || typeof building.count !== 'number' || building.count < 0) {
        console.error(`Invalid building data for ${buildingId}`);
        return false;
      }
    }

    // Validate achievements array
    if (!Array.isArray(state.achievements)) {
      console.error('Invalid achievements array');
      return false;
    }

    return true;
  }

  private mergeGameStates(defaultState: GameState, loadedState: Partial<GameState>): GameState {
    const merged = { ...defaultState };

    // Safely merge numeric properties
    if (typeof loadedState.packages === 'number') merged.packages = loadedState.packages;
    if (typeof loadedState.packagesPerSecond === 'number') merged.packagesPerSecond = loadedState.packagesPerSecond;
    if (typeof loadedState.packagesPerClick === 'number') merged.packagesPerClick = loadedState.packagesPerClick;
    if (typeof loadedState.totalPackagesClicked === 'number') merged.totalPackagesClicked = loadedState.totalPackagesClicked;
    if (typeof loadedState.totalPackagesEarned === 'number') merged.totalPackagesEarned = loadedState.totalPackagesEarned;

    // Merge buildings
    if (loadedState.buildings) {
      Object.keys(merged.buildings).forEach(buildingId => {
        if (loadedState.buildings![buildingId as keyof typeof loadedState.buildings]) {
          const loadedBuilding = loadedState.buildings[buildingId as keyof typeof loadedState.buildings];
          if (loadedBuilding && typeof loadedBuilding.count === 'number') {
            merged.buildings[buildingId as keyof typeof merged.buildings].count = loadedBuilding.count;
          }
        }
      });
    }

    // Merge achievements
    if (Array.isArray(loadedState.achievements)) {
      merged.achievements = [...loadedState.achievements];
    }

    return merged;
  }

  private handleCorruptedSave(): void {
    console.warn('Attempting to restore from backup save...');
    
    try {
      const backupSave = localStorage.getItem('packageClickerSave_backup');
      if (backupSave) {
        const backupState = JSON.parse(backupSave);
        if (this.validateGameState(backupState)) {
          this.gameState = this.mergeGameStates(this.gameState, backupState);
          console.log('Restored from backup save');
          return;
        }
      }
    } catch (error) {
      console.error('Backup save also corrupted:', error);
    }

    // Create a backup of the corrupted save for debugging
    try {
      const corruptedSave = localStorage.getItem('packageClickerSave');
      if (corruptedSave) {
        localStorage.setItem('packageClickerSave_corrupted_' + Date.now(), corruptedSave);
      }
    } catch (error) {
      console.error('Failed to backup corrupted save:', error);
    }

    // Remove corrupted save and use default state
    localStorage.removeItem('packageClickerSave');
    console.log('Using default game state due to corrupted save');
  }

  resetGame(): void {
    localStorage.removeItem('packageClickerSave');
    this.gameState = {
      packages: 0,
      packagesPerSecond: 0,
      packagesPerClick: 1,
      buildings: this.initializeBuildings(),
      achievements: [],
      totalPackagesClicked: 0,
      totalPackagesEarned: 0
    };
    this.updatePackagesPerSecond();
  }
}