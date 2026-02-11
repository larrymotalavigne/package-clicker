import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AutomationRule } from '../../models/game.models';

@Component({
  selector: 'app-automation-panel',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="onOverlayClick($event)">
      <div class="panel">
        <div class="panel-header">
          <h2>\u2699\uFE0F Automation</h2>
          <button class="close-btn" (click)="closePanel.emit()">
            \u2715
          </button>
        </div>

        <p class="ep-display">
          Express Points: <span class="ep-value">{{ expressPoints }}</span>
        </p>

        <div class="rules-list">
          @for (rule of rules; track rule.id) {
            <div
              class="rule-row"
              [class.unlocked]="isRuleUnlocked(rule.id)"
              [class.enabled]="isRuleEnabled(rule.id)"
              [class.locked]="!isRuleUnlocked(rule.id)"
            >
              <span class="rule-icon">{{ rule.icon }}</span>
              <div class="rule-info">
                <span class="rule-name">{{ rule.name }}</span>
                <span class="rule-desc">{{ rule.description }}</span>
              </div>
              <div class="rule-action">
                @if (isRuleUnlocked(rule.id)) {
                  <button
                    class="toggle-btn"
                    [class.active]="isRuleEnabled(rule.id)"
                    (click)="toggleRule.emit(rule.id)"
                  >
                    {{ isRuleEnabled(rule.id) ? 'ON' : 'OFF' }}
                  </button>
                } @else {
                  <button
                    class="unlock-btn"
                    [disabled]="expressPoints < rule.epCost"
                    (click)="unlockRule.emit(rule.id)"
                  >
                    {{ rule.epCost }} EP
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 20, 0.88);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .panel {
        background: linear-gradient(180deg, #0d0d2b, #1a1a3e);
        border: 1px solid rgba(0, 200, 255, 0.2);
        border-radius: 12px;
        width: 92%;
        max-width: 500px;
        max-height: 85vh;
        overflow-y: auto;
        color: #e0e0e0;
        padding: 20px;
        animation: zoomIn 0.3s ease-out;
      }
      @keyframes zoomIn {
        from {
          opacity: 0;
          transform: scale(0.85);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .panel-header h2 {
        margin: 0;
        color: #00c8ff;
        font-size: 1.3em;
      }
      .close-btn {
        background: none;
        border: none;
        color: #888;
        font-size: 1.2em;
        cursor: pointer;
        padding: 4px 8px;
      }
      .close-btn:hover {
        color: #fff;
      }
      .ep-display {
        text-align: center;
        font-size: 0.9em;
        color: #aaa;
        margin: 0 0 16px;
      }
      .ep-value {
        color: #ffd700;
        font-weight: 700;
      }
      .rules-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .rule-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition: all 0.2s;
      }
      .rule-row.locked {
        opacity: 0.5;
      }
      .rule-row.unlocked:not(.enabled) {
        opacity: 0.7;
        border-color: rgba(0, 200, 255, 0.15);
      }
      .rule-row.enabled {
        opacity: 1;
        border-color: rgba(76, 175, 80, 0.4);
        background: rgba(76, 175, 80, 0.06);
      }
      .rule-icon {
        font-size: 1.5em;
        flex-shrink: 0;
        width: 36px;
        text-align: center;
      }
      .rule-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .rule-name {
        font-weight: 600;
        font-size: 0.92em;
        color: #e0e0e0;
      }
      .rule-desc {
        font-size: 0.78em;
        color: #999;
      }
      .rule-action {
        flex-shrink: 0;
      }
      .unlock-btn {
        background: linear-gradient(135deg, #ffd700, #ffaa00);
        border: none;
        border-radius: 6px;
        color: #1a1a2e;
        font-weight: 700;
        font-size: 0.8em;
        padding: 6px 12px;
        cursor: pointer;
        font-family: inherit;
        transition: opacity 0.2s;
      }
      .unlock-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .unlock-btn:not(:disabled):hover {
        filter: brightness(1.15);
      }
      .toggle-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 6px;
        color: #aaa;
        font-weight: 700;
        font-size: 0.8em;
        padding: 6px 14px;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
      }
      .toggle-btn.active {
        background: rgba(76, 175, 80, 0.3);
        border-color: rgba(76, 175, 80, 0.6);
        color: #4caf50;
      }
      .toggle-btn:hover {
        border-color: rgba(255, 255, 255, 0.3);
      }
    `,
  ],
})
export class AutomationPanelComponent {
  @Input() rules: AutomationRule[] = [];
  @Input() unlocked: string[] = [];
  @Input() enabled: string[] = [];
  @Input() expressPoints: number = 0;

  @Output() closePanel = new EventEmitter<void>();
  @Output() unlockRule = new EventEmitter<string>();
  @Output() toggleRule = new EventEmitter<string>();

  isRuleUnlocked(ruleId: string): boolean {
    return this.unlocked.includes(ruleId);
  }

  isRuleEnabled(ruleId: string): boolean {
    return this.enabled.includes(ruleId);
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.closePanel.emit();
    }
  }
}
