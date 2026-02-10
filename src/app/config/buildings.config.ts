import { BuildingConfig } from '../models/game.models';
import { BUILDING_DISPLAY_INFO } from '../constants/building-display.constants';

// Building configuration data separated from display information
const BUILDING_DATA = [
  { id: 'cursor', basePrice: 15, pps: 1 },
  { id: 'grandma', basePrice: 100, pps: 8 },
  { id: 'farm', basePrice: 1100, pps: 47 },
  { id: 'mine', basePrice: 12000, pps: 260 },
  { id: 'factory', basePrice: 130000, pps: 1400 },
  { id: 'bank', basePrice: 1400000, pps: 7800 },
  { id: 'warehouse', basePrice: 20000000, pps: 44000 },
  { id: 'airport', basePrice: 330000000, pps: 260000 },
  { id: 'spaceport', basePrice: 5100000000, pps: 1600000 },
  { id: 'ceo', basePrice: 75000000000, pps: 10000000 },
  { id: 'satellite', basePrice: 1000000000000, pps: 65000000 },
  { id: 'timemachine', basePrice: 14000000000000, pps: 430000000 },
  { id: 'multiverse', basePrice: 200000000000000, pps: 2900000000 }
];

export const BUILDING_CONFIGS: BuildingConfig[] = BUILDING_DATA.map(data => {
  const displayInfo = BUILDING_DISPLAY_INFO[data.id];
  if (!displayInfo) {
    throw new Error(`Missing display info for building: ${data.id}`);
  }
  
  return {
    id: data.id,
    name: displayInfo.name,
    description: displayInfo.description,
    icon: displayInfo.icon,
    basePrice: data.basePrice,
    pps: data.pps
  };
});

// Helper function to get building config by ID
export function getBuildingConfig(id: string): BuildingConfig | undefined {
  return BUILDING_CONFIGS.find(config => config.id === id);
}

// Helper function to get all building IDs
export function getBuildingIds(): string[] {
  return BUILDING_CONFIGS.map(config => config.id);
}