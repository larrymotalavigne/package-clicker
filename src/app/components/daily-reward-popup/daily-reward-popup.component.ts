import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DailyRewardConfig } from '../../models/game.models';

@Component({
  selector: 'app-daily-reward-popup',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible) {
      <div class="overlay" (click)="claim.emit()">
        <div class="panel" (click)="$event.stopPropagation()">
          <div class="header-icon">\uD83D\uDCE6</div>
          <h2>Daily Login Reward</h2>
          <p class="streak-label">
            Streak: <span class="streak-value">{{ streak }} day{{ streak !== 1 ? 's' : '' }}</span>
          </p>
          <div class="calendar">
            @for (reward of rewards; track reward.day) {
              <div
                class="day-cell"
                [class.past]="reward.day < currentDay"
                [class.today]="reward.day === currentDay"
                [class.future]="reward.day > currentDay"
              >
                <div class="day-number">Day {{ reward.day }}</div>
                <div class="day-icon">{{ reward.day < currentDay ? '\u2705' : reward.icon }}</div>
                <div class="day-name">{{ reward.name }}</div>
                <div class="day-reward">{{ formatReward(reward) }}</div>
              </div>
            }
          </div>
          <button class="claim-btn" (click)="claim.emit()">
            Claim Reward
          </button>
        </div>
      </div>
    }
  `,
  styles: [
    `
    .overlay {
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(0, 0, 0, 0.75);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.3s ease-out;
    }
    .panel {
      background: linear-gradient(135deg, #1a1a2e, #0d0d2b);
      border: 1px solid rgba(255, 215, 0, 0.3);
      border-radius: 16px; padding: 28px 32px;
      text-align: center; max-width: 640px; width: 90%;
      animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                  0 0 40px rgba(255, 215, 0, 0.08);
    }
    .header-icon { font-size: 2.8em; margin-bottom: 4px; }
    h2 {
      color: #ffd700; margin: 0 0 4px 0; font-size: 1.3em;
      text-shadow: 0 0 12px rgba(255, 215, 0, 0.3);
    }
    .streak-label {
      color: rgba(255, 255, 255, 0.5); font-size: 0.85em; margin: 0 0 18px 0;
    }
    .streak-value { color: #ffd700; font-weight: 600; }

    .calendar {
      display: flex; gap: 6px; justify-content: center;
      flex-wrap: wrap; margin-bottom: 20px;
    }
    .day-cell {
      width: 76px; padding: 10px 4px;
      border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.03);
      transition: all 0.2s;
    }
    .day-cell.past {
      opacity: 0.5; border-color: rgba(124, 197, 118, 0.3);
      background: rgba(124, 197, 118, 0.06);
    }
    .day-cell.today {
      border-color: rgba(255, 215, 0, 0.6);
      background: rgba(255, 215, 0, 0.1);
      box-shadow: 0 0 16px rgba(255, 215, 0, 0.15);
      transform: scale(1.06);
    }
    .day-cell.future {
      opacity: 0.35;
    }
    .day-number {
      font-size: 0.65em; color: rgba(255, 255, 255, 0.4);
      margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .day-icon { font-size: 1.6em; margin-bottom: 4px; }
    .day-name {
      font-size: 0.62em; color: rgba(255, 255, 255, 0.7);
      margin-bottom: 2px; white-space: nowrap; overflow: hidden;
      text-overflow: ellipsis;
    }
    .day-reward {
      font-size: 0.58em; color: rgba(255, 215, 0, 0.7);
      font-weight: 600;
    }

    .claim-btn {
      padding: 12px 36px;
      background: linear-gradient(135deg, #ffd700, #e6ac00);
      border: none; border-radius: 8px;
      color: #1a1a2e; font-size: 1em; font-weight: 700;
      cursor: pointer; font-family: inherit;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
    }
    .claim-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 28px rgba(255, 215, 0, 0.45);
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    `,
  ],
})
export class DailyRewardPopupComponent {
  @Input() visible: boolean = false;
  @Input() currentDay: number = 1;
  @Input() rewards: DailyRewardConfig[] = [];
  @Input() streak: number = 0;
  @Output() claim = new EventEmitter<void>();

  formatReward(reward: DailyRewardConfig): string {
    switch (reward.reward.type) {
      case 'ep':
        return `+${reward.reward.value} EP`;
      case 'packages':
        return `+${reward.reward.value} pkg`;
      case 'buff':
        return `${reward.reward.value / 1000}s Frenzy`;
      default:
        return '';
    }
  }
}
