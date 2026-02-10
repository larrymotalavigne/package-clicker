import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { MiniGameResult } from '../../models/game.models';

@Component({
  selector: 'app-mini-game',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="minigame-overlay">
      <div class="minigame-panel">
        @switch (phase()) {
          @case ('intro') {
            <h2>\u26A1 Speed Sort</h2>
            <p class="mg-desc">Click the package as fast as you can! 10 seconds!</p>
            <button class="mg-btn" (click)="start()">Start!</button>
          }
          @case ('playing') {
            <div class="timer">{{ timeLeft() }}s</div>
            <div class="score">Score: {{ score() }}</div>
            <button class="big-click-btn" (click)="handleClick()">
              \uD83D\uDCE6
            </button>
          }
          @case ('results') {
            <h2>Results!</h2>
            <div class="final-score">{{ score() }} clicks</div>
            <div class="ep-earned">+{{ epEarned() }} Express Points</div>
            <button class="mg-btn" (click)="finish()">Claim</button>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .minigame-overlay {
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(0,0,0,0.8); display: flex;
      align-items: center; justify-content: center;
    }
    .minigame-panel {
      background: linear-gradient(135deg, #1a1a3e, #12122a);
      border: 2px solid rgba(100,140,255,0.3); border-radius: 16px;
      padding: 32px; text-align: center; min-width: 300px;
      animation: popIn 0.3s ease-out;
    }
    h2 { color: #fff; margin-bottom: 12px; }
    .mg-desc { color: rgba(255,255,255,0.6); font-size: 0.9em; margin-bottom: 20px; }
    .mg-btn {
      padding: 10px 28px; background: linear-gradient(135deg, #648cff, #4060cc);
      border: none; border-radius: 8px; color: #fff;
      font-size: 1em; font-weight: 600; cursor: pointer; font-family: inherit;
    }
    .mg-btn:hover { filter: brightness(1.1); }
    .timer { font-size: 2em; color: #ffd700; font-weight: 700; }
    .score { font-size: 1.2em; color: rgba(255,255,255,0.7); margin: 8px 0 16px; }
    .big-click-btn {
      font-size: 4em; width: 120px; height: 120px;
      border-radius: 50%; border: 3px solid rgba(100,140,255,0.4);
      background: rgba(100,140,255,0.1); cursor: pointer;
      transition: transform 0.05s;
    }
    .big-click-btn:active { transform: scale(0.9); }
    .final-score { font-size: 2.5em; color: #fff; font-weight: 700; }
    .ep-earned { color: #a78bfa; font-size: 1.2em; margin: 8px 0 20px; }
    @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `],
})
export class MiniGameComponent {
  @Output() complete = new EventEmitter<MiniGameResult>();
  @Output() closeGame = new EventEmitter<void>();

  phase = signal<'intro' | 'playing' | 'results'>('intro');
  score = signal(0);
  timeLeft = signal(10);
  epEarned = signal(0);

  private timer: ReturnType<typeof setInterval> | null = null;

  start(): void {
    this.score.set(0);
    this.timeLeft.set(10);
    this.phase.set('playing');

    this.timer = setInterval(() => {
      const t = this.timeLeft() - 1;
      this.timeLeft.set(t);
      if (t <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  handleClick(): void {
    if (this.phase() !== 'playing') return;
    this.score.update(s => s + 1);
  }

  private endGame(): void {
    if (this.timer) clearInterval(this.timer);
    const ep = Math.floor(this.score() / 5);
    this.epEarned.set(ep);
    this.phase.set('results');
  }

  finish(): void {
    this.complete.emit({
      score: this.score(),
      expressPointsEarned: this.epEarned(),
    });
  }
}
