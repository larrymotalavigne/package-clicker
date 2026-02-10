import { Injectable, inject, computed } from '@angular/core';
import { GameStateService } from './game-state.service';
import { LORE_ENTRIES } from '../config/lore.config';
import { LoreEntry } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class LoreService {
  private gameStateService = inject(GameStateService);

  readonly unlockedLore = computed(() => {
    const ids = this.gameStateService.gameState().loreUnlocked;
    return LORE_ENTRIES.filter(l => ids.includes(l.id));
  });

  readonly unlockedCount = computed(() => this.unlockedLore().length);
  readonly totalCount = LORE_ENTRIES.length;

  readonly newlyAvailable = computed(() => {
    const state = this.gameStateService.gameState();
    const unlocked = state.loreUnlocked;
    return LORE_ENTRIES.filter(l => !unlocked.includes(l.id) && this.meetsRequirement(l, state));
  });

  checkLoreUnlocks(): string[] {
    const state = this.gameStateService.gameState();
    const unlocked = state.loreUnlocked;
    const newEntries: string[] = [];

    for (const entry of LORE_ENTRIES) {
      if (unlocked.includes(entry.id)) continue;
      if (this.meetsRequirement(entry, state)) {
        newEntries.push(entry.id);
      }
    }

    if (newEntries.length > 0) {
      this.gameStateService.unlockLore(newEntries);
    }

    return newEntries;
  }

  getLoreEntry(id: string): LoreEntry | undefined {
    return LORE_ENTRIES.find(l => l.id === id);
  }

  private meetsRequirement(entry: LoreEntry, state: ReturnType<GameStateService['gameState']>): boolean {
    const req = entry.requirement;
    switch (req.type) {
      case 'packages':
        return state.totalPackagesEarned >= req.value;
      case 'clicks':
        return state.totalPackagesClicked >= req.value;
      case 'prestige':
        return state.prestige.timesAscended >= req.value;
      case 'events':
        return state.totalEventsExperienced >= req.value;
      case 'challenges':
        return state.completedChallenges.length >= req.value;
      case 'pps':
        return state.packagesPerSecond >= req.value;
      case 'buildings':
        if (req.buildingType) {
          return (state.buildings[req.buildingType]?.count ?? 0) >= req.value;
        }
        return Object.values(state.buildings).reduce((t, b) => t + b.count, 0) >= req.value;
      default:
        return false;
    }
  }
}
