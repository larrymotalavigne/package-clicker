import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ChallengeConfig, ActiveChallenge } from '../../models/game.models';

@Component({
  selector: 'app-challenge-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="challenge-overlay" (click)="closePanel.emit()">
      <div class="challenge-panel" (click)="$event.stopPropagation()">
        <div class="panel-header">
          <h2>Challenges</h2>
          <button class="close-btn" (click)="closePanel.emit()">\u2715</button>
        </div>

        @if (active) {
          <div class="active-challenge">
            <div class="active-header">Active Challenge</div>
            <div class="active-name">{{ getChallengeName(active.id) }}</div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="(active.progress / active.target) * 100"></div>
            </div>
            <div class="progress-text">{{ active.progress }} / {{ active.target }}</div>
            <div class="time-remaining">{{ formatMs(active.remainingMs) }} remaining</div>
          </div>
        }

        @if (result) {
          <div class="result-banner" [class.success]="result.success" [class.fail]="!result.success">
            {{ result.success ? 'Challenge Complete! +' + result.reward + ' EP' : 'Challenge Failed!' }}
          </div>
        }

        <div class="challenge-list">
          @for (ch of available; track ch.id) {
            <div class="challenge-card" [class.disabled]="!!active">
              <div class="ch-icon">{{ ch.icon }}</div>
              <div class="ch-info">
                <div class="ch-name">{{ ch.name }}</div>
                <div class="ch-desc">{{ ch.description }}</div>
                <div class="ch-reward">Reward: {{ ch.reward.expressPoints }} EP</div>
              </div>
              <button class="start-btn" [disabled]="!!active" (click)="startChallenge.emit(ch.id)">Start</button>
            </div>
          }
          @if (available.length === 0 && !active) {
            <div class="all-done">All challenges completed!</div>
          }
        </div>

        <div class="completed-count">Completed: {{ completedCount }} / {{ totalCount }}</div>
      </div>
    </div>
  `,
  styles: [`
    .challenge-overlay {
      position: fixed; inset: 0; z-index: 1500;
      background: rgba(0,0,0,0.7); display: flex;
      align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease-out;
    }
    .challenge-panel {
      background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
      padding: 24px; max-width: 500px; width: 90%; max-height: 80vh;
      overflow-y: auto; animation: slideIn 0.3s ease-out;
    }
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    h2 { color: #fff; font-size: 1.2em; }
    .close-btn { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 1.2em; cursor: pointer; }
    .active-challenge {
      background: rgba(100,140,255,0.1); border: 1px solid rgba(100,140,255,0.3);
      border-radius: 8px; padding: 16px; margin-bottom: 16px; text-align: center;
    }
    .active-header { color: rgba(100,140,255,0.8); font-size: 0.75em; text-transform: uppercase; letter-spacing: 1px; }
    .active-name { color: #fff; font-size: 1.1em; font-weight: 600; margin: 4px 0 8px; }
    .progress-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; background: #7cc576; border-radius: 3px; transition: width 0.2s; }
    .progress-text { color: rgba(255,255,255,0.6); font-size: 0.8em; margin-top: 4px; }
    .time-remaining { color: rgba(255,200,100,0.8); font-size: 0.8em; margin-top: 2px; }
    .result-banner {
      text-align: center; padding: 10px; border-radius: 8px; margin-bottom: 12px;
      font-weight: 600; animation: popIn 0.3s ease-out;
    }
    .result-banner.success { background: rgba(124,197,118,0.15); color: #7cc576; border: 1px solid rgba(124,197,118,0.3); }
    .result-banner.fail { background: rgba(200,80,80,0.15); color: #c55; border: 1px solid rgba(200,80,80,0.3); }
    .challenge-card {
      display: flex; align-items: center; gap: 12px;
      padding: 12px; border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px; margin-bottom: 8px; transition: opacity 0.2s;
    }
    .challenge-card.disabled { opacity: 0.4; }
    .ch-icon { font-size: 1.5em; flex-shrink: 0; }
    .ch-info { flex: 1; }
    .ch-name { color: #fff; font-weight: 600; font-size: 0.9em; }
    .ch-desc { color: rgba(255,255,255,0.5); font-size: 0.8em; margin-top: 2px; }
    .ch-reward { color: #a78bfa; font-size: 0.75em; margin-top: 4px; }
    .start-btn {
      padding: 6px 16px; background: rgba(100,140,255,0.15);
      border: 1px solid rgba(100,140,255,0.3); border-radius: 6px;
      color: #648cff; cursor: pointer; font-family: inherit; font-size: 0.8em;
    }
    .start-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .start-btn:not(:disabled):hover { background: rgba(100,140,255,0.25); }
    .all-done { text-align: center; color: #7cc576; padding: 20px; }
    .completed-count { text-align: center; color: rgba(255,255,255,0.3); font-size: 0.75em; margin-top: 12px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes popIn { from { transform: scale(0.9); } to { transform: scale(1); } }
  `],
})
export class ChallengePanelComponent {
  @Input() available: ChallengeConfig[] = [];
  @Input() active: ActiveChallenge | null = null;
  @Input() completedCount: number = 0;
  @Input() totalCount: number = 0;
  @Input() result: { success: boolean; reward: number } | null = null;
  @Output() startChallenge = new EventEmitter<string>();
  @Output() closePanel = new EventEmitter<void>();

  getChallengeName(id: string): string {
    return this.available.find(c => c.id === id)?.name ?? id;
  }

  formatMs(ms: number): string {
    const s = Math.ceil(ms / 1000);
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  }
}
