import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-golden-package',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible) {
      <div
        class="golden-package"
        [style.left.%]="x"
        [style.top.%]="y"
        (click)="onClick()"
      >
        <div class="golden-glow"></div>
        <div class="golden-icon">📦</div>
      </div>
    }
  `,
  styles: [
    `
      .golden-package {
        position: absolute;
        width: 60px;
        height: 60px;
        cursor: pointer;
        z-index: 100;
        animation: goldenFloat 2s ease-in-out infinite,
          goldenPulse 0.5s ease-in-out infinite alternate;
        transform: translate(-50%, -50%);
      }
      .golden-glow {
        position: absolute;
        inset: -15px;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(255, 215, 0, 0.4),
          transparent 70%
        );
        animation: goldenRotate 3s linear infinite;
      }
      .golden-icon {
        position: relative;
        font-size: 2.5em;
        text-align: center;
        filter: brightness(1.4) saturate(2)
          drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
      }
      @keyframes goldenFloat {
        0%,
        100% {
          transform: translate(-50%, -50%) translateY(0);
        }
        50% {
          transform: translate(-50%, -50%) translateY(-10px);
        }
      }
      @keyframes goldenPulse {
        from {
          filter: brightness(1);
        }
        to {
          filter: brightness(1.3);
        }
      }
      @keyframes goldenRotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class GoldenPackageComponent {
  @Input() visible: boolean = false;
  @Input() x: number = 50;
  @Input() y: number = 50;
  @Output() goldenClick = new EventEmitter<void>();

  onClick(): void {
    this.goldenClick.emit();
  }
}
