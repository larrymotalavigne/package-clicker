export interface Building {
  count: number;
  basePrice: number;
  pps: number;
}

export interface BuildingConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePrice: number;
  pps: number;
}

export interface GameState {
  packages: number;
  packagesPerSecond: number;
  packagesPerClick: number;
  buildings: {
    cursor: Building;
    grandma: Building;
    farm: Building;
    mine: Building;
    factory: Building;
    bank: Building;
    warehouse: Building;
    airport: Building;
    spaceport: Building;
    ceo: Building;
  };
  achievements: string[];
  totalPackagesClicked: number;
  totalPackagesEarned: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  type: 'packages' | 'cursor' | 'grandma' | 'farm' | 'mine' | 'factory' | 'bank' | 'warehouse' | 'airport' | 'spaceport' | 'ceo' | 'clicks';
  unlocked?: boolean;
}