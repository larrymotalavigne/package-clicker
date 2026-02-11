import { Injectable, signal } from '@angular/core';
import { WeatherConfig, WEATHER_CONFIGS } from '../config/weather.config';

/** Cumulative weights for weather selection: clear 30%, cloudy 25%, rainy 20%, storm 10%, foggy 10%, snow 5% */
const WEATHER_WEIGHTS: { type: string; cumWeight: number }[] = [
  { type: 'clear', cumWeight: 0.30 },
  { type: 'cloudy', cumWeight: 0.55 },
  { type: 'rainy', cumWeight: 0.75 },
  { type: 'storm', cumWeight: 0.85 },
  { type: 'foggy', cumWeight: 0.95 },
  { type: 'snow', cumWeight: 1.00 },
];

const MIN_CHANGE_MS = 180_000;
const MAX_CHANGE_MS = 300_000;

@Injectable({ providedIn: 'root' })
export class WeatherService {
  readonly currentWeather = signal<WeatherConfig>(WEATHER_CONFIGS[0]);

  private changeTimer: ReturnType<typeof setTimeout> | null = null;

  start(): void {
    this.changeWeather();
  }

  stop(): void {
    if (this.changeTimer) {
      clearTimeout(this.changeTimer);
      this.changeTimer = null;
    }
  }

  getPpsMult(): number {
    return this.currentWeather().ppsMult;
  }

  getClickMult(): number {
    return this.currentWeather().clickMult;
  }

  getGoldenFreqMult(): number {
    return this.currentWeather().goldenFreqMult;
  }

  private changeWeather(): void {
    const picked = this.pickWeighted();
    this.currentWeather.set(picked);
    this.scheduleNext();
  }

  private scheduleNext(): void {
    if (this.changeTimer) {
      clearTimeout(this.changeTimer);
    }
    const delay = MIN_CHANGE_MS + Math.random() * (MAX_CHANGE_MS - MIN_CHANGE_MS);
    this.changeTimer = setTimeout(() => this.changeWeather(), delay);
  }

  private pickWeighted(): WeatherConfig {
    const roll = Math.random();
    for (const entry of WEATHER_WEIGHTS) {
      if (roll < entry.cumWeight) {
        const found = WEATHER_CONFIGS.find((w) => w.type === entry.type);
        if (found) return found;
      }
    }
    return WEATHER_CONFIGS[0];
  }
}
