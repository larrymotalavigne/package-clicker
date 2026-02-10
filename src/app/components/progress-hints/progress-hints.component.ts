import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export interface ProgressHint {
  text: string;
  progress: number;
}

@Component({
  selector: 'app-progress-hints',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hints.length > 0) {
      <div class="hints-container" role="complementary" aria-label="Progress hints">
        <div class="hint">
          <div class="hint-text">{{ hints[currentIndex % hints.length].text }}</div>
          <div class="hint-bar">
            <div class="hint-fill" [style.width.%]="hints[currentIndex % hints.length].progress"></div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .hints-container {
      padding: 6px 16px; border-top: 1px solid rgba(255,255,255,0.04);
    }
    .hint-text {
      font-size: 0.7em; color: rgba(255,255,255,0.35);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .hint-bar {
      height: 2px; background: rgba(255,255,255,0.06);
      border-radius: 1px; margin-top: 3px; overflow: hidden;
    }
    .hint-fill {
      height: 100%; background: rgba(124,197,118,0.4);
      border-radius: 1px; transition: width 0.5s ease;
    }
  `],
})
export class ProgressHintsComponent {
  @Input() hints: ProgressHint[] = [];
  @Input() currentIndex: number = 0;
}
