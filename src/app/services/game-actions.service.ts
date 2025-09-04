import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { ConfigService } from './config.service';
import { AchievementService } from './achievement.service';
import { SaveService } from './save.service';
import { IGameActionsService } from '../interfaces/service.interfaces';

/**
 * Service responsible for handling all game actions including clicks, building purchases,
 * and passive income generation. Implements performance optimizations like debouncing
 * and batch updates for smooth gameplay experience.
 */
@Injectable({
  providedIn: 'root'
})
export class GameActionsService implements IGameActionsService {
  private lastClickTime = 0;
  private pendingStateUpdates = {
    packages: null as number | null,
    packagesEarned: 0,
    packagesClicked: 0,
    needsPpsUpdate: false,
    needsAchievementCheck: false
  };
  private updatesPending = false;

  constructor(
    private gameStateService: GameStateService,
    private configService: ConfigService,
    private achievementService: AchievementService,
    private saveService: SaveService
  ) {}

  /**
   * Handles package clicking with debouncing and batch updates for optimal performance.
   * Prevents spam clicking and batches state updates for smooth UI experience.
   */
  clickPackage(): void {
    const now = Date.now();
    const debounceTime = this.configService.getClickDebounceTime();
    
    // Debounce rapid clicking
    if (now - this.lastClickTime < debounceTime) {
      return;
    }
    this.lastClickTime = now;

    const currentState = this.gameStateService.gameState();
    const packagesToAdd = currentState.packagesPerClick;

    // Batch the updates instead of immediate state changes
    this.pendingStateUpdates.packages = (this.pendingStateUpdates.packages || currentState.packages) + packagesToAdd;
    this.pendingStateUpdates.packagesEarned += packagesToAdd;
    this.pendingStateUpdates.packagesClicked += 1;
    this.pendingStateUpdates.needsAchievementCheck = true;

    this.scheduleUpdate();
  }

  /**
   * Handles building purchases with validation and optimized updates.
   * Validates affordability, deducts cost, and updates building count with batched state updates.
   * @param buildingType The type of building to purchase
   * @returns True if purchase was successful, false otherwise
   */
  buyBuilding(buildingType: string): boolean {
    if (!this.configService.isBuildingType(buildingType)) {
      console.error(`Invalid building type: ${buildingType}`);
      return false;
    }

    if (!this.canAffordBuilding(buildingType)) {
      return false;
    }

    const currentState = this.gameStateService.gameState();
    const buildingData = currentState.buildings[buildingType as keyof typeof currentState.buildings];
    const price = this.getBuildingPrice(buildingType);

    // Update packages immediately for UI feedback
    this.gameStateService.updatePackages(currentState.packages - price);
    
    // Update building count
    this.gameStateService.updateBuilding(buildingType, {
      count: buildingData.count + 1
    });

    // Schedule optimized updates
    this.pendingStateUpdates.needsPpsUpdate = true;
    this.pendingStateUpdates.needsAchievementCheck = true;
    this.scheduleUpdate();

    return true;
  }

  /**
   * Checks if player can afford a building based on current packages and pending updates.
   * Takes into account both current packages and any pending package updates.
   * @param buildingType The type of building to check affordability for
   * @returns True if the player has enough packages to purchase the building
   */
  canAffordBuilding(buildingType: string): boolean {
    if (!this.configService.isBuildingType(buildingType)) {
      return false;
    }

    const currentState = this.gameStateService.gameState();
    const availablePackages = this.pendingStateUpdates.packages !== null 
      ? this.pendingStateUpdates.packages 
      : currentState.packages;
    
    return availablePackages >= this.getBuildingPrice(buildingType);
  }

  /**
   * Gets the current price for purchasing the next building of the specified type.
   * Price is calculated based on base price and current building count using exponential scaling.
   * @param buildingType The type of building to get the price for
   * @returns The current price of the building, or 0 if building type is invalid
   */
  getBuildingPrice(buildingType: string): number {
    if (!this.configService.isBuildingType(buildingType)) {
      return 0;
    }

    const currentState = this.gameStateService.gameState();
    const buildingData = currentState.buildings[buildingType as keyof typeof currentState.buildings];
    
    return this.configService.calculateBuildingPrice(buildingData.basePrice, buildingData.count);
  }

  /**
   * Generates packages from buildings (called by game loop)
   */
  generatePassiveIncome(): void {
    const currentState = this.gameStateService.gameState();
    
    if (currentState.packagesPerSecond > 0) {
      const packagesToAdd = currentState.packagesPerSecond / 10; // 100ms interval = 1/10 second
      
      this.pendingStateUpdates.packages = (this.pendingStateUpdates.packages || currentState.packages) + packagesToAdd;
      this.pendingStateUpdates.packagesEarned += packagesToAdd;
      
      // Only check achievements periodically for passive income
      if (Math.random() < 0.01) { // 1% chance per game loop
        this.pendingStateUpdates.needsAchievementCheck = true;
      }
      
      this.scheduleUpdate();
    }
  }

