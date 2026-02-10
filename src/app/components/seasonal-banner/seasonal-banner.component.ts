import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SeasonalTheme } from '../../models/game.models';

@Component({
  selector: 'app-seasonal-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (season) {
      <div class="seasonal-banner" role="status" aria-label="Seasonal event active">
        <span class="season-icon">{{ season.icon }}</span>
        <span class="season-name">{{ season.name }}</span>
        <span class="season-bonus">+{{ (season.productionBonus * 100).toFixed(0) }}% production</span>
      </div>
    }
  `,
  styles: [`
    .seasonal-banner {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 4px 12px; background: rgba(255,215,0,0.06);
      border-bottom: 1px solid rgba(255,215,0,0.1);
      font-size: 0.75em; animation: bannerGlow 3s ease-in-out infinite;
    }
    .season-icon { font-size: 1.2em; }
    .season-name { color: #ffd700; font-weight: 600; }
    .season-bonus { color: rgba(255,215,0,0.6); }
    @keyframes bannerGlow {
      0%, 100% { background: rgba(255,215,0,0.04); }
      50% { background: rgba(255,215,0,0.08); }
    }
  `],
})
export class SeasonalBannerComponent {
  @Input() season: SeasonalTheme | null = null;
}
