export interface StockConfig {
  buildingId: string;
  name: string;
  icon: string;
  basePrice: number;
  volatility: number;
}

export const STOCK_CONFIGS: StockConfig[] = [
  { buildingId: 'cursor', name: 'TRK', icon: '\uD83D\uDE9A', basePrice: 10, volatility: 0.15 },
  { buildingId: 'grandma', name: 'SRT', icon: '\uD83C\uDFED', basePrice: 50, volatility: 0.12 },
  { buildingId: 'farm', name: 'DST', icon: '\uD83D\uDCE6', basePrice: 100, volatility: 0.18 },
  { buildingId: 'mine', name: 'AIR', icon: '\u2708', basePrice: 500, volatility: 0.2 },
  { buildingId: 'factory', name: 'SEA', icon: '\uD83D\uDEA2', basePrice: 1000, volatility: 0.22 },
  { buildingId: 'bank', name: 'FDX', icon: '\uD83C\uDFEA', basePrice: 5000, volatility: 0.1 },
  { buildingId: 'warehouse', name: 'WHS', icon: '\uD83C\uDFDA', basePrice: 10000, volatility: 0.16 },
  { buildingId: 'airport', name: 'INT', icon: '\uD83C\uDF10', basePrice: 50000, volatility: 0.2 },
  { buildingId: 'spaceport', name: 'SPC', icon: '\uD83D\uDE80', basePrice: 200000, volatility: 0.25 },
  { buildingId: 'ceo', name: 'CEO', icon: '\uD83D\uDC54', basePrice: 500000, volatility: 0.14 },
  { buildingId: 'satellite', name: 'SAT', icon: '\uD83D\uDEF0', basePrice: 1000000, volatility: 0.2 },
  { buildingId: 'timemachine', name: 'TME', icon: '\u231B', basePrice: 5000000, volatility: 0.28 },
  { buildingId: 'multiverse', name: 'MLT', icon: '\uD83C\uDF00', basePrice: 20000000, volatility: 0.3 },
];
