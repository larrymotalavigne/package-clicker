import { Injectable, inject, computed } from '@angular/core';
import { FleetRoute } from '../models/game.models';
import { FLEET_ROUTES } from '../config/fleet-routes.config';
import { GameStateService } from './game-state.service';

@Injectable({ providedIn: 'root' })
export class FleetService {
  private gameStateService = inject(GameStateService);

  readonly assignedRoutes = computed(
    () => this.gameStateService.gameState().assignedRoutes
  );

  getAvailableRoutes(): FleetRoute[] {
    const state = this.gameStateService.gameState();
    return FLEET_ROUTES.filter((route) =>
      this.meetsRequirements(route, state.buildings)
    );
  }

  isAssigned(routeId: string): boolean {
    return this.assignedRoutes().includes(routeId);
  }

  assignRoute(routeId: string): void {
    const route = FLEET_ROUTES.find((r) => r.id === routeId);
    if (!route) return;

    const state = this.gameStateService.gameState();
    if (!this.meetsRequirements(route, state.buildings)) return;
    if (this.isAssigned(routeId)) return;

    this.gameStateService.updateRoutes([
      ...this.assignedRoutes(),
      routeId,
    ]);
  }

  unassignRoute(routeId: string): void {
    if (!this.isAssigned(routeId)) return;

    this.gameStateService.updateRoutes(
      this.assignedRoutes().filter((r) => r !== routeId)
    );
  }

  getFleetMultiplier(): number {
    const assigned = this.assignedRoutes();
    let multiplier = 1;

    for (const routeId of assigned) {
      const route = FLEET_ROUTES.find((r) => r.id === routeId);
      if (route) {
        multiplier *= route.bonusMultiplier;
      }
    }

    return multiplier;
  }

  private meetsRequirements(
    route: FleetRoute,
    buildings: Record<string, { count: number }>
  ): boolean {
    return route.requirement.every((req) => {
      const building = buildings[req.buildingType];
      return building && building.count >= req.count;
    });
  }
}
