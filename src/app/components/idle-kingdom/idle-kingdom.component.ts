import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
} from '@angular/core';
import { KingdomCity } from '../../models/game.models';
import { KINGDOM_CITIES, KingdomCityConfig } from '../../config/idle-kingdom.config';

@Component({
  selector: 'app-idle-kingdom',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kingdom-overlay" (click)="closePanel.emit()">
      <div class="kingdom-panel" (click)="$event.stopPropagation()">
        <div class="panel-header">
          <h2>\uD83C\uDFF0 Idle Kingdom</h2>
          <button class="close-btn" (click)="closePanel.emit()">\u2715</button>
        </div>

        <div class="summary-bar">
          <span class="ep-display">
            EP: <span class="ep-value">{{ fmt(expressPoints) }}</span>
          </span>
          <span class="ep-rate">
            +{{ fmt(totalEpPerMin) }} EP/min
          </span>
        </div>

        <div class="city-grid">
          @for (cfg of allCities; track cfg.id) {
            @if (getCityData(cfg.id); as city) {
              <div class="city-tile unlocked"
                [style.border-color]="getLevelColor(city.level)">
                <div class="city-icon">{{ cfg.icon }}</div>
                <div class="city-name">{{ cfg.name }}</div>
                <div class="city-level">Lv.{{ city.level }}</div>
                <div class="city-ep">
                  {{ fmt(city.epPerMinute * city.level) }} EP/min
                </div>
                <button class="upgrade-btn"
                  [disabled]="!canUpgrade(cfg.id)"
                  (click)="upgradeCity.emit(cfg.id)">
                  \u2B06 {{ fmt(getUpgradeCost(cfg.id)) }} EP
                </button>
              </div>
            } @else {
              <div class="city-tile locked">
                <div class="city-icon locked-icon">?</div>
                <div class="city-name locked-name">{{ cfg.name }}</div>
                <div class="city-threshold">
                  Unlock at {{ fmt(cfg.unlockEpThreshold) }} EP
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kingdom-overlay {
      position: fixed; inset: 0; z-index: 1500;
      background: rgba(0,0,0,0.7); display: flex;
      align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease-out;
    }
    .kingdom-panel {
      background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
      padding: 24px; max-width: 600px; width: 92%; max-height: 85vh;
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
    .summary-bar {
      display: flex; justify-content: space-between;
      align-items: center; padding: 8px 12px; margin-bottom: 16px;
      border-radius: 8px; background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
    }
    .ep-display {
      color: rgba(255,255,255,0.5); font-size: 0.85em;
    }
    .ep-value { color: #a78bfa; font-weight: 600; }
    .ep-rate {
      color: #7cc576; font-size: 0.85em; font-weight: 600;
    }
    .city-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
    }
    .city-tile {
      display: flex; flex-direction: column; align-items: center;
      gap: 4px; padding: 14px 8px; border-radius: 10px;
      border: 2px solid rgba(100,140,255,0.2);
      background: rgba(100,140,255,0.05);
      transition: border-color 0.3s, background 0.2s;
    }
    .city-tile.unlocked:hover {
      background: rgba(100,140,255,0.1);
    }
    .city-tile.locked {
      border-color: rgba(255,255,255,0.06);
      background: rgba(0,0,0,0.3);
    }
    .city-icon { font-size: 1.6em; }
    .locked-icon {
      font-size: 1.4em; color: rgba(255,255,255,0.15);
    }
    .city-name {
      color: #fff; font-size: 0.75em; font-weight: 600;
      text-align: center; white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis;
      max-width: 100%;
    }
    .locked-name { color: rgba(255,255,255,0.25); }
    .city-level {
      color: rgba(255,255,255,0.5); font-size: 0.7em;
    }
    .city-ep {
      color: #7cc576; font-size: 0.7em; font-weight: 600;
    }
    .city-threshold {
      color: rgba(255,255,255,0.2); font-size: 0.65em;
      text-align: center; margin-top: 4px;
    }
    .upgrade-btn {
      margin-top: 4px; padding: 4px 10px; border-radius: 6px;
      border: 1px solid rgba(167,139,250,0.3);
      background: rgba(167,139,250,0.12);
      color: #a78bfa; font-size: 0.7em; font-weight: 600;
      cursor: pointer; transition: background 0.2s, border-color 0.2s;
      font-family: inherit;
    }
    .upgrade-btn:not(:disabled):hover {
      background: rgba(167,139,250,0.25);
      border-color: rgba(167,139,250,0.5);
    }
    .upgrade-btn:disabled {
      opacity: 0.35; cursor: not-allowed;
    }
    @media (max-width: 480px) {
      .city-grid { grid-template-columns: repeat(2, 1fr); }
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
export class IdleKingdomComponent {
  @Input() cities: KingdomCity[] = [];
  @Input() totalEpPerMin = 0;
  @Input() expressPoints = 0;
  @Input() fmt: (n: number) => string = (n) => n.toString();
  @Output() closePanel = new EventEmitter<void>();
  @Output() upgradeCity = new EventEmitter<string>();

  readonly allCities: KingdomCityConfig[] = KINGDOM_CITIES;

  private costCache = new Map<string, number>();
  private lastCityCount = -1;

  getCityData(cityId: string): KingdomCity | null {
    return this.cities.find((c) => c.id === cityId) ?? null;
  }

  getUpgradeCost(cityId: string): number {
    this.refreshCostCache();
    const cached = this.costCache.get(cityId);
    if (cached !== undefined) return cached;

    const city = this.getCityData(cityId);
    const config = KINGDOM_CITIES.find((c) => c.id === cityId);
    if (!city || !config) return 0;

    const cost = Math.floor(config.upgradeCostBase * city.level);
    this.costCache.set(cityId, cost);
    return cost;
  }

  canUpgrade(cityId: string): boolean {
    return this.expressPoints >= this.getUpgradeCost(cityId);
  }

  getLevelColor(level: number): string {
    if (level >= 20) return '#ffd700';
    if (level >= 10) return '#c0a040';
    if (level >= 5) return '#8090c0';
    return 'rgba(100,140,255,0.3)';
  }

  private refreshCostCache(): void {
    const total = this.cities.reduce((s, c) => s + c.level, 0);
    if (total !== this.lastCityCount) {
      this.costCache.clear();
      this.lastCityCount = total;
    }
  }
}
