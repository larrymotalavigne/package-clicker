import { Injectable, signal, computed, effect } from '@angular/core';
import { GameState, Achievement, Building } from '../models/game.models';
import { BUILDING_CONFIGS, getBuildingConfig } from '../config/buildings.config';
import { BuildingType, isBuildingType, validateBuildingType } from '../types/building-types';

/**
 * Service responsible for managing the core game state using Angular signals.
 * Provides reactive access to game data and handles state persistence.
 */
@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  // Core game state signals
  private _gameState = signal<GameState>(this.getDefaultGameState());
  private _achievements = signal<Achievement[]>([]);
  
  /** Readonly signal providing access to the current game state */
  readonly gameState = this._gameState.asReadonly();
  
  /** Readonly signal providing access to achievement definitions */
  readonly achievements = this._achievements.asReadonly();
  
  /** Computed signal that returns the current packages per second rate */
  readonly packagesPerSecond = computed(() => this._gameState().packagesPerSecond);
  
  /** Computed signal that calculates the total number of buildings owned */
  readonly totalBuildings = computed(() => {
    const buildings = this._gameState().buildings;
    return Object.values(buildings).reduce((total, building) => total + building.count, 0);
  });

  constructor() {
    // Auto-save effect - saves when state changes
    effect(() => {
      this.saveToLocalStorage();
    });
    
    // Load initial state
    this.loadFromLocalStorage();
    this.initializeAchievements();
  }

  /**
   * Updates the current number of packages owned by the player.
   * @param packages The new total number of packages
   */
  updatePackages(packages: number): void {
    this._gameState.update(state => ({
      ...state,
      packages
    }));
  }

  /**
   * Increments the total number of packages earned throughout the game.
   * @param earned The number of packages to add to the total earned count
   */
  updateTotalPackagesEarned(earned: number): void {
    this._gameState.update(state => ({
      ...state,
      totalPackagesEarned: state.totalPackagesEarned + earned
    }));
  }

  /**
   * Increments the total number of packages clicked by the player.
   * @param clicked The number of clicks to add (defaults to 1)
   */
  updateTotalPackagesClicked(clicked: number = 1): void {
    this._gameState.update(state => ({
      ...state,
      totalPackagesClicked: state.totalPackagesClicked + clicked
    }));
  }

  /**
   * Updates a specific building's properties in the game state.
   * @param buildingType The type of building to update
   * @param updates Partial building data to merge with existing data
   * @throws Error if buildingType is not valid
   */
  updateBuilding(buildingType: string, updates: Partial<Building>): void {
    if (!isBuildingType(buildingType)) {
      throw new Error(`Invalid building type: ${buildingType}`);
    }

    this._gameState.update(state => ({
      ...state,
      buildings: {
        ...state.buildings,
        [buildingType]: {
          ...state.buildings[buildingType as BuildingType],
          ...updates
        }
      }
    }));
  }

  /**
   * Recalculates and updates the total packages per second based on all owned buildings.
   */
  updatePackagesPerSecond(): void {
    const currentState = this._gameState();
    const newPps = Object.entries(currentState.buildings)
      .reduce((total, [_, building]) => total + (building.count * building.pps), 0);
    
    this._gameState.update(state => ({
      ...state,
      packagesPerSecond: newPps
    }));
  }

  /**
   * Adds a new achievement to the player's unlocked achievements list.
   * @param achievementId The unique identifier of the achievement to unlock
   */
  addAchievement(achievementId: string): void {
    this._gameState.update(state => ({
      ...state,
      achievements: [...state.achievements, achievementId]
    }));

    this._achievements.update(achievements => 
      achievements.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, unlocked: true }
          : achievement
      )
    );
  }

  /**
   * Resets the entire game state to default values and reinitializes achievements.
   */
  resetState(): void {
    this._gameState.set(this.getDefaultGameState());
    this.initializeAchievements();
  }

  // Private helper methods
  private getDefaultGameState(): GameState {
    const buildings: any = {};
    BUILDING_CONFIGS.forEach(config => {
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

  private initializeAchievements(): void {
    // Initialize achievement definitions (this would be moved to a separate service later)
    const achievementDefinitions: Achievement[] = [
      { id: 'first_click', name: 'First Package', description: 'Click your first package', requirement: 1, type: 'clicks' },
      { id: 'hundred_clicks', name: 'Package Clicker', description: 'Click 100 packages', requirement: 100, type: 'clicks' },
      { id: 'thousand_packages', name: 'Package Collector', description: 'Earn 1,000 packages', requirement: 1000, type: 'packages' },
      { id: 'ten_thousand_packages', name: 'Package Hoarder', description: 'Earn 10,000 packages', requirement: 10000, type: 'packages' },
      { id: 'hundred_thousand_packages', name: 'Package Millionaire', description: 'Earn 100,000 packages', requirement: 100000, type: 'packages' },
      { id: 'first_cursor', name: 'First Helper', description: 'Buy your first Cursor', requirement: 1, type: 'cursor' },
      { id: 'ten_cursors', name: 'Cursor Army', description: 'Own 10 Cursors', requirement: 10, type: 'cursor' },
      { id: 'first_grandma', name: 'Grandma\'s Help', description: 'Buy your first Grandma', requirement: 1, type: 'grandma' },
      { id: 'first_farm', name: 'Farming Packages', description: 'Buy your first Farm', requirement: 1, type: 'farm' },
      { id: 'first_factory', name: 'Industrial Revolution', description: 'Buy your first Factory', requirement: 1, type: 'factory' },
      { id: 'first_ceo', name: 'Corporate Success', description: 'Buy your first CEO', requirement: 1, type: 'ceo' }
    ];

    this._achievements.set(achievementDefinitions.map(achievement => ({
      ...achievement,
      unlocked: this._gameState().achievements.includes(achievement.id)
    })));
  }

  private saveToLocalStorage(): void {
    try {
      const stateToSave = {
        ...this._gameState(),
        version: '1.0.0',
        timestamp: Date.now()
      };
      localStorage.setItem('packageClickerSave', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('packageClickerSave');
      if (saved) {
        const parsedState = JSON.parse(saved);
        if (this.validateGameState(parsedState)) {
          this._gameState.set(this.mergeWithDefaults(parsedState));
        }
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  }

  private validateGameState(state: any): boolean {
    return state && 
           typeof state.packages === 'number' && 
           typeof state.packagesPerSecond === 'number' && 
           typeof state.packagesPerClick === 'number' &&
           typeof state.buildings === 'object' &&
           Array.isArray(state.achievements);
  }

  private mergeWithDefaults(loadedState: any): GameState {
    const defaultState = this.getDefaultGameState();
    return {
      ...defaultState,
      ...loadedState,
      buildings: {
        ...defaultState.buildings,
        ...loadedState.buildings
      }
    };
  }
}