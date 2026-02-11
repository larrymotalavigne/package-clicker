import { FleetRoute } from '../models/game.models';

export const FLEET_ROUTES: FleetRoute[] = [
  {
    id: 'local',
    name: 'Local Delivery',
    description: 'City-wide package routes',
    icon: '\uD83D\uDE9A',
    requirement: [{ buildingType: 'cursor', count: 10 }],
    bonusMultiplier: 1.05,
  },
  {
    id: 'regional',
    name: 'Regional Express',
    description: 'State-wide delivery network',
    icon: '\uD83D\uDE8C',
    requirement: [
      { buildingType: 'cursor', count: 25 },
      { buildingType: 'grandma', count: 10 },
    ],
    bonusMultiplier: 1.08,
  },
  {
    id: 'national',
    name: 'National Network',
    description: 'Coast-to-coast logistics',
    icon: '\u2708',
    requirement: [
      { buildingType: 'mine', count: 10 },
      { buildingType: 'farm', count: 15 },
    ],
    bonusMultiplier: 1.12,
  },
  {
    id: 'continental',
    name: 'Continental Freight',
    description: 'Cross-continent shipping lanes',
    icon: '\uD83D\uDEA2',
    requirement: [
      { buildingType: 'factory', count: 10 },
      { buildingType: 'warehouse', count: 5 },
    ],
    bonusMultiplier: 1.18,
  },
  {
    id: 'global',
    name: 'Global Operations',
    description: 'Worldwide delivery infrastructure',
    icon: '\uD83C\uDF10',
    requirement: [
      { buildingType: 'airport', count: 10 },
      { buildingType: 'bank', count: 15 },
    ],
    bonusMultiplier: 1.25,
  },
  {
    id: 'orbital',
    name: 'Orbital Dispatch',
    description: 'Low-earth orbit package drops',
    icon: '\uD83D\uDE80',
    requirement: [
      { buildingType: 'spaceport', count: 10 },
      { buildingType: 'satellite', count: 5 },
    ],
    bonusMultiplier: 1.32,
  },
  {
    id: 'temporal',
    name: 'Temporal Express',
    description: 'Deliveries across timelines',
    icon: '\u231B',
    requirement: [
      { buildingType: 'timemachine', count: 10 },
      { buildingType: 'ceo', count: 15 },
    ],
    bonusMultiplier: 1.42,
  },
  {
    id: 'multiversal',
    name: 'Multiversal Logistics',
    description: 'Infinite reality delivery grid',
    icon: '\uD83C\uDF00',
    requirement: [
      { buildingType: 'multiverse', count: 10 },
      { buildingType: 'timemachine', count: 15 },
    ],
    bonusMultiplier: 1.5,
  },
];
