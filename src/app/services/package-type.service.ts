import { Injectable, inject, signal } from '@angular/core';
import { PackageTypeConfig } from '../models/game.models';
import { PACKAGE_TYPES } from '../config/package-types.config';
import { GameStateService } from './game-state.service';

@Injectable({ providedIn: 'root' })
export class PackageTypeService {
  private readonly gameStateService = inject(GameStateService);

  readonly lastRolledType = signal<PackageTypeConfig | null>(null);

  private readonly totalWeight = PACKAGE_TYPES.reduce(
    (sum, t) => sum + t.weight,
    0
  );

  rollPackageType(): PackageTypeConfig {
    const rolled = this.weightedRandom();
    this.lastRolledType.set(rolled);
    this.trackCount(rolled.id);
    return rolled;
  }

  getValueMultiplier(): number {
    return this.lastRolledType()?.valueMultiplier ?? 1;
  }

  hasAllTypes(): boolean {
    const counts = this.gameStateService.gameState().packageTypeCounts;
    return PACKAGE_TYPES.every((t) => (counts[t.id] ?? 0) >= 1);
  }

  private weightedRandom(): PackageTypeConfig {
    let remaining = Math.random() * this.totalWeight;
    for (const packageType of PACKAGE_TYPES) {
      remaining -= packageType.weight;
      if (remaining <= 0) {
        return packageType;
      }
    }
    return PACKAGE_TYPES[0];
  }

  private trackCount(typeId: string): void {
    const counts = {
      ...this.gameStateService.gameState().packageTypeCounts,
    };
    counts[typeId] = (counts[typeId] ?? 0) + 1;
    this.gameStateService.updatePackageTypeCounts(counts);
  }
}
