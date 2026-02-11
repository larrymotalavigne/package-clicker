import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { WeatherConfig } from '../../config/weather.config';

@Component({
  selector: 'app-weather-display',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (weather) {
      <div class="weather-pill" [class]="'weather-' + weather.type">
        <span class="weather-icon">{{ weather.icon }}</span>
        <span class="weather-name">{{ weather.name }}</span>
        <span class="weather-effects">{{ effectText }}</span>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .weather-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px;
        border-radius: 12px;
        background: #1a1a2e;
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 0.75em;
        color: #ccc;
        animation: weatherFadeIn 0.6s ease;
        white-space: nowrap;
      }
      .weather-icon {
        font-size: 1.1em;
      }
      .weather-name {
        font-weight: 600;
        color: #e0e0e0;
      }
      .weather-effects {
        opacity: 0.7;
        font-size: 0.9em;
      }
      .weather-clear {
        border-color: rgba(255, 200, 50, 0.3);
      }
      .weather-cloudy {
        border-color: rgba(160, 160, 180, 0.3);
      }
      .weather-rainy {
        border-color: rgba(80, 140, 220, 0.3);
      }
      .weather-storm {
        border-color: rgba(180, 100, 255, 0.3);
      }
      .weather-foggy {
        border-color: rgba(180, 180, 200, 0.3);
      }
      .weather-snow {
        border-color: rgba(200, 220, 255, 0.3);
      }
      @keyframes weatherFadeIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class WeatherDisplayComponent {
  @Input() weather!: WeatherConfig;

  get effectText(): string {
    const parts: string[] = [];
    this.appendPpsEffect(parts);
    this.appendClickEffect(parts);
    this.appendGoldenEffect(parts);
    return parts.length > 0 ? parts.join(' ') : 'No effect';
  }

  private appendPpsEffect(parts: string[]): void {
    const diff = Math.round((this.weather.ppsMult - 1) * 100);
    if (diff > 0) parts.push('+' + diff + '% PPS');
    if (diff < 0) parts.push(diff + '% PPS');
  }

  private appendClickEffect(parts: string[]): void {
    const diff = Math.round((this.weather.clickMult - 1) * 100);
    if (diff > 0) parts.push('+' + diff + '% Click');
    if (diff < 0) parts.push(diff + '% Click');
  }

  private appendGoldenEffect(parts: string[]): void {
    const diff = Math.round((this.weather.goldenFreqMult - 1) * 100);
    if (diff > 0) parts.push('+' + diff + '% Golden');
    if (diff < 0) parts.push(diff + '% Golden');
  }
}
