import { WeatherType } from '../models/game.models';

export interface WeatherConfig {
  type: WeatherType;
  name: string;
  icon: string;
  ppsMult: number;
  clickMult: number;
  goldenFreqMult: number;
}

export const WEATHER_CONFIGS: WeatherConfig[] = [
  { type: 'clear', name: 'Clear Skies', icon: '\u2600', ppsMult: 1.1, clickMult: 1, goldenFreqMult: 1 },
  { type: 'cloudy', name: 'Cloudy', icon: '\u2601', ppsMult: 1, clickMult: 1, goldenFreqMult: 1 },
  { type: 'rainy', name: 'Rainy', icon: '\uD83C\uDF27', ppsMult: 0.9, clickMult: 1, goldenFreqMult: 1 },
  { type: 'storm', name: 'Thunderstorm', icon: '\u26C8', ppsMult: 0.8, clickMult: 1, goldenFreqMult: 1.2 },
  { type: 'foggy', name: 'Foggy', icon: '\uD83C\uDF2B', ppsMult: 0.95, clickMult: 1.05, goldenFreqMult: 1 },
  { type: 'snow', name: 'Snow', icon: '\u2744', ppsMult: 0.9, clickMult: 1.15, goldenFreqMult: 1 },
];