  /**
   * Resets the entire game state
   */
  resetGame(): void {
    this.gameStateService.resetState();
    this.achievementService.resetAchievements();
    this.clearPendingUpdates();
  }

  /**
   * Forces immediate processing of all pending updates
   */
  flushPendingUpdates(): void {
    if (!this.updatesPending) {
      return;
    }

    const updates = this.pendingStateUpdates;
    
    // Apply accumulated package changes
    if (updates.packages !== null) {
      this.gameStateService.updatePackages(updates.packages);
    }
    
    if (updates.packagesEarned > 0) {
      this.gameStateService.updateTotalPackagesEarned(updates.packagesEarned);
    }
    
    if (updates.packagesClicked > 0) {
      this.gameStateService.updateTotalPackagesClicked(updates.packagesClicked);
    }

    // Update packages per second if needed
    if (updates.needsPpsUpdate) {
      this.gameStateService.updatePackagesPerSecond();
    }

    // Check achievements if needed
    if (updates.needsAchievementCheck) {
      const currentState = this.gameStateService.gameState();
      const result = this.achievementService.checkAchievements(currentState);
      
      // Add newly unlocked achievements to game state
      for (const achievementId of result.newlyUnlocked) {
        this.gameStateService.addAchievement(achievementId);
      }
    }

    this.clearPendingUpdates();
  }

  /**
   * Gets current game statistics for display
   */
  getGameStats(): {
    totalPackages: number;
    packagesPerSecond: number;
    totalBuildings: number;
    totalClicks: number;
    achievementProgress: number;
  } {
    const currentState = this.gameStateService.gameState();
    const achievementStats = this.achievementService.getAchievementStats(currentState);
    
    return {
      totalPackages: currentState.totalPackagesEarned,
      packagesPerSecond: currentState.packagesPerSecond,
      totalBuildings: this.gameStateService.totalBuildings(),
      totalClicks: currentState.totalPackagesClicked,
      achievementProgress: achievementStats.progressPercentage
    };
  }

  /**
   * Schedules an update to be processed on next frame
   */
  private scheduleUpdate(): void {
    if (this.updatesPending) {
      return;
    }

    this.updatesPending = true;
    
    // Use requestAnimationFrame for smooth UI updates
    requestAnimationFrame(() => {
      this.flushPendingUpdates();
    });
  }

  /**
   * Clears all pending update flags
   */
  private clearPendingUpdates(): void {
    this.pendingStateUpdates = {
      packages: null,
      packagesEarned: 0,
      packagesClicked: 0,
      needsPpsUpdate: false,
      needsAchievementCheck: false
    };
    this.updatesPending = false;
  }

  /**
   * Gets building efficiency (packages per second per cost)
   */
  getBuildingEfficiency(buildingType: string): number {
    if (!this.configService.isBuildingType(buildingType)) {
      return 0;
    }

    const buildingConfig = this.configService.getBuildingConfig(buildingType);
    if (!buildingConfig) {
      return 0;
    }

    const currentState = this.gameStateService.gameState();
    const buildingData = currentState.buildings[buildingType as keyof typeof currentState.buildings];
    const currentPrice = this.configService.calculateBuildingPrice(buildingData.basePrice, buildingData.count);
    
    return buildingConfig.pps / currentPrice;
  }

  /**
   * Gets the most efficient building to buy next
   */
  getMostEfficientBuilding(): { buildingType: string; efficiency: number } | null {
    const buildingTypes = this.configService.getBuildingIds();
    let mostEfficient: { buildingType: string; efficiency: number } | null = null;

    for (const buildingType of buildingTypes) {
      if (this.canAffordBuilding(buildingType)) {
        const efficiency = this.getBuildingEfficiency(buildingType);
        if (!mostEfficient || efficiency > mostEfficient.efficiency) {
          mostEfficient = { buildingType, efficiency };
        }
      }
    }

    return mostEfficient;
  }

  /**
   * Auto-purchases the most efficient building if affordable
   */
  autoBuyMostEfficient(): boolean {
    const mostEfficient = this.getMostEfficientBuilding();
    if (mostEfficient) {
      return this.buyBuilding(mostEfficient.buildingType);
    }
    return false;
  }

  /**
   * Gets total value of all buildings owned
   */
  getTotalBuildingValue(): number {
    const currentState = this.gameStateService.gameState();
    let totalValue = 0;

    for (const [buildingId, building] of Object.entries(currentState.buildings)) {
      if (building.count > 0) {
        const buildingConfig = this.configService.getBuildingConfig(buildingId);
        if (buildingConfig) {
          // Calculate total value based on geometric series sum
          const basePrice = buildingConfig.basePrice;
          const multiplier = this.configService.getBasePriceMultiplier();
          const count = building.count;
          
          // Sum of geometric series: a * (r^n - 1) / (r - 1)
          const totalCost = basePrice * (Math.pow(multiplier, count) - 1) / (multiplier - 1);
          totalValue += totalCost;
        }
      }
    }

    return totalValue;
  }
}