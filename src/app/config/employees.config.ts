import { EmployeeConfig } from '../models/game.models';

export const EMPLOYEE_CONFIGS: EmployeeConfig[] = [
  {
    type: 'clicker',
    name: 'Auto-Clicker',
    icon: '\uD83D\uDC46',
    baseCost: 50,
    costMultiplier: 2.5,
    maxLevel: 10,
    effects: [{ type: 'auto_click', valuePerLevel: 1 }],
  },
  {
    type: 'sorter',
    name: 'Package Sorter',
    icon: '\uD83D\uDCE6',
    baseCost: 75,
    costMultiplier: 2.5,
    maxLevel: 10,
    effects: [{ type: 'pps_bonus', valuePerLevel: 0.05 }],
  },
  {
    type: 'manager',
    name: 'Floor Manager',
    icon: '\uD83D\uDC54',
    baseCost: 100,
    costMultiplier: 2.5,
    maxLevel: 10,
    effects: [{ type: 'building_bonus', valuePerLevel: 0.1 }],
  },
  {
    type: 'accountant',
    name: 'Accountant',
    icon: '\uD83D\uDCB0',
    baseCost: 120,
    costMultiplier: 2.5,
    maxLevel: 10,
    effects: [{ type: 'ep_bonus', valuePerLevel: 0.05 }],
  },
  {
    type: 'scout',
    name: 'Package Scout',
    icon: '\uD83D\uDD0D',
    baseCost: 150,
    costMultiplier: 2.5,
    maxLevel: 10,
    effects: [{ type: 'golden_freq', valuePerLevel: 0.05 }],
  },
  {
    type: 'trainer',
    name: 'Trainer',
    icon: '\uD83C\uDFC5',
    baseCost: 200,
    costMultiplier: 2.5,
    maxLevel: 10,
    effects: [{ type: 'xp_bonus', valuePerLevel: 0.1 }],
  },
];

export const EMPLOYEE_NAMES: string[] = [
  'Alex', 'Jordan', 'Riley', 'Morgan', 'Casey',
  'Quinn', 'Avery', 'Charlie', 'Dakota', 'Emerson',
  'Finley', 'Hayden', 'Jamie', 'Kai', 'Lane',
  'Parker', 'Reese', 'Sage', 'Taylor', 'Wren',
];
