import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
} from '@angular/core';
import { FleetRoute } from '../../models/game.models';

@Component({
  selector: 'app-fleet-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fleet-overlay" (click)="closePanel.emit()">
      <div class="fleet-panel" (click)="$event.stopPropagation()">
        <div class="panel-header">
          <h2>\uD83D\uDE9A Fleet Management</h2>
          <button class="close-btn" (click)="closePanel.emit()">\u2715</button>
        </div>

        <div class="fleet-multiplier">
          Fleet Bonus: \u00D7{{ fleetMultiplierDisplay() }}
        </div>

        <div class="route-list">
          @for (route of routes; track route.id) {
            <div class="route-card"
              [class.assigned]="isRouteAssigned(route.id)"
              [class.locked]="!meetsAllRequirements(route)">

              <div class="card-top">
                <span class="r-icon">{{ route.icon }}</span>
                <div class="r-info">
                  <div class="r-name">{{ route.name }}</div>
                  <div class="r-desc">{{ route.description }}</div>
                </div>
                <div class="r-bonus">
                  +{{ bonusPctDisplay(route) }}%
                </div>
              </div>

              <div class="req-list">
                @for (req of route.requirement; track req.buildingType) {
                  <div class="req-bar"
                    [class.met]="getCount(req.buildingType) >= req.count"
                    [class.unmet]="getCount(req.buildingType) < req.count">
                    <div class="req-label">
                      {{ req.buildingType }}
                      {{ fmt(getCount(req.buildingType)) }}/{{ req.count }}
                    </div>
                    <div class="req-track">
                      <div class="req-fill"
                        [style.width.%]="reqPct(req)"></div>
                    </div>
                  </div>
                }
              </div>

              <div class="card-actions">
                @if (isRouteAssigned(route.id)) {
                  <button class="unassign-btn"
                    (click)="unassignRoute.emit(route.id)">
                    Unassign
                  </button>
                } @else {
                  <button class="assign-btn"
                    [disabled]="!meetsAllRequirements(route)"
                    (click)="assignRoute.emit(route.id)">
                    Assign Route
                  </button>
                }
              </div>
            </div>
          }
          @if (routes.length === 0) {
            <div class="empty-state">No routes available</div>
          }
        </div>

        <div class="assigned-count">
          Active Routes: {{ assignedRoutes.length }} / {{ routes.length }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fleet-overlay {
      position: fixed; inset: 0; z-index: 1500;
      background: rgba(0,0,0,0.7); display: flex;
      align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease-out;
    }
    .fleet-panel {
      background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
      padding: 24px; max-width: 550px; width: 90%; max-height: 80vh;
      overflow-y: auto; animation: slideIn 0.3s ease-out;
    }
    .panel-header {
      display: flex; justify-content: space-between;
      align-items: center; margin-bottom: 12px;
    }
    h2 { color: #fff; font-size: 1.2em; margin: 0; }
    .close-btn {
      background: none; border: none;
      color: rgba(255,255,255,0.5); font-size: 1.2em; cursor: pointer;
    }
    .fleet-multiplier {
      text-align: center; color: rgba(255,200,100,0.9);
      font-size: 0.9em; font-weight: 600; margin-bottom: 16px;
      padding: 8px; background: rgba(255,200,100,0.08);
      border-radius: 8px; border: 1px solid rgba(255,200,100,0.15);
    }
    .route-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px; padding: 14px; margin-bottom: 10px;
      transition: border-color 0.2s;
    }
    .route-card.assigned {
      border-color: rgba(255,200,100,0.4);
      background: rgba(255,200,100,0.04);
    }
    .route-card.locked { opacity: 0.6; }
    .card-top {
      display: flex; align-items: center; gap: 10px;
    }
    .r-icon { font-size: 1.5em; flex-shrink: 0; }
    .r-info { flex: 1; }
    .r-name { color: #fff; font-weight: 600; font-size: 0.9em; }
    .r-desc {
      color: rgba(255,255,255,0.5); font-size: 0.8em; margin-top: 2px;
    }
    .r-bonus {
      color: #7cc576; font-size: 0.85em; font-weight: 600;
      white-space: nowrap;
    }
    .req-list { margin-top: 10px; }
    .req-bar { margin-bottom: 6px; }
    .req-label {
      font-size: 0.75em; margin-bottom: 2px;
      text-transform: capitalize;
    }
    .req-bar.met .req-label { color: #7cc576; }
    .req-bar.unmet .req-label { color: rgba(255,100,100,0.7); }
    .req-track {
      height: 4px; background: rgba(255,255,255,0.1);
      border-radius: 2px; overflow: hidden;
    }
    .req-fill {
      height: 100%; border-radius: 2px; transition: width 0.3s;
    }
    .req-bar.met .req-fill { background: #7cc576; }
    .req-bar.unmet .req-fill { background: rgba(255,100,100,0.5); }
    .card-actions { margin-top: 10px; }
    .assign-btn, .unassign-btn {
      width: 100%; padding: 6px 12px; border-radius: 6px;
      font-family: inherit; font-size: 0.8em; cursor: pointer;
    }
    .assign-btn {
      background: rgba(100,140,255,0.15); color: #648cff;
      border: 1px solid rgba(100,140,255,0.3);
    }
    .assign-btn:not(:disabled):hover {
      background: rgba(100,140,255,0.25);
    }
    .assign-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .unassign-btn {
      background: rgba(255,100,100,0.1); color: rgba(255,120,120,0.8);
      border: 1px solid rgba(255,100,100,0.25);
    }
    .unassign-btn:hover {
      background: rgba(255,100,100,0.2);
    }
    .empty-state {
      text-align: center; color: rgba(255,255,255,0.3); padding: 20px;
    }
    .assigned-count {
      text-align: center; color: rgba(255,255,255,0.3);
      font-size: 0.75em; margin-top: 12px;
    }
    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `],
})
export class FleetPanelComponent {
  @Input() routes: FleetRoute[] = [];
  @Input() assignedRoutes: string[] = [];
  @Input() buildings: Record<string, { count: number }> = {};
  @Input() fmt: (n: number) => string = (n) => n.toString();
  @Output() closePanel = new EventEmitter<void>();
  @Output() assignRoute = new EventEmitter<string>();
  @Output() unassignRoute = new EventEmitter<string>();

  isRouteAssigned(routeId: string): boolean {
    return this.assignedRoutes.includes(routeId);
  }

  meetsAllRequirements(route: FleetRoute): boolean {
    return route.requirement.every(
      (req) => this.getCount(req.buildingType) >= req.count
    );
  }

  getCount(buildingType: string): number {
    return this.buildings[buildingType]?.count ?? 0;
  }

  reqPct(req: { buildingType: string; count: number }): number {
    const current = this.getCount(req.buildingType);
    return Math.min(100, (current / req.count) * 100);
  }

  bonusPctDisplay(route: FleetRoute): string {
    const pct = (route.bonusMultiplier - 1) * 100;
    return pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1);
  }

  fleetMultiplierDisplay(): string {
    let mult = 1;
    for (const routeId of this.assignedRoutes) {
      const route = this.routes.find((r) => r.id === routeId);
      if (route) {
        mult *= route.bonusMultiplier;
      }
    }
    return mult.toFixed(2);
  }
}
