import { Injectable, signal, computed } from '@angular/core';
import { Achievement, GameState } from '../models/game.models';
import { ConfigService } from './config.service';

/**
 * Interface representing the progress status of an achievement.
 */
export interface AchievementProgress {
  /** The achievement definition */
  achievement: Achievement;
  /** Progress percentage (0-100) */
  progress: number;
  /** Whether this achievement is unlocked */
  isUnlocked: boolean;
  /** Whether this achievement was newly unlocked */
  isNew?: boolean;
}

/**
 * Interface representing the result of an achievement check operation.
 */
export interface AchievementCheckResult {
  /** Array of newly unlocked achievement IDs */
  newlyUnlocked: string[];
  /** Total number of unlocked achievements */
  totalUnlocked: number;
  /** Progress information for all achievements */
  totalProgress: AchievementProgress[];
}

/**
 * Service responsible for managing achievements, tracking progress, and handling
 * achievement unlocking with performance optimizations like lazy loading and caching.
 */
@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private _achievements = signal<Achievement[]>([]);
  private _unlockedAchievements = signal<Set<string>>(new Set());
  
  /** Readonly signal providing access to all achievement definitions */
  readonly achievements = this._achievements.asReadonly();
  
  /** Readonly signal providing access to the set of unlocked achievement IDs */
  readonly unlockedAchievements = this._unlockedAchievements.asReadonly();
  
  /** Computed signal that returns the number of unlocked achievements */
  readonly unlockedCount = computed(() => this._unlockedAchievements().size);
  
  /** Computed signal that returns the total number of achievements available */
  readonly totalCount = computed(() => this._achievements().length);
  
  /** Computed signal that calculates the completion percentage (0-100) */
  readonly completionPercentage = computed(() => {
    const total = this.totalCount();
    return total > 0 ? (this.unlockedCount() / total) * 100 : 0;
  });

  private lastCheckTimestamp = 0;
  private checkCooldown = 1000; // Minimum time between full checks
  private progressCache = new Map<string, { progress: number; timestamp: number }>();
  private cacheTtl = 5000; // Cache TTL in milliseconds
  private lazyCheckQueue: Set<string> = new Set();
  private isProcessingQueue = false;

  constructor(private configService: ConfigService) {
    this.initializeAchievements();
  }

  /**
   * Initializes achievements from configuration
   */
  private initializeAchievements(): void {
    const definitions = this.configService.getAchievementDefinitions();
    this._achievements.set(definitions.map(def => ({
      ...def,
      unlocked: false
    })));
  }

  /**
   * Sets the unlocked achievements from game state and updates internal signals.
   * @param unlockedIds Array of achievement IDs that are currently unlocked
   */
  setUnlockedAchievements(unlockedIds: string[]): void {
    this._unlockedAchievements.set(new Set(unlockedIds));
    
    // Update achievement objects
    this._achievements.update(achievements => 
      achievements.map(achievement => ({
        ...achievement,
        unlocked: unlockedIds.includes(achievement.id)
      }))
    );
  }

  /**
   * Checks for newly unlocked achievements based on current game state with lazy loading.
   * Uses performance optimizations including cooldown periods and random sampling.
   * @param gameState The current game state to check against
   * @returns Result containing newly unlocked achievements and progress data
   */
  checkAchievements(gameState: GameState): AchievementCheckResult {
    const now = Date.now();
    const shouldPerformFullCheck = now - this.lastCheckTimestamp > this.checkCooldown;
    
    // Use achievement check chance from config for performance optimization
    if (!shouldPerformFullCheck && Math.random() > this.configService.getAchievementCheckChance()) {
      // Process lazy check queue if not performing full check
      this.processLazyCheckQueue(gameState);
      return this.getEmptyResult();
    }

    return this.performFullAchievementCheck(gameState);
  }

  /**
   * Adds achievements to lazy check queue for processing in batches.
   * @param achievementIds Array of achievement IDs to queue for checking
   */
  queueAchievementCheck(achievementIds: string[]): void {
    for (const id of achievementIds) {
      this.lazyCheckQueue.add(id);
    }
    
    if (!this.isProcessingQueue) {
      this.scheduleQueueProcessing();
    }
  }

  /**
   * Performs full achievement check with caching
   */
  private performFullAchievementCheck(gameState: GameState): AchievementCheckResult {
    const now = Date.now();
    const newlyUnlocked: string[] = [];
    const currentUnlocked = this._unlockedAchievements();
    const progress: AchievementProgress[] = [];

    for (const achievement of this._achievements()) {
      if (currentUnlocked.has(achievement.id)) {
        progress.push({
          achievement,
          progress: 100,
          isUnlocked: true
        });
        continue;
      }

      const cachedProgress = this.getCachedProgress(achievement.id, now);
      const currentProgress = cachedProgress !== null 
        ? cachedProgress 
        : this.calculateAndCacheProgress(achievement, gameState, now);
      
      const isUnlocked = currentProgress >= achievement.requirement;

      if (isUnlocked) {
        newlyUnlocked.push(achievement.id);
        progress.push({
          achievement,
          progress: 100,
          isUnlocked: true,
          isNew: true
        });
      } else {
        progress.push({
          achievement,
          progress: (currentProgress / achievement.requirement) * 100,
          isUnlocked: false
        });
      }
    }

    // Update unlocked achievements if any new ones were found
    if (newlyUnlocked.length > 0) {
      this.unlockMultipleAchievements(newlyUnlocked);
    }

    this.lastCheckTimestamp = now;

    return {
      newlyUnlocked,
      totalUnlocked: currentUnlocked.size + newlyUnlocked.length,
      totalProgress: progress
    };
  }

  /**
   * Processes queued achievements for lazy checking
   */
  private processLazyCheckQueue(gameState: GameState): void {
    if (this.lazyCheckQueue.size === 0 || this.isProcessingQueue) {
      return;
    }

    this.isProcessingQueue = true;
    const now = Date.now();
    const achievementsToCheck = Array.from(this.lazyCheckQueue);
    const newlyUnlocked: string[] = [];

    // Process a limited number of achievements per frame
    const batchSize = Math.min(3, achievementsToCheck.length);
    const batch = achievementsToCheck.slice(0, batchSize);

    for (const achievementId of batch) {
      const achievement = this._achievements().find(a => a.id === achievementId);
      if (!achievement || this._unlockedAchievements().has(achievementId)) {
        this.lazyCheckQueue.delete(achievementId);
        continue;
      }

      const currentProgress = this.calculateAndCacheProgress(achievement, gameState, now);
      if (currentProgress >= achievement.requirement) {
        newlyUnlocked.push(achievementId);
      }
      
      this.lazyCheckQueue.delete(achievementId);
    }

    if (newlyUnlocked.length > 0) {
      this.unlockMultipleAchievements(newlyUnlocked);
    }

    this.isProcessingQueue = false;

    // Schedule next batch if queue is not empty
    if (this.lazyCheckQueue.size > 0) {
      this.scheduleQueueProcessing();
    }
  }

  /**
   * Schedules queue processing for next animation frame
   */
  private scheduleQueueProcessing(): void {
    if (this.isProcessingQueue) {
      return;
    }

    requestAnimationFrame(() => {
      this.processLazyCheckQueue(this.getEmptyGameState()); // Would need actual state
    });
  }

  /**
   * Gets cached progress if available and not expired
   */
  private getCachedProgress(achievementId: string, now: number): number | null {
    const cached = this.progressCache.get(achievementId);
    if (cached && (now - cached.timestamp) < this.cacheTtl) {
      return cached.progress;
    }
    return null;
  }

  /**
   * Calculates and caches achievement progress
   */
  private calculateAndCacheProgress(achievement: Achievement, gameState: GameState, timestamp: number): number {
    const progress = this.calculateProgress(achievement, gameState);
    
    this.progressCache.set(achievement.id, {
      progress,
      timestamp
    });

    return progress;
  }

  /**
   * Unlocks multiple achievements efficiently
   */
  private unlockMultipleAchievements(achievementIds: string[]): void {
    const currentUnlocked = this._unlockedAchievements();
    const updatedUnlocked = new Set([...currentUnlocked, ...achievementIds]);
    this._unlockedAchievements.set(updatedUnlocked);
    
    // Update achievement objects
    this._achievements.update(achievements => 
      achievements.map(achievement => ({
        ...achievement,
        unlocked: updatedUnlocked.has(achievement.id)
      }))
    );
  }

  /**
   * Clears expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.progressCache.entries()) {
      if ((now - value.timestamp) > this.cacheTtl) {
        this.progressCache.delete(key);
      }
    }
  }

  /**
   * Invalidates cache for specific achievement types (called when relevant data changes)
   */
  invalidateCacheForType(type: Achievement['type']): void {
    const achievementsOfType = this.configService.getAchievementsByType(type);
    for (const achievement of achievementsOfType) {
      this.progressCache.delete(achievement.id);
      // Queue for immediate check since data changed
      this.lazyCheckQueue.add(achievement.id);
    }
    
    if (!this.isProcessingQueue) {
      this.scheduleQueueProcessing();
    }
  }

  /**
   * Calculates current progress for a specific achievement
   */
  private calculateProgress(achievement: Achievement, gameState: GameState): number {
    switch (achievement.type) {
      case 'packages':
        return gameState.totalPackagesEarned;
      case 'clicks':
        return gameState.totalPackagesClicked;
      case 'cursor':
      case 'grandma':
      case 'farm':
      case 'mine':
      case 'factory':
      case 'bank':
      case 'warehouse':
      case 'airport':
      case 'spaceport':
      case 'ceo':
        const building = gameState.buildings[achievement.type];
        return building ? building.count : 0;
      default:
        console.warn(`Unknown achievement type: ${achievement.type}`);
        return 0;
    }
  }

  /**
   * Gets achievement progress for display
   */
  getAchievementProgress(gameState: GameState): AchievementProgress[] {
    const currentUnlocked = this._unlockedAchievements();
    
    return this._achievements().map(achievement => {
      const isUnlocked = currentUnlocked.has(achievement.id);
      const currentProgress = this.calculateProgress(achievement, gameState);
      
      return {
        achievement,
        progress: isUnlocked ? 100 : (currentProgress / achievement.requirement) * 100,
        isUnlocked
      };
    });
  }

  /**
   * Gets all achievements sorted by category and unlock status
   */
  getAchievementsByCategory(): { [category: string]: AchievementProgress[] } {
    const gameState = this.getEmptyGameState(); // We'd need current state here
    const progress = this.getAchievementProgress(gameState);
    
    return progress.reduce((categories, item) => {
      const category = this.getCategoryFromType(item.achievement.type);
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
      return categories;
    }, {} as { [category: string]: AchievementProgress[] });
  }

  /**
   * Gets achievements by unlock status
   */
  getUnlockedAchievements(): Achievement[] {
    const unlocked = this._unlockedAchievements();
    return this._achievements().filter(achievement => unlocked.has(achievement.id));
  }

  /**
   * Gets locked achievements
   */
  getLockedAchievements(): Achievement[] {
    const unlocked = this._unlockedAchievements();
    return this._achievements().filter(achievement => !unlocked.has(achievement.id));
  }

  /**
   * Gets achievements that are close to being unlocked (>80% progress)
   */
  getAlmostUnlockedAchievements(gameState: GameState): AchievementProgress[] {
    return this.getAchievementProgress(gameState)
      .filter(progress => !progress.isUnlocked && progress.progress >= 80);
  }

  /**
   * Manually unlocks an achievement (for testing or admin purposes)
   */
  unlockAchievement(achievementId: string): boolean {
    const achievement = this._achievements().find(a => a.id === achievementId);
    if (!achievement) {
      return false;
    }

    const currentUnlocked = this._unlockedAchievements();
    if (!currentUnlocked.has(achievementId)) {
      const updatedUnlocked = new Set([...currentUnlocked, achievementId]);
      this._unlockedAchievements.set(updatedUnlocked);
      
      this._achievements.update(achievements => 
        achievements.map(a => 
          a.id === achievementId ? { ...a, unlocked: true } : a
        )
      );
      
      return true;
    }
    
    return false;
  }

  /**
   * Resets all achievements
   */
  resetAchievements(): void {
    this._unlockedAchievements.set(new Set());
    this._achievements.update(achievements => 
      achievements.map(achievement => ({
        ...achievement,
        unlocked: false
      }))
    );
  }

  /**
   * Gets statistics about achievement progress
   */
  getAchievementStats(gameState: GameState): {
    totalAchievements: number;
    unlockedAchievements: number;
    progressPercentage: number;
    averageProgress: number;
    almostUnlocked: number;
  } {
    const progress = this.getAchievementProgress(gameState);
    const unlocked = progress.filter(p => p.isUnlocked).length;
    const total = progress.length;
    const almostUnlocked = progress.filter(p => !p.isUnlocked && p.progress >= 80).length;
    const averageProgress = total > 0 ? progress.reduce((sum, p) => sum + p.progress, 0) / total : 0;

    return {
      totalAchievements: total,
      unlockedAchievements: unlocked,
      progressPercentage: total > 0 ? (unlocked / total) * 100 : 0,
      averageProgress,
      almostUnlocked
    };
  }

  /**
   * Returns empty check result for performance optimization
   */
  private getEmptyResult(): AchievementCheckResult {
    return {
      newlyUnlocked: [],
      totalUnlocked: this._unlockedAchievements().size,
      totalProgress: []
    };
  }

  /**
   * Maps achievement type to display category
   */
  private getCategoryFromType(type: Achievement['type']): string {
    switch (type) {
      case 'packages':
      case 'clicks':
        return 'Progress';
      case 'cursor':
      case 'grandma':
      case 'farm':
      case 'mine':
      case 'factory':
      case 'bank':
      case 'warehouse':
      case 'airport':
      case 'spaceport':
      case 'ceo':
        return 'Buildings';
      default:
        return 'Other';
    }
  }

  /**
   * Helper method to create empty game state for category grouping
   */
  private getEmptyGameState(): GameState {
    return {
      packages: 0,
      packagesPerSecond: 0,
      packagesPerClick: 1,
      buildings: {} as any,
      achievements: [],
      totalPackagesClicked: 0,
      totalPackagesEarned: 0
    };
  }
}