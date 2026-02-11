import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
} from '@angular/core';
import { Employee, EmployeeType, EmployeeConfig } from '../../models/game.models';

@Component({
  selector: 'app-employee-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="employee-overlay" (click)="closePanel.emit()">
      <div class="employee-panel" (click)="$event.stopPropagation()">
        <div class="panel-header">
          <h2>\uD83D\uDC65 Employees</h2>
          <button class="close-btn" (click)="closePanel.emit()">\u2715</button>
        </div>

        <div class="ep-display">
          Express Points: <span class="ep-value">{{ fmt(expressPoints) }}</span>
        </div>

        <div class="hire-section">
          <h3>Hire</h3>
          <div class="hire-grid">
            @for (cfg of configs; track cfg.type) {
              <button class="hire-btn"
                [disabled]="!canAfford(cfg.type)"
                (click)="hireEmployee.emit(cfg.type)">
                <span class="hire-icon">{{ cfg.icon }}</span>
                <span class="hire-name">{{ cfg.name }}</span>
                <span class="hire-cost">{{ fmt(getCost(cfg.type)) }} EP</span>
              </button>
            }
          </div>
        </div>

        <div class="roster-section">
          <h3>Roster ({{ employees.length }})</h3>
          <div class="roster-list">
            @for (emp of employees; track emp.id) {
              <div class="emp-card">
                <span class="emp-icon">{{ getIcon(emp.type) }}</span>
                <div class="emp-info">
                  <div class="emp-name">{{ emp.name }}</div>
                  <div class="emp-meta">
                    {{ getTypeName(emp.type) }} \u2022 Lv.{{ emp.level }}
                  </div>
                </div>
                <div class="emp-xp">
                  <div class="xp-bar">
                    <div class="xp-fill"
                      [style.width.%]="xpPercent(emp)"></div>
                  </div>
                  <div class="xp-label">{{ xpDisplay(emp) }}</div>
                </div>
              </div>
            }
            @if (employees.length === 0) {
              <div class="empty-state">No employees hired yet</div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .employee-overlay {
      position: fixed; inset: 0; z-index: 1500;
      background: rgba(0,0,0,0.7); display: flex;
      align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease-out;
    }
    .employee-panel {
      background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
      padding: 24px; max-width: 500px; width: 90%; max-height: 80vh;
      overflow-y: auto; animation: slideIn 0.3s ease-out;
    }
    .panel-header {
      display: flex; justify-content: space-between;
      align-items: center; margin-bottom: 12px;
    }
    h2 { color: #fff; font-size: 1.2em; margin: 0; }
    h3 {
      color: rgba(255,255,255,0.6); font-size: 0.85em;
      margin: 16px 0 8px; text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .close-btn {
      background: none; border: none;
      color: rgba(255,255,255,0.5); font-size: 1.2em; cursor: pointer;
    }
    .ep-display {
      text-align: center; color: rgba(255,255,255,0.5);
      font-size: 0.85em; margin-bottom: 8px;
    }
    .ep-value { color: #a78bfa; font-weight: 600; }
    .hire-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .hire-btn {
      display: flex; flex-direction: column; align-items: center;
      gap: 4px; padding: 10px 8px; border-radius: 8px;
      border: 1px solid rgba(100,140,255,0.2);
      background: rgba(100,140,255,0.08); cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
      font-family: inherit;
    }
    .hire-btn:not(:disabled):hover {
      background: rgba(100,140,255,0.18);
      border-color: rgba(100,140,255,0.4);
    }
    .hire-btn:disabled {
      opacity: 0.35; cursor: not-allowed;
    }
    .hire-icon { font-size: 1.3em; }
    .hire-name {
      color: #fff; font-size: 0.78em; font-weight: 600;
    }
    .hire-cost {
      color: #a78bfa; font-size: 0.72em;
    }
    .roster-list {
      display: flex; flex-direction: column; gap: 6px;
    }
    .emp-card {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 8px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
    }
    .emp-icon { font-size: 1.3em; flex-shrink: 0; }
    .emp-info { flex: 1; min-width: 0; }
    .emp-name {
      color: #fff; font-size: 0.85em; font-weight: 600;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .emp-meta {
      color: rgba(255,255,255,0.4); font-size: 0.72em; margin-top: 2px;
    }
    .emp-xp { width: 80px; flex-shrink: 0; }
    .xp-bar {
      height: 5px; background: rgba(255,255,255,0.1);
      border-radius: 3px; overflow: hidden;
    }
    .xp-fill {
      height: 100%; background: #7cc576;
      border-radius: 3px; transition: width 0.3s;
    }
    .xp-label {
      color: rgba(255,255,255,0.4); font-size: 0.65em;
      text-align: center; margin-top: 2px;
    }
    .empty-state {
      text-align: center; color: rgba(255,255,255,0.3); padding: 20px;
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
export class EmployeePanelComponent {
  @Input() employees: Employee[] = [];
  @Input() expressPoints = 0;
  @Input() configs: EmployeeConfig[] = [];
  @Input() fmt: (n: number) => string = (n) => n.toString();
  @Output() closePanel = new EventEmitter<void>();
  @Output() hireEmployee = new EventEmitter<EmployeeType>();

  private costCache = new Map<EmployeeType, number>();
  private lastEmployeeCount = -1;

  canAfford(type: EmployeeType): boolean {
    return this.expressPoints >= this.getCost(type);
  }

  getCost(type: EmployeeType): number {
    this.refreshCostCache();
    const cached = this.costCache.get(type);
    if (cached !== undefined) return cached;

    const cfg = this.configs.find((c) => c.type === type);
    if (!cfg) return Infinity;
    const count = this.employees.filter((e) => e.type === type).length;
    const cost = Math.floor(cfg.baseCost * Math.pow(cfg.costMultiplier, count));
    this.costCache.set(type, cost);
    return cost;
  }

  getIcon(type: EmployeeType): string {
    const cfg = this.configs.find((c) => c.type === type);
    return cfg ? cfg.icon : '?';
  }

  getTypeName(type: EmployeeType): string {
    const cfg = this.configs.find((c) => c.type === type);
    return cfg ? cfg.name : type;
  }

  xpPercent(emp: Employee): number {
    const xpToLevel = emp.level * 100;
    return xpToLevel > 0 ? (emp.xp / xpToLevel) * 100 : 0;
  }

  xpDisplay(emp: Employee): string {
    const xpToLevel = emp.level * 100;
    return Math.floor(emp.xp) + '/' + xpToLevel;
  }

  private refreshCostCache(): void {
    if (this.employees.length !== this.lastEmployeeCount) {
      this.costCache.clear();
      this.lastEmployeeCount = this.employees.length;
    }
  }
}
