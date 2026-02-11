import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
} from '@angular/core';
import { ActiveContract } from '../../models/game.models';

@Component({
  selector: 'app-contract-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="contract-overlay" (click)="closePanel.emit()">
      <div class="contract-panel" (click)="$event.stopPropagation()">
        <div class="panel-header">
          <h2>\uD83D\uDCCB Delivery Contracts</h2>
          <button class="close-btn" (click)="closePanel.emit()">\u2715</button>
        </div>

        <div class="refresh-timer">
          New contracts in {{ formatTimer(refreshTimer) }}
        </div>

        <div class="contract-list">
          @for (c of contracts; track c.configId; let i = $index) {
            <div class="contract-card" [class.accepted]="c.accepted">
              <div class="card-top">
                <span class="c-icon">{{ c.icon }}</span>
                <div class="c-info">
                  <div class="c-name">{{ c.name }}</div>
                  <div class="c-desc">{{ c.description }}</div>
                </div>
                <div class="c-reward">+{{ c.reward.expressPoints }} EP</div>
              </div>

              @if (c.accepted) {
                <div class="c-progress-section">
                  <div class="progress-bar">
                    <div class="progress-fill"
                      [style.width.%]="progressPct(c)"></div>
                  </div>
                  <div class="progress-info">
                    <span>{{ fmt(c.progress) }} / {{ fmt(c.target) }}</span>
                    <span class="c-timer">{{ formatTimer(c.remainingMs) }}</span>
                  </div>
                </div>
              } @else {
                <div class="card-actions">
                  <button class="accept-btn"
                    [disabled]="hasAccepted()"
                    (click)="acceptContract.emit(i)">Accept</button>
                  <button class="refresh-btn"
                    [disabled]="expressPoints < 5"
                    (click)="refreshSlot.emit(i)">
                    Refresh (5 EP)
                  </button>
                </div>
              }
            </div>
          }
          @if (contracts.length === 0) {
            <div class="empty-state">No contracts available</div>
          }
        </div>

        <div class="completed-count">
          Completed: {{ completedCount }} contracts
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contract-overlay {
      position: fixed; inset: 0; z-index: 1500;
      background: rgba(0,0,0,0.7); display: flex;
      align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease-out;
    }
    .contract-panel {
      background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
      padding: 24px; max-width: 480px; width: 90%; max-height: 80vh;
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
    .refresh-timer {
      text-align: center; color: rgba(255,200,100,0.7);
      font-size: 0.8em; margin-bottom: 16px;
    }
    .contract-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px; padding: 14px; margin-bottom: 10px;
      transition: border-color 0.2s;
    }
    .contract-card.accepted {
      border-color: rgba(100,140,255,0.3);
    }
    .card-top {
      display: flex; align-items: center; gap: 10px;
    }
    .c-icon { font-size: 1.5em; flex-shrink: 0; }
    .c-info { flex: 1; }
    .c-name { color: #fff; font-weight: 600; font-size: 0.9em; }
    .c-desc {
      color: rgba(255,255,255,0.5); font-size: 0.8em; margin-top: 2px;
    }
    .c-reward {
      color: #a78bfa; font-size: 0.85em; font-weight: 600;
      white-space: nowrap;
    }
    .c-progress-section { margin-top: 10px; }
    .progress-bar {
      height: 6px; background: rgba(255,255,255,0.1);
      border-radius: 3px; overflow: hidden;
    }
    .progress-fill {
      height: 100%; background: #7cc576;
      border-radius: 3px; transition: width 0.3s;
    }
    .progress-info {
      display: flex; justify-content: space-between;
      color: rgba(255,255,255,0.5); font-size: 0.75em; margin-top: 4px;
    }
    .c-timer { color: rgba(255,200,100,0.8); }
    .card-actions {
      display: flex; gap: 8px; margin-top: 10px;
    }
    .accept-btn, .refresh-btn {
      flex: 1; padding: 6px 12px; border-radius: 6px;
      border: 1px solid rgba(100,140,255,0.3); font-family: inherit;
      font-size: 0.8em; cursor: pointer;
    }
    .accept-btn {
      background: rgba(100,140,255,0.15); color: #648cff;
    }
    .accept-btn:not(:disabled):hover {
      background: rgba(100,140,255,0.25);
    }
    .refresh-btn {
      background: rgba(167,139,250,0.1); color: #a78bfa;
      border-color: rgba(167,139,250,0.3);
    }
    .refresh-btn:not(:disabled):hover {
      background: rgba(167,139,250,0.2);
    }
    .accept-btn:disabled, .refresh-btn:disabled {
      opacity: 0.3; cursor: not-allowed;
    }
    .empty-state {
      text-align: center; color: rgba(255,255,255,0.3); padding: 20px;
    }
    .completed-count {
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
export class ContractPanelComponent {
  @Input() contracts: ActiveContract[] = [];
  @Input() refreshTimer = 0;
  @Input() expressPoints = 0;
  @Input() completedCount = 0;
  @Input() fmt: (n: number) => string = (n) => n.toString();
  @Output() closePanel = new EventEmitter<void>();
  @Output() acceptContract = new EventEmitter<number>();
  @Output() refreshSlot = new EventEmitter<number>();

  hasAccepted(): boolean {
    return this.contracts.some((c) => c.accepted);
  }

  progressPct(c: ActiveContract): number {
    return c.target > 0 ? (c.progress / c.target) * 100 : 0;
  }

  formatTimer(ms: number): string {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const pad = sec < 10 ? '0' : '';
    return `${min}:${pad}${sec}`;
  }
}
