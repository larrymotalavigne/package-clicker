import {
  Component,
  Input,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  text: string;
}

@Component({
  selector: 'app-particle-effects',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="particles-container">
      @for (p of particles(); track p.id) {
        <div
          class="particle"
          [style.left.px]="p.x"
          [style.top.px]="p.y"
          [style.--dx.px]="p.dx"
          [style.--dy.px]="p.dy"
        >
          {{ p.text }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .particles-container {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }
      .particle {
        position: absolute;
        font-size: 1.4em;
        font-weight: 700;
        color: #ffd700;
        text-shadow: 0 0 6px rgba(255, 215, 0, 0.4);
        animation: particleFly 0.8s ease-out forwards;
        pointer-events: none;
      }
      @keyframes particleFly {
        0% {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(var(--dx), var(--dy)) scale(0.5);
        }
      }
    `,
  ],
})
export class ParticleEffectsComponent {
  @Input() enabled: boolean = true;

  readonly particles = signal<Particle[]>([]);
  private nextId = 0;

  spawn(x: number, y: number, text: string = '+1'): void {
    if (!this.enabled) return;

    const count = 3 + Math.floor(Math.random() * 3);
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 40 + Math.random() * 60;
      newParticles.push({
        id: this.nextId++,
        x,
        y,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 30,
        text: i === 0 ? text : '📦',
      });
    }

    this.particles.update((p) => [...p, ...newParticles]);

    setTimeout(() => {
      const ids = new Set(newParticles.map((np) => np.id));
      this.particles.update((p) => p.filter((pp) => !ids.has(pp.id)));
    }, 850);
  }

  trackParticle(_: number, p: Particle): number {
    return p.id;
  }
}
