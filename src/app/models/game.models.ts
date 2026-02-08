import { BuildingType } from '../types/building-types';

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

export type AchievementType =
  | 'packages'
  | 'clicks'
  | 'pps'
  | 'upgrades'
  | 'golden_clicks'
  | 'prestige'
  | BuildingType;

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  type: AchievementType;
  category?: string;
  hidden?: boolean;
  unlocked?: boolean;
}

export interface UpgradeEffect {
  type:
    | 'building_multiplier'
    | 'click_multiplier'
    | 'global_multiplier'
    | 'click_add_pps_percent';
  buildingType?: BuildingType;
  value: number;
}

export interface UpgradeConfig {
  id: string;
  name: string;
  description: string;
  flavorText: string;
  price: number;
  icon: string;
  effects: UpgradeEffect[];
  requirement: UpgradeRequirement;
}

export interface UpgradeRequirement {
  type: 'building_count' | 'total_packages' | 'upgrade_count' | 'clicks';
  buildingType?: BuildingType;
  value: number;
}

export interface ActiveBuff {
  id: string;
  name: string;
  type: 'frenzy' | 'click_frenzy' | 'lucky';
  multiplier: number;
  remainingMs: number;
  totalMs: number;
}

export interface GoldenPackageEffect {
  type: 'frenzy' | 'click_frenzy' | 'lucky';
  name: string;
  multiplier: number;
  durationMs: number;
}

export interface Wrinkler {
  id: number;
  eaten: number;
  spawnTime: number;
  angle: number;
}

export interface PrestigeState {
  level: number;
  points: number;
  totalEarnedAllTime: number;
  heavenlyUpgrades: string[];
  timesAscended: number;
}

export interface HeavenlyUpgradeConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  effects: UpgradeEffect[];
  requires: string[];
  position: { x: number; y: number };
}

export interface GameSettings {
  particleEffects: boolean;
  shortNumbers: boolean;
  showBuffTimers: boolean;
}

export interface GameState {
  packages: number;
  packagesPerSecond: number;
  packagesPerClick: number;
  buildings: Record<BuildingType, Building>;
  achievements: string[];
  totalPackagesClicked: number;
  totalPackagesEarned: number;
  purchasedUpgrades: string[];
  prestige: PrestigeState;
  goldenPackageClicks: number;
  wrinklers: Wrinkler[];
  settings: GameSettings;
  totalBuildingsEver: number;
  totalPlayTime: number;
  lastTickTime: number;
  activeBuffs: ActiveBuff[];
}
