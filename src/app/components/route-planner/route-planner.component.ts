import {
  Component, Output, EventEmitter,
  ChangeDetectionStrategy, signal, computed,
} from '@angular/core';
import { RoutePlannerResult } from '../../models/game.models';

interface City {
  id: string;
  name: string;
  x: number;
  y: number;
}

const CITIES: City[] = [
  { id: 'NYC', name: 'New York', x: 78, y: 28 },
  { id: 'LAX', name: 'Los Angeles', x: 15, y: 45 },
  { id: 'CHI', name: 'Chicago', x: 60, y: 25 },
  { id: 'MIA', name: 'Miami', x: 75, y: 65 },
  { id: 'DEN', name: 'Denver', x: 38, y: 35 },
  { id: 'SEA', name: 'Seattle', x: 15, y: 15 },
  { id: 'DAL', name: 'Dallas', x: 48, y: 55 },
  { id: 'ATL', name: 'Atlanta', x: 68, y: 50 },
  { id: 'PHX', name: 'Phoenix', x: 25, y: 55 },
];

@Component({
  selector: 'app-route-planner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rp-overlay">
      <div class="rp-panel">
        @switch (phase()) {
          @case ('intro') {
            <h2>\uD83D\uDDFA\uFE0F Route Planner</h2>
            <p class="rp-desc">
              Plan the most efficient delivery route!
              Visit all 9 cities with the shortest total distance.
            </p>
            <button class="rp-btn" (click)="start()">Start</button>
            <button class="rp-close" (click)="closeGame.emit()">Cancel</button>
          }
          @case ('playing') {
            <div class="rp-header">
              <span class="rp-dist">Distance: {{ totalDistance().toFixed(1) }}</span>
              <span class="rp-count">{{ route().length }} / {{ cityCount }}</span>
            </div>
            <div class="map-area">
              <svg class="route-lines" viewBox="0 0 100 80"
                preserveAspectRatio="none">
                @for (seg of segments(); track seg.i) {
                  <line
                    [attr.x1]="seg.x1" [attr.y1]="seg.y1"
                    [attr.x2]="seg.x2" [attr.y2]="seg.y2"
                    stroke="#ffd700" stroke-width="0.5"
                    stroke-dasharray="1,1" />
                }
              </svg>
              @for (city of allCities; track city.id) {
                <button
                  class="city-node"
                  [class.visited]="isVisited(city.id)"
                  [class.current]="isCurrent(city.id)"
                  [class.clickable]="isClickable(city.id)"
                  [style.left.%]="city.x"
                  [style.top.%]="city.y"
                  [disabled]="!isClickable(city.id)"
                  (click)="selectCity(city.id)">
                  <span class="city-dot"></span>
                  <span class="city-label">{{ city.id }}</span>
                </button>
              }
            </div>
            <div class="rp-actions">
              <button class="rp-btn rp-undo"
                [disabled]="route().length <= 1"
                (click)="undo()">Undo</button>
              @if (route().length === cityCount) {
                <button class="rp-btn rp-finish"
                  (click)="finishRoute()">Finish Route</button>
              }
            </div>
          }
          @case ('results') {
            <h2>Route Complete!</h2>
            <div class="result-rating"
              [class.excellent]="rating() === 'excellent'"
              [class.good]="rating() === 'good'">
              {{ ratingLabel() }}
            </div>
            <div class="result-distance">
              Total distance: {{ totalDistance().toFixed(1) }}
            </div>
            <div class="result-buff">{{ buffDescription() }}</div>
            <div class="result-ep">+{{ epReward() }} EP</div>
            <button class="rp-btn" (click)="claimReward()">
              Claim Reward
            </button>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .rp-overlay {
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(0,0,0,0.85); display: flex;
      align-items: center; justify-content: center;
    }
    .rp-panel {
      background: linear-gradient(135deg, #0d1117, #161b22);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
      padding: 24px; max-width: 560px; width: 95%;
      animation: popIn 0.3s ease-out; text-align: center;
    }
    h2 { color: #fff; margin: 0 0 12px; }
    .rp-desc {
      color: rgba(255,255,255,0.6); font-size: 0.9em; margin-bottom: 20px;
    }
    .rp-btn {
      padding: 10px 28px;
      background: linear-gradient(135deg, #648cff, #4060cc);
      border: none; border-radius: 8px; color: #fff;
      font-size: 1em; font-weight: 600; cursor: pointer;
      font-family: inherit; margin: 4px;
    }
    .rp-btn:hover { filter: brightness(1.1); }
    .rp-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .rp-close {
      background: none; border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px; color: rgba(255,255,255,0.5); padding: 8px 20px;
      cursor: pointer; font-family: inherit; margin-left: 8px;
    }
    .rp-header {
      display: flex; justify-content: space-between;
      color: rgba(255,255,255,0.6); font-size: 0.85em; margin-bottom: 8px;
    }
    .rp-dist { color: #ffd700; font-weight: 600; }
    .map-area {
      position: relative; width: 100%; height: 0;
      padding-bottom: 60%; background: #0d1117;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px; overflow: hidden;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 10% 10%;
    }
    .route-lines {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none;
    }
    .city-node {
      position: absolute; transform: translate(-50%, -50%);
      background: none; border: none; cursor: default;
      padding: 0; display: flex; flex-direction: column;
      align-items: center; gap: 2px; z-index: 1;
    }
    .city-node.clickable { cursor: pointer; }
    .city-dot {
      width: 18px; height: 18px; border-radius: 50%;
      background: radial-gradient(circle, #445, #223);
      border: 2px solid rgba(255,255,255,0.15);
      transition: all 0.2s;
    }
    .city-node.visited .city-dot {
      background: radial-gradient(circle, #4a8, #286);
      border-color: #7cc576;
      box-shadow: 0 0 8px rgba(124,197,118,0.4);
    }
    .city-node.current .city-dot {
      border-color: #ffd700;
      box-shadow: 0 0 12px rgba(255,215,0,0.5);
      animation: pulse 1s infinite;
    }
    .city-node.clickable:not(.visited) .city-dot {
      border-color: rgba(100,140,255,0.5);
    }
    .city-node.clickable:not(.visited):hover .city-dot {
      border-color: #648cff;
      box-shadow: 0 0 8px rgba(100,140,255,0.4);
    }
    .city-node:not(.visited):not(.clickable) .city-dot {
      opacity: 0.35;
    }
    .city-label {
      font-size: 0.55em; color: rgba(255,255,255,0.7);
      font-weight: 600; letter-spacing: 0.5px;
    }
    .rp-actions { margin-top: 12px; }
    .rp-undo {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .rp-finish {
      background: linear-gradient(135deg, #4a8c4a, #357a35);
    }
    .result-rating {
      font-size: 1.8em; font-weight: 700;
      color: rgba(255,255,255,0.7); margin: 12px 0 8px;
    }
    .result-rating.excellent { color: #ffd700; }
    .result-rating.good { color: #7cc576; }
    .result-distance {
      color: rgba(255,255,255,0.5); font-size: 0.9em; margin-bottom: 8px;
    }
    .result-buff {
      color: #648cff; font-size: 0.9em; margin-bottom: 4px;
    }
    .result-ep {
      color: #a78bfa; font-size: 1.3em; font-weight: 600; margin-bottom: 16px;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 6px rgba(255,215,0,0.4); }
      50% { box-shadow: 0 0 16px rgba(255,215,0,0.7); }
    }
    @keyframes popIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `],
})
export class RoutePlannerComponent {
  @Output() complete = new EventEmitter<RoutePlannerResult>();
  @Output() closeGame = new EventEmitter<void>();

  readonly allCities = CITIES;
  readonly cityCount = CITIES.length;
  readonly phase = signal<'intro' | 'playing' | 'results'>('intro');
  readonly route = signal<string[]>([]);
  readonly rating = signal<'excellent' | 'good' | 'ok'>('ok');
  readonly epReward = signal(0);

  readonly totalDistance = computed(() => {
    const r = this.route();
    if (r.length < 2) return 0;
    let d = 0;
    for (let i = 1; i < r.length; i++) {
      d += this.distBetween(r[i - 1], r[i]);
    }
    return d;
  });

  readonly segments = computed(() => {
    const r = this.route();
    const segs: { i: number; x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 1; i < r.length; i++) {
      const a = this.getCity(r[i - 1]);
      const b = this.getCity(r[i]);
      if (a && b) {
        segs.push({ i, x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      }
    }
    return segs;
  });

  start(): void {
    const idx = Math.floor(Math.random() * CITIES.length);
    this.route.set([CITIES[idx].id]);
    this.phase.set('playing');
  }

  selectCity(id: string): void {
    if (!this.isClickable(id)) return;
    this.route.update((r) => [...r, id]);
  }

  undo(): void {
    const r = this.route();
    if (r.length <= 1) return;
    this.route.set(r.slice(0, -1));
  }

  isVisited(id: string): boolean {
    return this.route().includes(id);
  }

  isCurrent(id: string): boolean {
    const r = this.route();
    return r.length > 0 && r[r.length - 1] === id;
  }

  isClickable(id: string): boolean {
    if (this.phase() !== 'playing') return false;
    return !this.route().includes(id);
  }

  finishRoute(): void {
    const dist = this.totalDistance();
    let r: 'excellent' | 'good' | 'ok';
    let ep: number;
    if (dist < 200) {
      r = 'excellent'; ep = 20;
    } else if (dist <= 280) {
      r = 'good'; ep = 10;
    } else {
      r = 'ok'; ep = 5;
    }
    this.rating.set(r);
    this.epReward.set(ep);
    this.phase.set('results');
  }

  ratingLabel(): string {
    const labels = { excellent: 'Excellent!', good: 'Good', ok: 'OK' };
    return labels[this.rating()];
  }

  buffDescription(): string {
    const r = this.rating();
    if (r === 'excellent') return '1.5x PPS for 120s';
    if (r === 'good') return '1.25x PPS for 90s';
    return '1.1x PPS for 60s';
  }

  claimReward(): void {
    const r = this.rating();
    const map = {
      excellent: { mult: 1.5, dur: 120000, ep: 20 },
      good: { mult: 1.25, dur: 90000, ep: 10 },
      ok: { mult: 1.1, dur: 60000, ep: 5 },
    };
    const cfg = map[r];
    this.complete.emit({
      distance: this.totalDistance(),
      rating: r,
      buffMultiplier: cfg.mult,
      buffDurationMs: cfg.dur,
      expressPointsEarned: cfg.ep,
    });
  }

  private getCity(id: string): City | undefined {
    return CITIES.find((c) => c.id === id);
  }

  private distBetween(a: string, b: string): number {
    const ca = this.getCity(a);
    const cb = this.getCity(b);
    if (!ca || !cb) return 0;
    return Math.hypot(ca.x - cb.x, ca.y - cb.y);
  }
}
