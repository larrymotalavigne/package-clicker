import { SeasonalTheme } from '../models/game.models';

export const SEASONAL_THEMES: SeasonalTheme[] = [
  {
    id: 'holiday',
    name: 'Peak Season',
    months: [11, 0], // December, January
    icon: '\u{1F384}',
    productionBonus: 0.15,
    specialEvent: {
      id: 'holiday_rush',
      name: 'Holiday Rush',
      description: 'Peak season! Everyone wants packages delivered by Christmas! +50% production!',
      icon: '\u{1F381}',
      type: 'positive',
      effect: { type: 'production_mult', value: 1.5 },
      durationMs: 60000,
      seasonal: 'holiday',
    },
  },
  {
    id: 'valentines',
    name: 'Valentine\'s Express',
    months: [1], // February
    icon: '\u{1F49D}',
    productionBonus: 0.10,
    specialEvent: {
      id: 'love_delivery',
      name: 'Love Delivery',
      description: 'Valentine\'s rush! Heart-shaped packages fly off the shelves! +30% click power!',
      icon: '\u{1F48C}',
      type: 'positive',
      effect: { type: 'click_mult', value: 1.3 },
      durationMs: 45000,
      seasonal: 'valentines',
    },
  },
  {
    id: 'spring',
    name: 'Spring Logistics',
    months: [2, 3], // March, April
    icon: '\u{1F338}',
    productionBonus: 0.05,
  },
  {
    id: 'summer',
    name: 'Summer Shipping',
    months: [5, 6], // June, July
    icon: '\u{2600}\u{FE0F}',
    productionBonus: 0.08,
    specialEvent: {
      id: 'heatwave',
      name: 'Summer Heatwave',
      description: 'Record temperatures! Ice cream packages melt but spirit doesn\'t! +20% production!',
      icon: '\u{1F321}\u{FE0F}',
      type: 'positive',
      effect: { type: 'production_mult', value: 1.2 },
      durationMs: 30000,
      seasonal: 'summer',
    },
  },
  {
    id: 'backtoschool',
    name: 'Back to School',
    months: [7, 8], // August, September
    icon: '\u{1F4DA}',
    productionBonus: 0.10,
  },
  {
    id: 'halloween',
    name: 'Spooky Season',
    months: [9], // October
    icon: '\u{1F383}',
    productionBonus: 0.12,
    specialEvent: {
      id: 'ghost_delivery',
      name: 'Ghost Delivery',
      description: 'Spooky packages appear and disappear! +25% golden package frequency!',
      icon: '\u{1F47B}',
      type: 'positive',
      effect: { type: 'production_mult', value: 1.25 },
      durationMs: 45000,
      seasonal: 'halloween',
    },
  },
  {
    id: 'blackfriday',
    name: 'Black Friday',
    months: [10], // November
    icon: '\u{1F6D2}',
    productionBonus: 0.20,
    specialEvent: {
      id: 'mega_sale',
      name: 'Black Friday Mega Sale',
      description: 'EVERYTHING must ship! Buildings cost 25% less! Maximum throughput!',
      icon: '\u{1F4B8}',
      type: 'positive',
      effect: { type: 'building_discount', value: 0.75 },
      durationMs: 60000,
      seasonal: 'blackfriday',
    },
  },
];

export function getCurrentSeason(): SeasonalTheme | undefined {
  const month = new Date().getMonth();
  return SEASONAL_THEMES.find(t => t.months.includes(month));
}
