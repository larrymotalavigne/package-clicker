import { Injectable, signal, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { ActiveBuff, GoldenPackageEffect } from '../models/game.models';

const EFFECTS: GoldenPackageEffect[] = [
  {
    type: 'frenzy',
    name: 'Frenzy',
    multiplier: 7,
    durationMs: 77000,
  },
  {
    type: 'lucky',
    name: 'Lucky',
    multiplier: 0,
    durationMs: 0,
  },
  {
    type: 'click_frenzy',
    name: 'Click Frenzy',
    multiplier: 777,
    durationMs: 13000,
  },
];

const MIN_SPAWN_MS = 5 * 60 * 1000;
const MAX_SPAWN_MS = 15 * 60 * 1000;
const VISIBLE_MS = 13000;

@Injectable({ providedIn: 'root' })
export class GoldenPackageService {
  readonly visible = signal(false);
  readonly position = signal({ x: 50, y: 50 });

  private spawnTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  private gameStateService = inject(GameStateService);

  start(): void {
    this.scheduleNext();
  }

  stop(): void {
    if (this.spawnTimer) clearTimeout(this.spawnTimer);
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.visible.set(false);
  }

  click(): ActiveBuff | null {
    if (!this.visible()) return null;

    this.visible.set(false);
    if (this.hideTimer) clearTimeout(this.hideTimer);

    this.gameStateService.incrementGoldenClicks();

    const effect = this.pickEffect();
    const buff = this.applyEffect(effect);
    this.scheduleNext();
    return buff;
  }

  tickBuffs(deltaMs: number): void {
    const state = this.gameStateService.gameState();
    const updated = state.activeBuffs
      .map((b) => ({ ...b, remainingMs: b.remainingMs - deltaMs }))
      .filter((b) => b.remainingMs > 0);

    if (updated.length !== state.activeBuffs.length) {
      this.gameStateService.updateActiveBuffs(updated);
    } else if (updated.some((b, i) => b.remainingMs !== state.activeBuffs[i].remainingMs)) {
      this.gameStateService.updateActiveBuffs(updated);
    }
  }

  getProductionMultiplier(): number {
    const buffs = this.gameStateService.gameState().activeBuffs;
    let mult = 1;
    for (const b of buffs) {
      if (b.type === 'frenzy') mult *= b.multiplier;
    }
    return mult;
  }

  getClickMultiplier(): number {
    const buffs = this.gameStateService.gameState().activeBuffs;
    let mult = 1;
    for (const b of buffs) {
      if (b.type === 'click_frenzy') mult *= b.multiplier;
    }
    return mult;
  }

  private scheduleNext(): void {
    if (this.spawnTimer) clearTimeout(this.spawnTimer);
    const delay =
      MIN_SPAWN_MS + Math.random() * (MAX_SPAWN_MS - MIN_SPAWN_MS);
    this.spawnTimer = setTimeout(() => this.spawn(), delay);
  }

  private spawn(): void {
    this.position.set({
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
    });
    this.visible.set(true);
    this.hideTimer = setTimeout(() => {
      this.visible.set(false);
      this.scheduleNext();
    }, VISIBLE_MS);
  }

  private pickEffect(): GoldenPackageEffect {
    const rand = Math.random();
    if (rand < 0.4) return EFFECTS[0]; // frenzy
    if (rand < 0.7) return EFFECTS[1]; // lucky
    return EFFECTS[2]; // click frenzy
  }

  private applyEffect(effect: GoldenPackageEffect): ActiveBuff {
    if (effect.type === 'lucky') {
      const state = this.gameStateService.gameState();
      const bonus = state.packagesPerSecond * 900;
      const capped = Math.min(bonus, state.packages * 0.15);
      const reward = Math.max(capped, 13);
      this.gameStateService.updatePackages(state.packages + reward);
      return {
        id: 'lucky_' + Date.now(),
        name: `Lucky! +${Math.floor(reward)}`,
        type: 'lucky',
        multiplier: 1,
        remainingMs: 3000,
        totalMs: 3000,
      };
    }

    const buff: ActiveBuff = {
      id: effect.type + '_' + Date.now(),
      name: effect.name,
      type: effect.type,
      multiplier: effect.multiplier,
      remainingMs: effect.durationMs,
      totalMs: effect.durationMs,
    };

    const state = this.gameStateService.gameState();
    this.gameStateService.updateActiveBuffs([...state.activeBuffs, buff]);
    return buff;
  }
}
