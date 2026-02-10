import { Injectable, inject, signal, computed } from '@angular/core';
import { GameStateService } from './game-state.service';
import { EVENT_DEFINITIONS, ABSURD_EXCUSES } from '../config/events.config';
import { GameEvent, ActiveEvent } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class EventService {
  private gameStateService = inject(GameStateService);
  private spawnTimer: ReturnType<typeof setTimeout> | null = null;
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;
  private running = false;

  readonly pendingEvent = signal<GameEvent | null>(null);

  readonly activeEvents = computed(
    () => this.gameStateService.gameState().activeEvents
  );

  start(): void {
    if (this.running) return;
    this.running = true;
    this.scheduleNextEvent();
  }

  stop(): void {
    this.running = false;
    if (this.spawnTimer) {
      clearTimeout(this.spawnTimer);
      this.spawnTimer = null;
    }
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
  }

  acceptEvent(): void {
    const event = this.pendingEvent();
    if (!event) return;

    this.clearDismissTimer();
    this.pendingEvent.set(null);

    const state = this.gameStateService.gameState();

    if (event.effect.type === 'instant_packages') {
      const bonus = state.packages * event.effect.value;
      this.gameStateService.updatePackages(state.packages + bonus);
    } else if (event.effect.type === 'lose_packages') {
      const loss = state.packages * event.effect.value;
      this.gameStateService.updatePackages(
        Math.max(0, state.packages - loss)
      );
    }

    if (event.durationMs > 0) {
      const activeEvent: ActiveEvent = {
        id: event.id,
        name: event.name,
        icon: event.icon,
        type: event.type,
        effect: this.resolveEffect(event),
        remainingMs: event.durationMs,
        totalMs: event.durationMs,
      };
      this.gameStateService.addActiveEvent(activeEvent);
    }

    this.gameStateService.incrementEventsExperienced();
    this.scheduleNextEvent();
  }

  dismissEvent(): void {
    this.clearDismissTimer();
    this.pendingEvent.set(null);
    this.gameStateService.incrementEventsExperienced();
    this.scheduleNextEvent();
  }

  tickEvents(deltaMs: number): void {
    const events = this.gameStateService.gameState().activeEvents;
    if (events.length === 0) return;

    const updated = events
      .map((e) => ({ ...e, remainingMs: e.remainingMs - deltaMs }))
      .filter((e) => e.remainingMs > 0);

    if (updated.length !== events.length) {
      this.gameStateService.updateActiveEvents(updated);
    } else if (events.length > 0) {
      this.gameStateService.updateActiveEvents(updated);
    }
  }

  getProductionMultiplier(): number {
    const events = this.gameStateService.gameState().activeEvents;
    let mult = 1;
    for (const e of events) {
      if (e.effect.type === 'production_mult') {
        mult *= e.effect.value;
      }
      if (
        e.effect.type === 'building_boost' &&
        e.effect.buildingType
      ) {
        mult *= 1;
      }
    }
    return mult;
  }

  getClickMultiplier(): number {
    const events = this.gameStateService.gameState().activeEvents;
    let mult = 1;
    for (const e of events) {
      if (e.effect.type === 'click_mult') {
        mult *= e.effect.value;
      }
    }
    return mult;
  }

  getBuildingPriceMultiplier(): number {
    const events = this.gameStateService.gameState().activeEvents;
    let mult = 1;
    for (const e of events) {
      if (e.effect.type === 'building_discount') {
        mult *= e.effect.value;
      }
    }
    return mult;
  }

  getBuildingBoostMultiplier(buildingType: string): number {
    const events = this.gameStateService.gameState().activeEvents;
    let mult = 1;
    for (const e of events) {
      if (
        e.effect.type === 'building_boost' &&
        e.effect.buildingType === buildingType
      ) {
        mult *= e.effect.value;
      }
    }
    return mult;
  }

  private resolveEffect(event: GameEvent): GameEvent['effect'] {
    if (event.id === 'overtime_workers') {
      const state = this.gameStateService.gameState();
      const owned = Object.entries(state.buildings)
        .filter(([, b]) => b.count > 0)
        .map(([id]) => id);
      const target =
        owned.length > 0
          ? owned[Math.floor(Math.random() * owned.length)]
          : 'cursor';
      return { ...event.effect, buildingType: target };
    }
    return event.effect;
  }

  private scheduleNextEvent(): void {
    if (!this.running) return;
    if (this.spawnTimer) {
      clearTimeout(this.spawnTimer);
    }
    const delay = 180_000 + Math.random() * 300_000;
    this.spawnTimer = setTimeout(() => this.spawnEvent(), delay);
  }

  private spawnEvent(): void {
    if (!this.running) return;

    let event = this.pickRandomEvent();
    if (event.type === 'negative') {
      const excuse = ABSURD_EXCUSES[
        Math.floor(Math.random() * ABSURD_EXCUSES.length)
      ];
      event = {
        ...event,
        description: event.description + ' ' + excuse,
      };
    }
    this.pendingEvent.set(event);

    this.dismissTimer = setTimeout(() => {
      if (this.pendingEvent() === event) {
        this.dismissEvent();
      }
    }, 15_000);
  }

  private pickRandomEvent(): GameEvent {
    const roll = Math.random();
    let pool: GameEvent[];

    if (roll < 0.6) {
      pool = EVENT_DEFINITIONS.filter((e) => e.type === 'positive');
    } else if (roll < 0.9) {
      pool = EVENT_DEFINITIONS.filter((e) => e.type === 'negative');
    } else {
      pool = EVENT_DEFINITIONS.filter((e) => e.type === 'neutral');
    }

    return pool[Math.floor(Math.random() * pool.length)];
  }

  private clearDismissTimer(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
  }
}
