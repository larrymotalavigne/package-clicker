import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TooltipService } from '../../services/tooltip.service';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tooltipService.tooltip(); as tip) {
      <div
        class="tooltip"
        [style.left.px]="tip.x"
        [style.top.px]="tip.y"
      >
        <div class="tooltip-title">{{ tip.title }}</div>
        <div class="tooltip-desc">{{ tip.description }}</div>
        @if (tip.extra) {
          <div class="tooltip-extra">
            {{ tip.extra }}
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      .tooltip {
        position: fixed;
        z-index: 9999;
        background: #1a1a2e;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 6px;
        padding: 10px 14px;
        max-width: 280px;
        pointer-events: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      }
      .tooltip-title {
        font-weight: 700;
        font-size: 0.9em;
        color: #fff;
        margin-bottom: 4px;
      }
      .tooltip-desc {
        font-size: 0.8em;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.4;
      }
      .tooltip-extra {
        font-size: 0.75em;
        color: rgba(255, 215, 0, 0.7);
        margin-top: 6px;
        font-style: italic;
      }
    `,
  ],
})
export class TooltipComponent {
  tooltipService = inject(TooltipService);
}
