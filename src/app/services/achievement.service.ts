import { Injectable, signal, computed, inject } from '@angular/core';
import { Achievement, GameState } from '../models/game.models';
import { ConfigService } from './config.service';

export interface AchievementProgress {
  achievement: Achievement;
  progress: number;
  isUnlocked: boolean;
  isNew?: boolean;
}

export interface AchievementCheckResult {
  newlyUnlocked: string[];
  totalUnlocked: number;
  totalProgress: AchievementProgress[];
}

@Injectable({ providedIn: 'root' })
export class AchievementService {
  private _achievements = signal<Achievement[]>([]);
  private _unlockedAchievements = signal<Set<string>>(new Set());

  readonly achievements = this._achievements.asReadonly();
  readonly unlockedAchievements = this._unlockedAchievements.asReadonly();
  readonly unlockedCount = computed(
    () => this._unlockedAchievements().size
  );
  readonly totalCount = computed(() => this._achievements().length);
  readonly completionPercentage = computed(() => {
    const t = this.totalCount();
    return t > 0 ? (this.unlockedCount() / t) * 100 : 0;
  });

  private lastCheckTimestamp = 0;
  private checkCooldown = 1000;
  private progressCache = new Map<
    string,
    { progress: number; timestamp: number }
  >();
  private cacheTtl = 5000;

  private configService = inject(ConfigService);

  constructor() {
    this.initializeAchievements();
  }

  private initializeAchievements(): void {
    const defs = this.configService.getAchievementDefinitions();
    this._achievements.set(
      defs.map((d) => ({ ...d, unlocked: false }))
    );
  }

  setUnlockedAchievements(unlockedIds: string[]): void {
    this._unlockedAchievements.set(new Set(unlockedIds));
    this._achievements.update((all) =>
      all.map((a) => ({
        ...a,
        unlocked: unlockedIds.includes(a.id),
      }))
    );
  }

  checkAchievements(gameState: GameState): AchievementCheckResult {
    const now = Date.now();
    const fullCheck =
      now - this.lastCheckTimestamp > this.checkCooldown;
    if (
      !fullCheck &&
      Math.random() > this.configService.getAchievementCheckChance()
    ) {
      return this.getEmptyResult();
    }
    return this.performFullCheck(gameState);
  }

  private performFullCheck(
    gameState: GameState
  ): AchievementCheckResult {
    const now = Date.now();
    const newlyUnlocked: string[] = [];
    const current = this._unlockedAchievements();
    const progress: AchievementProgress[] = [];

    for (const ach of this._achievements()) {
      if (current.has(ach.id)) {
        progress.push({
          achievement: ach,
          progress: 100,
          isUnlocked: true,
        });
        continue;
      }

      const cached = this.getCachedProgress(ach.id, now);
      const p =
        cached !== null
          ? cached
          : this.cacheProgress(ach, gameState, now);
      const unlocked = p >= ach.requirement;

      if (unlocked) {
        newlyUnlocked.push(ach.id);
        progress.push({
          achievement: ach,
          progress: 100,
          isUnlocked: true,
          isNew: true,
        });
      } else {
        progress.push({
          achievement: ach,
          progress: (p / ach.requirement) * 100,
          isUnlocked: false,
        });
      }
    }

    if (newlyUnlocked.length > 0) {
      this.unlockMultiple(newlyUnlocked);
    }

    this.lastCheckTimestamp = Date.now();

    return {
      newlyUnlocked,
      totalUnlocked: current.size + newlyUnlocked.length,
      totalProgress: progress,
    };
  }

  private unlockMultiple(ids: string[]): void {
    const updated = new Set([
      ...this._unlockedAchievements(),
      ...ids,
    ]);
    this._unlockedAchievements.set(updated);
    this._achievements.update((all) =>
      all.map((a) => ({ ...a, unlocked: updated.has(a.id) }))
    );
  }

  private calculateProgress(
    ach: Achievement,
    gs: GameState
  ): number {
    switch (ach.type) {
      case 'packages':
        return gs.totalPackagesEarned;
      case 'clicks':
        return gs.totalPackagesClicked;
      case 'pps':
        return gs.packagesPerSecond;
      case 'upgrades':
        return gs.purchasedUpgrades.length;
      case 'golden_clicks':
        return gs.goldenPackageClicks;
      case 'prestige':
        return gs.prestige.level;
      case 'events':
        return gs.totalEventsExperienced;
      default: {
        const b = gs.buildings[ach.type as keyof typeof gs.buildings];
        return b ? b.count : 0;
      }
    }
  }

  getAchievementProgress(gs: GameState): AchievementProgress[] {
    const unlocked = this._unlockedAchievements();
    return this._achievements().map((a) => ({
      achievement: a,
      progress: unlocked.has(a.id)
        ? 100
        : (this.calculateProgress(a, gs) / a.requirement) * 100,
      isUnlocked: unlocked.has(a.id),
    }));
  }

  getAchievementStats(_gs: GameState): {
    totalAchievements: number;
    unlockedAchievements: number;
    progressPercentage: number;
  } {
    const total = this._achievements().length;
    const unlocked = this._unlockedAchievements().size;
    return {
      totalAchievements: total,
      unlockedAchievements: unlocked,
      progressPercentage: total > 0 ? (unlocked / total) * 100 : 0,
    };
  }

  resetAchievements(): void {
    this._unlockedAchievements.set(new Set());
    this._achievements.update((all) =>
      all.map((a) => ({ ...a, unlocked: false }))
    );
  }

  private getCachedProgress(
    id: string,
    now: number
  ): number | null {
    const c = this.progressCache.get(id);
    if (c && now - c.timestamp < this.cacheTtl) return c.progress;
    return null;
  }

  private cacheProgress(
    ach: Achievement,
    gs: GameState,
    ts: number
  ): number {
    const p = this.calculateProgress(ach, gs);
    this.progressCache.set(ach.id, { progress: p, timestamp: ts });
    return p;
  }

  private getEmptyResult(): AchievementCheckResult {
    return {
      newlyUnlocked: [],
      totalUnlocked: this._unlockedAchievements().size,
      totalProgress: [],
    };
  }
}
