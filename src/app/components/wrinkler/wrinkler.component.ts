import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Wrinkler } from '../../models/game.models';

@Component({
  selector: 'app-wrinkler',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (w of wrinklers; track w.id) {
      <div
        class="wrinkler"
        [style.--angle]="w.angle + 'deg'"
        [title]="'Eaten: ' + formatEaten(w.eaten) + ' (click to pop)'"
        (click)="pop.emit(w.id)"
      >
        <div class="wrinkler-body"></div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .wrinkler {
        position: absolute;
        top: 50%;
        left: 50%;
        pointer-events: all;
        cursor: pointer;
        animation: wrinklerOrbit 20s linear infinite;
        transform-origin: 0 0;
        transform: rotate(var(--angle)) translateX(100px);
      }
      .wrinkler-body {
        width: 20px;
        height: 28px;
        background: radial-gradient(
          ellipse at center,
          #4a2060,
          #2d1040
        );
        border-radius: 50% 50% 45% 45%;
        box-shadow: 0 0 8px rgba(80, 20, 100, 0.6),
          inset 0 -4px 6px rgba(0, 0, 0, 0.3);
        position: relative;
      }
      .wrinkler-body::before {
        content: '';
        position: absolute;
        top: 5px;
        left: 4px;
        width: 5px;
        height: 5px;
        background: #ff4444;
        border-radius: 50%;
        box-shadow: 7px 0 0 #ff4444;
      }
      .wrinkler:hover .wrinkler-body {
        filter: brightness(1.4);
      }
      @keyframes wrinklerOrbit {
        from {
          transform: rotate(var(--angle)) translateX(100px);
        }
        to {
          transform: rotate(calc(var(--angle) + 360deg))
            translateX(100px);
        }
      }
    `,
  ],
})
export class WrinklerComponent {
  @Input() wrinklers: Wrinkler[] = [];
  @Output() pop = new EventEmitter<number>();

  trackWrinkler(_: number, w: Wrinkler): number {
    return w.id;
  }

  formatEaten(n: number): string {
    if (n < 1000) return Math.floor(n).toString();
    if (n < 1e6) return (n / 1e3).toFixed(1) + 'K';
    return (n / 1e6).toFixed(1) + 'M';
  }
}
