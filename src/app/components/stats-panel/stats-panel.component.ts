import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../models/game.models';
import { AchievementProgress } from '../../services/achievement.service';

@Component({
  selector: 'app-stats-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="closePanel.emit()">
      <div class="panel" (click)="$event.stopPropagation()">
        <div class="panel-header">
          <h2>Statistics</h2>
          <button class="close-btn" (click)="closePanel.emit()">x</button>
        </div>

        <div class="tabs">
          @for (t of tabs; track t) {
            <button
              [class.active]="activeTab === t"
              (click)="activeTab = t"
            >
              {{ t }}
            </button>
          }
        </div>

        <div class="tab-content">
          @switch (activeTab) {
            @case ('General') {
              <div class="stat-list">
                <div class="stat-row">
                  <span>Packages in bank</span>
                  <span>{{ fmt(state.packages) }}</span>
                </div>
                <div class="stat-row">
                  <span>Total earned</span>
                  <span>{{ fmt(state.totalPackagesEarned) }}</span>
                </div>
                <div class="stat-row">
                  <span>Per second (raw)</span>
                  <span>{{ fmt(state.packagesPerSecond) }}</span>
                </div>
                <div class="stat-row">
                  <span>Per click</span>
                  <span>{{ fmt(perClick) }}</span>
                </div>
                <div class="stat-row">
                  <span>Total clicks</span>
                  <span>{{ fmt(state.totalPackagesClicked) }}</span>
                </div>
                <div class="stat-row">
                  <span>Golden packages clicked</span>
                  <span>{{ state.goldenPackageClicks }}</span>
                </div>
                <div class="stat-row">
                  <span>Upgrades purchased</span>
                  <span>{{ state.purchasedUpgrades.length }}</span>
                </div>
                <div class="stat-row">
                  <span>Prestige level</span>
                  <span>{{ state.prestige.level }}</span>
                </div>
                <div class="stat-row">
                  <span>Times ascended</span>
                  <span>{{ state.prestige.timesAscended }}</span>
                </div>
                <div class="stat-row">
                  <span>Play time</span>
                  <span>{{ formatTime(state.totalPlayTime) }}</span>
                </div>
              </div>
            }
            @case ('Buildings') {
              <div class="stat-list">
                @for (b of buildingStats; track b.name) {
                  <div class="stat-row">
                    <span>{{ b.name }}</span>
                    <span>{{ b.count }} ({{ fmt(b.cps) }} pps)</span>
                  </div>
                }
              </div>
            }
            @case ('Achievements') {
              <div class="achievement-grid">
                @for (a of achievementProgress; track a.achievement.name) {
                  <div
                    class="ach-item"
                    [class.unlocked]="a.isUnlocked"
                    [class.ach-hidden]="a.achievement.hidden && !a.isUnlocked"
                  >
                    @if (a.achievement.hidden && !a.isUnlocked) {
                      <div class="ach-dot ach-mystery">?</div>
                    } @else {
                      <div class="ach-dot"></div>
                    }
                    <div class="ach-tooltip">
                      @if (a.achievement.hidden && !a.isUnlocked) {
                        <strong>???</strong><br>Keep searching...
                      } @else {
                        <strong>{{ a.achievement.name }}</strong>
                        @if (a.isUnlocked) {
                          <span class="ach-unlocked-badge">\u2713</span>
                        }
                        <br>{{ a.achievement.description }}
                        @if (!a.isUnlocked) {
                          <div class="ach-progress-bar">
                            <div class="ach-progress-fill" [style.width.%]="a.progress"></div>
                          </div>
                        }
                      }
                    </div>
                  </div>
                }
                <div class="ach-summary">
                  {{ unlockedCount }} / {{ totalCount }} ({{
                    completionPct | number : '1.0-0'
                  }}%)
                </div>
              </div>
            }
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
        background: rgba(0, 0, 0, 0.7);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: overlayFadeIn 0.2s ease-out;
      }
      .panel {
        background: #1a1a2e;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        color: #e0e0e0;
        animation: panelSlideIn 0.3s ease-out;
      }
      @keyframes overlayFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes panelSlideIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .panel-header h2 {
        margin: 0;
        font-size: 1.2em;
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
      .tabs {
        display: flex;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .tabs button {
        flex: 1;
        background: none;
        border: none;
        padding: 10px;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        font-size: 0.85em;
        border-bottom: 2px solid transparent;
        font-family: inherit;
      }
      .tabs button.active {
        color: #ffd700;
        border-bottom-color: #ffd700;
      }
      .tab-content {
        padding: 16px 20px;
      }
      .stat-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .stat-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.85em;
        padding: 4px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      }
      .stat-row span:last-child {
        color: #ffd700;
        font-weight: 600;
      }
      .achievement-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding-bottom: 12px;
      }
      .ach-item {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: default;
      }
      .ach-tooltip {
        display: none;
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background: #0d0d20;
        border: 1px solid rgba(255, 215, 0, 0.25);
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 0.75em;
        color: #e0e0e0;
        white-space: nowrap;
        z-index: 10;
        pointer-events: none;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
        line-height: 1.4;
      }
      .ach-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: rgba(255, 215, 0, 0.25);
      }
      .ach-item:hover .ach-tooltip {
        display: block;
      }
      .ach-unlocked-badge {
        color: #4caf50;
        margin-left: 4px;
        font-weight: 700;
      }
      .ach-progress-bar {
        margin-top: 4px;
        height: 3px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
      }
      .ach-progress-fill {
        height: 100%;
        background: #ffd700;
        border-radius: 2px;
        transition: width 0.3s;
      }
      .ach-dot {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.1);
      }
      .ach-item.unlocked .ach-dot {
        background: #ffd700;
        box-shadow: 0 0 4px rgba(255, 215, 0, 0.5);
      }
      .ach-hidden {
        opacity: 0.5;
      }
      .ach-hidden .ach-tooltip {
        border-color: rgba(128, 0, 255, 0.3);
      }
      .ach-hidden .ach-tooltip::after {
        border-top-color: rgba(128, 0, 255, 0.3);
      }
      .ach-mystery {
        font-size: 7px;
        color: rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(128, 0, 255, 0.15);
        border: 1px solid rgba(128, 0, 255, 0.2);
      }
      .ach-summary {
        width: 100%;
        text-align: center;
        font-size: 0.8em;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 8px;
      }
    `,
  ],
})
export class StatsPanelComponent {
  @Input() state!: GameState;
  @Input() perClick: number = 1;
  @Input() achievementProgress: AchievementProgress[] = [];
  @Input() unlockedCount: number = 0;
  @Input() totalCount: number = 0;
  @Input() completionPct: number = 0;
  @Input() buildingStats: {
    name: string;
    count: number;
    cps: number;
  }[] = [];
  @Input() fmt: (n: number) => string = (n) => n.toString();
  @Output() closePanel = new EventEmitter<void>();

  tabs = ['General', 'Buildings', 'Achievements'];
  activeTab = 'General';

  formatTime(ms: number): string {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  }
}
