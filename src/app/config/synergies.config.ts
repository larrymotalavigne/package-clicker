import { BuildingSynergy } from '../models/game.models';

export const BUILDING_SYNERGIES: BuildingSynergy[] = [
  { source: 'cursor', target: 'grandma', bonusPerUnit: 0.001, description: 'Each Delivery Truck boosts Sorting Facilities by 0.1%' },
  { source: 'grandma', target: 'cursor', bonusPerUnit: 0.002, description: 'Each Sorting Facility boosts Delivery Trucks by 0.2%' },
  { source: 'farm', target: 'mine', bonusPerUnit: 0.001, description: 'Each Distribution Center boosts Cargo Planes by 0.1%' },
  { source: 'mine', target: 'factory', bonusPerUnit: 0.001, description: 'Each Cargo Plane boosts Cargo Ships by 0.1%' },
  { source: 'factory', target: 'mine', bonusPerUnit: 0.001, description: 'Each Cargo Ship boosts Cargo Planes by 0.1%' },
  { source: 'bank', target: 'farm', bonusPerUnit: 0.002, description: 'Each FedEx Store boosts Distribution Centers by 0.2%' },
  { source: 'warehouse', target: 'bank', bonusPerUnit: 0.001, description: 'Each Mega Warehouse boosts FedEx Stores by 0.1%' },
  { source: 'airport', target: 'spaceport', bonusPerUnit: 0.003, description: 'Each Airport boosts Space Delivery Ports by 0.3%' },
  { source: 'spaceport', target: 'satellite', bonusPerUnit: 0.005, description: 'Each Space Port boosts Satellite Networks by 0.5%' },
  { source: 'satellite', target: 'timemachine', bonusPerUnit: 0.003, description: 'Each Satellite boosts Time Machines by 0.3%' },
  { source: 'timemachine', target: 'multiverse', bonusPerUnit: 0.005, description: 'Each Time Machine boosts Multiverse Portals by 0.5%' },
  { source: 'ceo', target: 'ceo', bonusPerUnit: 0.01, description: 'Each CEO boosts all CEOs by 1% (synergy stacking)' },
  { source: 'multiverse', target: 'cursor', bonusPerUnit: 0.01, description: 'Each Multiverse Portal boosts Delivery Trucks by 1%' },
];
