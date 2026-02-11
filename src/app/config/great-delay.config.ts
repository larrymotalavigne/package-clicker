import { GreatDelayStage } from '../models/game.models';

export interface GreatDelayStageConfig {
  stage: GreatDelayStage;
  name: string;
  description: string;
  sortingFacilityThreshold: number;
  wrinklerSpawnMult: number;
  wrinklerDivertPercent: number;
  wrinklerReturnPercent: number;
  tintColor: string;
}

export const GREAT_DELAY_STAGES: GreatDelayStageConfig[] = [
  {
    stage: 0,
    name: 'Normal',
    description: 'All is well in the shipping world.',
    sortingFacilityThreshold: 0,
    wrinklerSpawnMult: 1,
    wrinklerDivertPercent: 0.05,
    wrinklerReturnPercent: 1.1,
    tintColor: '',
  },
  {
    stage: 1,
    name: 'The Slowdown',
    description: 'Packages are taking longer to sort...',
    sortingFacilityThreshold: 50,
    wrinklerSpawnMult: 2,
    wrinklerDivertPercent: 0.05,
    wrinklerReturnPercent: 1.1,
    tintColor: 'rgba(139, 0, 0, 0.05)',
  },
  {
    stage: 2,
    name: 'The Backlog',
    description: 'The sorting facilities are overwhelmed.',
    sortingFacilityThreshold: 100,
    wrinklerSpawnMult: 3,
    wrinklerDivertPercent: 0.08,
    wrinklerReturnPercent: 1.5,
    tintColor: 'rgba(139, 0, 0, 0.1)',
  },
  {
    stage: 3,
    name: 'The Great Delay',
    description: 'Chaos reigns. Packages are lost in the void.',
    sortingFacilityThreshold: 200,
    wrinklerSpawnMult: 5,
    wrinklerDivertPercent: 0.08,
    wrinklerReturnPercent: 1.5,
    tintColor: 'rgba(139, 0, 0, 0.15)',
  },
];

export const GREAT_DELAY_NEWS: string[] = [
  'The sorting facilities hum with an unsettling rhythm...',
  'Workers report strange delays in the package pipeline.',
  'Packages are disappearing into the backlog. Nobody knows where they go.',
  'The conveyor belts move slower. The packages pile higher.',
  'A thick fog of cardboard dust fills the sorting facilities.',
  'Some say the packages sort themselves now. Nobody believes them.',
  'The delay spreads. First one facility, then all of them.',
  'Time itself seems to slow in the warehouses.',
  'The Great Delay is upon us. Embrace the wait.',
  'Ancient shipping manifests speak of a way to restore order...',
];
