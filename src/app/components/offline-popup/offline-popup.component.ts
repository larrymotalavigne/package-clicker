import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-offline-popup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="offline-overlay" (click)="claim.emit()">
      <div class="offline-panel" (click)="$event.stopPropagation()">
        <div class="offline-icon">\uD83C\uDF19</div>
        <h2>Welcome Back!</h2>
        <p class="offline-time">You were away for {{ formatTime(seconds) }}</p>
        <div class="offline-earned">
          <span class="earned-amount">+{{ formattedEarnings }}</span>
          <span class="earned-label">packages earned offline</span>
        </div>
        <button class="claim-btn" (click)="claim.emit()">Claim Packages</button>
      </div>
    </div>
  `,
  styles: [
    `
    .offline-overlay {
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.3s ease-out;
    }
    .offline-panel {
      background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
      border: 1px solid rgba(100, 140, 255, 0.3);
      border-radius: 16px; padding: 32px 40px; text-align: center;
      max-width: 380px; animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .offline-icon { font-size: 3em; margin-bottom: 8px; }
    h2 { color: #fff; margin-bottom: 8px; font-size: 1.4em; }
    .offline-time { color: rgba(255,255,255,0.5); font-size: 0.85em; margin-bottom: 16px; }
    .offline-earned { margin: 16px 0; }
    .earned-amount {
      display: block; font-size: 2em; font-weight: 700;
      color: #7cc576; text-shadow: 0 0 20px rgba(124,197,118,0.4);
    }
    .earned-label { color: rgba(255,255,255,0.5); font-size: 0.8em; }
    .claim-btn {
      margin-top: 20px; padding: 12px 32px;
      background: linear-gradient(135deg, #7cc576, #5aa54e);
      border: none; border-radius: 8px; color: #fff;
      font-size: 1em; font-weight: 600; cursor: pointer;
      font-family: inherit; transition: transform 0.15s;
    }
    .claim-btn:hover { transform: scale(1.05); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    `,
  ],
})
export class OfflinePopupComponent {
  @Input() earnings: number = 0;
  @Input() formattedEarnings: string = '0';
  @Input() seconds: number = 0;
  @Output() claim = new EventEmitter<void>();

  formatTime(sec: number): string {
    if (sec < 60) return `${sec} seconds`;
    if (sec < 3600) return `${Math.floor(sec / 60)} minutes`;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
  }
}
