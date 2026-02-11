import { Injectable, computed, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { KingdomCity, KingdomState } from '../models/game.models';
import { KINGDOM_CITIES, KingdomCityConfig } from '../config/idle-kingdom.config';

@Injectable({ providedIn: 'root' })
export class IdleKingdomService {
  private gameStateService = inject(GameStateService);

  readonly kingdom = computed(
    () => this.gameStateService.gameState().kingdom
  );

  readonly totalEpPerMinute = computed(() => this.getTotalEpPerMinute());

  initCities(): void {
    const state = this.gameStateService.gameState();
    const totalEp = state.totalExpressPointsEarned;
    const existing = state.kingdom.cities;
    const newCities = this.buildUnlockedCities(totalEp, existing);

    if (newCities.length === existing.length) return;

    this.updateKingdom({ ...state.kingdom, cities: newCities });
  }

  tick(deltaMs: number): void {
    const kingdom = this.kingdom();
    const epPerMs = this.calculateEpPerMs(kingdom.cities);
    if (epPerMs <= 0) return;

    const generated = epPerMs * deltaMs;
    this.gameStateService.addExpressPoints(generated);
    this.updateKingdom({
      ...kingdom,
      totalEpGenerated: kingdom.totalEpGenerated + generated,
    });
  }

  upgradeCity(cityId: string): boolean {
    const cost = this.getUpgradeCost(cityId);
    if (cost <= 0) return false;

    if (!this.gameStateService.spendExpressPoints(cost)) return false;

    const kingdom = this.kingdom();
    const config = this.getCityConfig(cityId);
    if (!config) return false;

    const updatedCities = this.applyUpgrade(kingdom.cities, cityId, config);
    this.updateKingdom({ ...kingdom, cities: updatedCities });
    return true;
  }

  getUpgradeCost(cityId: string): number {
    const city = this.findCity(cityId);
    const config = this.getCityConfig(cityId);
    if (!city || !config) return 0;
    return Math.floor(config.upgradeCostBase * city.level);
  }

  getTotalEpPerMinute(): number {
    const cities = this.kingdom().cities;
    return cities.reduce((sum, c) => sum + c.epPerMinute * c.level, 0);
  }

  private buildUnlockedCities(
    totalEp: number,
    existing: KingdomCity[]
  ): KingdomCity[] {
    const cityMap = new Map(existing.map((c) => [c.id, c]));
    const result: KingdomCity[] = [];

    for (const cfg of KINGDOM_CITIES) {
      const prev = cityMap.get(cfg.id);
      if (prev) {
        result.push(prev);
      } else if (totalEp >= cfg.unlockEpThreshold) {
        result.push(this.createCity(cfg));
      }
    }

    return result;
  }

  private createCity(cfg: KingdomCityConfig): KingdomCity {
    return {
      id: cfg.id,
      name: cfg.name,
      level: 1,
      epPerMinute: cfg.baseEpPerMinute,
      unlocked: true,
    };
  }

  private calculateEpPerMs(cities: KingdomCity[]): number {
    const epPerMinute = cities.reduce(
      (sum, c) => sum + c.epPerMinute * c.level,
      0
    );
    return epPerMinute / 60000;
  }

  private applyUpgrade(
    cities: KingdomCity[],
    cityId: string,
    config: KingdomCityConfig
  ): KingdomCity[] {
    return cities.map((c) => {
      if (c.id !== cityId) return c;
      const newLevel = c.level + 1;
      return {
        ...c,
        level: newLevel,
        epPerMinute: config.baseEpPerMinute * newLevel,
      };
    });
  }

  private findCity(cityId: string): KingdomCity | undefined {
    return this.kingdom().cities.find((c) => c.id === cityId);
  }

  private getCityConfig(cityId: string): KingdomCityConfig | undefined {
    return KINGDOM_CITIES.find((c) => c.id === cityId);
  }

  private updateKingdom(kingdom: KingdomState): void {
    this.gameStateService.updateKingdom(kingdom);
  }
}
