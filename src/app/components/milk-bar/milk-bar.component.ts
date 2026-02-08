import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-milk-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="milk-bar">
      <div
        class="milk-fill"
        [style.height.%]="percentage"
        [style.opacity]="percentage > 0 ? 1 : 0"
      ></div>
    </div>
  `,
  styles: [
    `
      .milk-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 120px;
        overflow: hidden;
        pointer-events: none;
      }
      .milk-fill {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(
          to top,
          rgba(255, 255, 255, 0.15),
          rgba(200, 220, 255, 0.08)
        );
        transition: height 1s ease;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
    `,
  ],
})
export class MilkBarComponent {
  @Input() percentage: number = 0;
}
