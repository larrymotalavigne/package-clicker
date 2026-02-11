export interface KingdomCityConfig {
  id: string;
  name: string;
  icon: string;
  baseEpPerMinute: number;
  unlockEpThreshold: number;
  upgradeCostBase: number;
}

export const KINGDOM_CITIES: KingdomCityConfig[] = [
  { id: 'village', name: 'Parcel Village', icon: '\uD83C\uDFE0', baseEpPerMinute: 0.1, unlockEpThreshold: 50, upgradeCostBase: 10 },
  { id: 'town', name: 'Stamp Town', icon: '\uD83C\uDFD8', baseEpPerMinute: 0.2, unlockEpThreshold: 100, upgradeCostBase: 25 },
  { id: 'city', name: 'Courier City', icon: '\uD83C\uDF06', baseEpPerMinute: 0.4, unlockEpThreshold: 200, upgradeCostBase: 50 },
  { id: 'metro', name: 'Express Metro', icon: '\uD83D\uDE87', baseEpPerMinute: 0.6, unlockEpThreshold: 350, upgradeCostBase: 80 },
  { id: 'capital', name: 'Logistics Capital', icon: '\uD83C\uDFDB', baseEpPerMinute: 0.8, unlockEpThreshold: 500, upgradeCostBase: 120 },
  { id: 'port', name: 'Shipping Port', icon: '\u2693', baseEpPerMinute: 1.0, unlockEpThreshold: 700, upgradeCostBase: 170 },
  { id: 'hub', name: 'Global Hub', icon: '\uD83C\uDF10', baseEpPerMinute: 1.5, unlockEpThreshold: 900, upgradeCostBase: 230 },
  { id: 'skyline', name: 'Skyline District', icon: '\uD83C\uDFD9', baseEpPerMinute: 2.0, unlockEpThreshold: 1100, upgradeCostBase: 300 },
  { id: 'orbital', name: 'Orbital Station', icon: '\uD83D\uDE80', baseEpPerMinute: 3.0, unlockEpThreshold: 1350, upgradeCostBase: 400 },
  { id: 'lunar', name: 'Lunar Colony', icon: '\uD83C\uDF19', baseEpPerMinute: 4.0, unlockEpThreshold: 1600, upgradeCostBase: 500 },
  { id: 'stellar', name: 'Stellar Nexus', icon: '\u2B50', baseEpPerMinute: 5.0, unlockEpThreshold: 1850, upgradeCostBase: 650 },
  { id: 'quantum', name: 'Quantum Citadel', icon: '\uD83D\uDD2E', baseEpPerMinute: 8.0, unlockEpThreshold: 2000, upgradeCostBase: 800 },
];
