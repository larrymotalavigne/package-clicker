import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LeaderboardEntry } from '../../models/game.models';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="closePanel.emit()">
      <div class="panel" (click)="$event.stopPropagation()">
        <div class="panel-header">
          <h2>\uD83C\uDFC6 Leaderboard</h2>
          <button class="close-btn" (click)="closePanel.emit()">x</button>
        </div>

        <div class="season-bar">
          <span class="season-label">Season ends in</span>
          <span class="season-time">{{ formatTimer(seasonTimer) }}</span>
        </div>

        <div class="rank-summary">
          Your rank: <span class="player-rank">#{{ playerRank }}</span>
          <span class="rank-of">/ {{ entries.length }}</span>
        </div>

        <div class="entry-list">
          @for (entry of visibleEntries; track entry.rank) {
            <div
              class="entry-row"
              [class.player-row]="entry.isPlayer"
              [class.top-three]="entry.rank <= 3"
            >
              <span class="entry-rank">
                @if (entry.rank === 1) {
                  \uD83E\uDD47
                } @else if (entry.rank === 2) {
                  \uD83E\uDD48
                } @else if (entry.rank === 3) {
                  \uD83E\uDD49
                } @else {
                  #{{ entry.rank }}
                }
              </span>
              <span class="entry-name">{{ entry.name }}</span>
              <span class="entry-score">{{ fmt(entry.score) }}</span>
            </div>
          }
          @if (showSeparator) {
            <div class="separator">\u00B7 \u00B7 \u00B7</div>
          }
          @for (entry of neighborEntries; track entry.rank) {
            <div
              class="entry-row"
              [class.player-row]="entry.isPlayer"
            >
              <span class="entry-rank">#{{ entry.rank }}</span>
              <span class="entry-name">{{ entry.name }}</span>
              <span class="entry-score">{{ fmt(entry.score) }}</span>
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
        max-width: 450px;
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
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
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
      .season-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        background: rgba(255, 215, 0, 0.06);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        font-size: 0.85em;
      }
      .season-label {
        color: rgba(255, 255, 255, 0.5);
      }
      .season-time {
        color: #ffd700;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      .rank-summary {
        text-align: center;
        padding: 12px 20px;
        font-size: 0.9em;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      .player-rank {
        color: #ffd700;
        font-weight: 700;
        font-size: 1.15em;
      }
      .rank-of {
        color: rgba(255, 255, 255, 0.35);
        font-size: 0.85em;
      }
      .entry-list {
        padding: 8px 12px 16px;
      }
      .entry-row {
        display: flex;
        align-items: center;
        padding: 6px 8px;
        border-radius: 6px;
        font-size: 0.85em;
        gap: 8px;
        transition: background 0.15s;
      }
      .entry-row:hover {
        background: rgba(255, 255, 255, 0.04);
      }
      .entry-row.player-row {
        background: rgba(255, 215, 0, 0.12);
        border: 1px solid rgba(255, 215, 0, 0.25);
      }
      .entry-row.top-three {
        font-weight: 600;
      }
      .entry-rank {
        min-width: 36px;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9em;
      }
      .entry-row.player-row .entry-rank {
        color: #ffd700;
      }
      .entry-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .entry-row.player-row .entry-name {
        color: #ffd700;
        font-weight: 600;
      }
      .entry-score {
        color: rgba(255, 255, 255, 0.6);
        font-variant-numeric: tabular-nums;
        min-width: 70px;
        text-align: right;
      }
      .entry-row.player-row .entry-score {
        color: #ffd700;
      }
      .separator {
        text-align: center;
        padding: 6px 0;
        color: rgba(255, 255, 255, 0.2);
        font-size: 0.85em;
        letter-spacing: 4px;
      }
    `,
  ],
})
export class LeaderboardComponent {
  @Input() entries: LeaderboardEntry[] = [];
  @Input() playerRank: number = 51;
  @Input() seasonTimer: number = 0;
  @Input() fmt: (n: number) => string = (n) => n.toString();
  @Output() closePanel = new EventEmitter<void>();

  get visibleEntries(): LeaderboardEntry[] {
    return this.getTopEntries();
  }

  get neighborEntries(): LeaderboardEntry[] {
    return this.getNeighborEntries();
  }

  get showSeparator(): boolean {
    return this.playerRank > 12;
  }

  formatTimer(ms: number): string {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  }

  private getTopEntries(): LeaderboardEntry[] {
    const top10 = this.entries.slice(0, 10);
    if (this.playerRank <= 10) {
      return top10;
    }
    return top10;
  }

  private getNeighborEntries(): LeaderboardEntry[] {
    if (this.playerRank <= 12) {
      return [];
    }
    const idx = this.playerRank - 1;
    const start = Math.max(10, idx - 1);
    const end = Math.min(this.entries.length, idx + 2);
    return this.entries.slice(start, end);
  }
}
