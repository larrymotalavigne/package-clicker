import { Injectable, inject, signal } from '@angular/core';
import { GameStateService } from './game-state.service';
import { RARE_LOOT_DEFINITIONS } from '../config/rare-loot.config';
import { RareLoot } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class RareLootService {
  private gameStateService = inject(GameStateService);

  readonly lastDrop = signal<RareLoot | null>(null);

  rollForLoot(): RareLoot | null {
    const droppable = RARE_LOOT_DEFINITIONS.filter(l => l.dropWeight > 0);
    const totalWeight = droppable.reduce((t, l) => t + l.dropWeight, 0);

    let roll = Math.random() * totalWeight;
    for (const config of droppable) {
      roll -= config.dropWeight;
      if (roll <= 0) {
        return this.createLoot(config.id);
      }
    }

    return null;
  }

  awardLootById(lootId: string): RareLoot | null {
    return this.createLoot(lootId);
  }

  getGlobalMultiplier(): number {
    const loot = this.gameStateService.gameState().rareLoot;
    let mult = 1;
    for (const l of loot) {
      if (l.effect.type === 'global_multiplier') {
        mult *= l.effect.value;
      }
    }
    return mult;
  }

  getClickMultiplier(): number {
    const loot = this.gameStateService.gameState().rareLoot;
    let mult = 1;
    for (const l of loot) {
      if (l.effect.type === 'click_multiplier') {
        mult *= l.effect.value;
      }
    }
    return mult;
  }

  getCostReduction(): number {
    const loot = this.gameStateService.gameState().rareLoot;
    let mult = 1;
    for (const l of loot) {
      if (l.effect.type === 'building_cost_reduction') {
        mult *= l.effect.value;
      }
    }
    return mult;
  }

  getGoldenFrequencyMult(): number {
    const loot = this.gameStateService.gameState().rareLoot;
    let mult = 1;
    for (const l of loot) {
      if (l.effect.type === 'golden_frequency') {
        mult *= l.effect.value;
      }
    }
    return mult;
  }

  private createLoot(configId: string): RareLoot | null {
    const config = RARE_LOOT_DEFINITIONS.find(l => l.id === configId);
    if (!config) return null;

    const loot: RareLoot = {
      id: config.id + '_' + Date.now(),
      name: config.name,
      description: config.description,
      icon: config.icon,
      rarity: config.rarity,
      effect: config.effect,
      obtainedAt: Date.now(),
    };

    this.gameStateService.addRareLoot(loot);
    this.lastDrop.set(loot);
    setTimeout(() => this.lastDrop.set(null), 4000);

    return loot;
  }
}
