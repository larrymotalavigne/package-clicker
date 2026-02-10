import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { BUILDING_SYNERGIES } from '../config/synergies.config';
import { BuildingType } from '../types/building-types';

@Injectable({ providedIn: 'root' })
export class SynergyService {
  private gameStateService = inject(GameStateService);

  getSynergyMultiplier(buildingType: BuildingType): number {
    const state = this.gameStateService.gameState();
    let mult = 1;

    for (const syn of BUILDING_SYNERGIES) {
      if (syn.target !== buildingType) continue;
      const sourceCount = state.buildings[syn.source]?.count ?? 0;
      if (sourceCount > 0) {
        mult += sourceCount * syn.bonusPerUnit;
      }
    }

    return mult;
  }

  getSynergiesForBuilding(buildingType: BuildingType): string[] {
    const state = this.gameStateService.gameState();
    const descriptions: string[] = [];

    for (const syn of BUILDING_SYNERGIES) {
      if (syn.target !== buildingType) continue;
      const sourceCount = state.buildings[syn.source]?.count ?? 0;
      if (sourceCount > 0) {
        const bonus = (sourceCount * syn.bonusPerUnit * 100).toFixed(1);
        descriptions.push(`+${bonus}% from ${syn.description}`);
      }
    }

    return descriptions;
  }
}
