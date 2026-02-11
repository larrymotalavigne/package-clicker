import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { StockPrice } from '../../models/game.models';
import { STOCK_CONFIGS } from '../../config/stock-market.config';

@Component({
  selector: 'app-stock-market',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stock-overlay" (click)="closePanel.emit()">
      <div class="stock-panel" (click)="$event.stopPropagation()">
        <div class="panel-header">
          <h2>\uD83D\uDCC8 Stock Market</h2>
          <button class="close-btn" (click)="closePanel.emit()"
            aria-label="Close stock market">\u2715</button>
        </div>

        <div class="portfolio-summary">
          <span class="label">Portfolio Value:</span>
          <span class="value">{{ fmt(portfolioTotal()) }}</span>
        </div>

        <div class="stock-list">
          @for (cfg of configs; track cfg.buildingId) {
            <div class="stock-row">
              <div class="stock-identity">
                <span class="stock-icon">{{ cfg.icon }}</span>
                <span class="stock-ticker">{{ cfg.name }}</span>
              </div>

              <div class="stock-price-section">
                <span class="stock-price">{{ fmt(getPrice(cfg.buildingId)) }}</span>
                <span class="stock-delta"
                  [class.positive]="getDelta(cfg.buildingId) >= 0"
                  [class.negative]="getDelta(cfg.buildingId) < 0">
                  {{ formatDelta(cfg.buildingId) }}
                </span>
              </div>

              <div class="mini-chart">
                @for (bar of getChartBars(cfg.buildingId); track $index) {
                  <div class="chart-bar"
                    [style.height.%]="bar.height"
                    [class.bar-up]="bar.up"
                    [class.bar-down]="!bar.up">
                  </div>
                }
              </div>

              <div class="stock-holdings">
                <span class="holdings-label">Own:</span>
                <span class="holdings-count">{{ getHoldings(cfg.buildingId) }}</span>
              </div>

              <div class="stock-actions">
                <button class="buy-btn"
                  [disabled]="!canBuy(cfg.buildingId)"
                  (click)="onBuy(cfg.buildingId)">Buy</button>
                <button class="sell-btn"
                  [disabled]="getHoldings(cfg.buildingId) === 0"
                  (click)="onSell(cfg.buildingId)">Sell</button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stock-overlay {
      position: fixed; inset: 0; z-index: 1500;
      background: rgba(0,0,0,0.7); display: flex;
      align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease-out;
    }
    .stock-panel {
      background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
      padding: 24px; max-width: 600px; width: 94%; max-height: 85vh;
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
    .portfolio-summary {
      display: flex; justify-content: center; gap: 8px;
      padding: 10px; margin-bottom: 16px;
      background: rgba(255,215,0,0.06);
      border: 1px solid rgba(255,215,0,0.15); border-radius: 8px;
    }
    .portfolio-summary .label {
      color: rgba(255,255,255,0.5); font-size: 0.85em;
    }
    .portfolio-summary .value {
      color: #ffd700; font-weight: 600; font-size: 0.9em;
    }
    .stock-list {
      display: flex; flex-direction: column; gap: 6px;
    }
    .stock-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px; transition: border-color 0.2s;
    }
    .stock-row:hover {
      border-color: rgba(255,255,255,0.12);
    }
    .stock-identity {
      display: flex; align-items: center; gap: 6px;
      min-width: 70px;
    }
    .stock-icon { font-size: 1.2em; }
    .stock-ticker {
      color: #fff; font-weight: 600; font-size: 0.85em;
      font-family: monospace;
    }
    .stock-price-section {
      display: flex; flex-direction: column;
      align-items: flex-end; min-width: 80px;
    }
    .stock-price {
      color: #e0e0e0; font-size: 0.85em; font-family: monospace;
    }
    .stock-delta {
      font-size: 0.7em; font-family: monospace;
    }
    .stock-delta.positive { color: #7cc576; }
    .stock-delta.negative { color: #e05555; }
    .mini-chart {
      display: flex; align-items: flex-end; gap: 1px;
      height: 24px; min-width: 60px; flex-shrink: 0;
    }
    .chart-bar {
      flex: 1; min-width: 2px; border-radius: 1px 1px 0 0;
      transition: height 0.3s;
    }
    .bar-up { background: rgba(124,197,118,0.6); }
    .bar-down { background: rgba(224,85,85,0.6); }
    .stock-holdings {
      display: flex; align-items: center; gap: 4px;
      min-width: 60px; justify-content: center;
    }
    .holdings-label {
      color: rgba(255,255,255,0.4); font-size: 0.75em;
    }
    .holdings-count {
      color: #fff; font-weight: 600; font-size: 0.85em;
    }
    .stock-actions {
      display: flex; gap: 4px; flex-shrink: 0;
    }
    .buy-btn, .sell-btn {
      padding: 4px 12px; border-radius: 5px;
      font-family: inherit; font-size: 0.75em;
      cursor: pointer; border-width: 1px; border-style: solid;
    }
    .buy-btn {
      background: rgba(124,197,118,0.12);
      border-color: rgba(124,197,118,0.3);
      color: #7cc576;
    }
    .buy-btn:not(:disabled):hover {
      background: rgba(124,197,118,0.22);
    }
    .sell-btn {
      background: rgba(224,85,85,0.12);
      border-color: rgba(224,85,85,0.3);
      color: #e05555;
    }
    .sell-btn:not(:disabled):hover {
      background: rgba(224,85,85,0.22);
    }
    .buy-btn:disabled, .sell-btn:disabled {
      opacity: 0.3; cursor: not-allowed;
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
export class StockMarketComponent {
  @Input() prices: Map<string, StockPrice> = new Map();
  @Input() portfolio: Record<string, number> = {};
  @Input() packages: number = 0;
  @Input() fmt: (n: number) => string = (n) => n.toString();
  @Output() closePanel = new EventEmitter<void>();
  @Output() buyStock = new EventEmitter<{ buildingId: string; quantity: number }>();
  @Output() sellStock = new EventEmitter<{ buildingId: string; quantity: number }>();

  readonly configs = STOCK_CONFIGS;

  getPrice(buildingId: string): number {
    return this.prices.get(buildingId)?.currentPrice ?? 0;
  }

  getDelta(buildingId: string): number {
    const stock = this.prices.get(buildingId);
    if (!stock || stock.previousPrice === 0) return 0;
    return ((stock.currentPrice - stock.previousPrice) / stock.previousPrice) * 100;
  }

  formatDelta(buildingId: string): string {
    const delta = this.getDelta(buildingId);
    const sign = delta >= 0 ? '+' : '';
    return sign + delta.toFixed(2) + '%';
  }

  getHoldings(buildingId: string): number {
    return this.portfolio[buildingId] || 0;
  }

  canBuy(buildingId: string): boolean {
    const price = this.getPrice(buildingId);
    return price > 0 && this.packages >= price;
  }

  getChartBars(buildingId: string): { height: number; up: boolean }[] {
    const stock = this.prices.get(buildingId);
    if (!stock || stock.history.length === 0) return [];
    return this.buildBars(stock.history);
  }

  portfolioTotal(): number {
    let total = 0;
    for (const cfg of this.configs) {
      const held = this.portfolio[cfg.buildingId] || 0;
      if (held > 0) {
        total += held * this.getPrice(cfg.buildingId);
      }
    }
    return total;
  }

  onBuy(buildingId: string): void {
    this.buyStock.emit({ buildingId, quantity: 1 });
  }

  onSell(buildingId: string): void {
    this.sellStock.emit({ buildingId, quantity: 1 });
  }

  private buildBars(history: number[]): { height: number; up: boolean }[] {
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;

    return history.map((val, i) => ({
      height: 10 + ((val - min) / range) * 90,
      up: i === 0 || val >= history[i - 1],
    }));
  }
}
