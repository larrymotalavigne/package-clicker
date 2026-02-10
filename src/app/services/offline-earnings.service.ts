import { Injectable, inject, signal } from '@angular/core';
import { GameStateService } from './game-state.service';
import { UpgradeService } from './upgrade.service';

@Injectable({ providedIn: 'root' })
export class OfflineEarningsService {
  private gameStateService = inject(GameStateService);
  private upgradeService = inject(UpgradeService);

  readonly offlineEarnings = signal<number>(0);
  readonly offlineSeconds = signal<number>(0);

  checkOfflineEarnings(): void {
    const state = this.gameStateService.gameState();
    const lastSave = state.lastSaveTime || state.lastTickTime;
    if (!lastSave) return;

    const now = Date.now();
    const elapsedMs = now - lastSave;
    const elapsedSec = elapsedMs / 1000;

    if (elapsedSec < 60) return; // Less than 1 minute, skip

    const maxOfflineSec = 8 * 3600; // Cap at 8 hours
    const cappedSec = Math.min(elapsedSec, maxOfflineSec);
    const offlineMult = this.getOfflineMultiplier();

    if (offlineMult <= 0) return;

    const pps = state.packagesPerSecond;
    const earned = Math.floor(pps * cappedSec * offlineMult);

    if (earned <= 0) return;

    this.offlineEarnings.set(earned);
    this.offlineSeconds.set(Math.floor(cappedSec));
  }

  claimOfflineEarnings(): void {
    const earned = this.offlineEarnings();
    if (earned <= 0) return;

    const state = this.gameStateService.gameState();
    this.gameStateService.updatePackages(state.packages + earned);
    this.gameStateService.updateTotalPackagesEarned(earned);
    this.offlineEarnings.set(0);
    this.offlineSeconds.set(0);
  }

  getOfflineMultiplier(): number {
    const state = this.gameStateService.gameState();
    let mult = 0;
    for (const uid of state.purchasedUpgrades) {
      const effects = this.upgradeService.getUpgradeEffects(uid);
      for (const e of effects) {
        if (e.type === 'offline_mult') {
          mult += e.value;
        }
      }
    }
    // Loot bonuses
    for (const loot of state.rareLoot) {
      if (loot.effect.type === 'offline_mult') {
        mult += loot.effect.value;
      }
    }
    return Math.min(mult, 1.0); // Cap at 100%
  }
}
