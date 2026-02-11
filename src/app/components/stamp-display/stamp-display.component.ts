import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-stamp-display',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="stamp-pill" (click)="openStampPanel.emit()">
      <span class="stamp-icon">\uD83D\uDCEE</span>
      <span class="stamp-count">{{ stamps }}</span>
      <div class="progress-track">
        <div
          class="progress-fill"
          [style.width.%]="progressPercent"
        ></div>
      </div>
    </button>
  `,
  styles: [
    `
      .stamp-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #1a1a2e;
        border: 1px solid #2a2a4a;
        border-radius: 20px;
        padding: 4px 12px 4px 8px;
        cursor: pointer;
        transition: border-color 0.2s, background 0.2s;
        color: #ccc;
        font-family: inherit;
        font-size: 0.85em;
      }

      .stamp-pill:hover {
        border-color: #d4a017;
        background: #1e1e36;
      }

      .stamp-icon {
        font-size: 1.1em;
        line-height: 1;
      }

      .stamp-count {
        color: #d4a017;
        font-weight: 700;
        font-size: 0.95em;
        min-width: 14px;
        text-align: center;
      }

      .progress-track {
        width: 36px;
        height: 4px;
        background: #0d0d1a;
        border-radius: 2px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #d4a017, #f0c040);
        border-radius: 2px;
        transition: width 0.3s linear;
      }
    `,
  ],
})
export class StampDisplayComponent {
  @Input() stamps = 0;
  @Input() progressPercent = 0;
  @Output() openStampPanel = new EventEmitter<void>();
}
