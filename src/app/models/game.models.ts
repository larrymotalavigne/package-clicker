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
  | 'events'
  | 'challenges'
  | 'express_points'
  | 'lore'
  | 'contracts'
  | 'daily'
  | 'stocks'
  | 'research'
  | 'fleet'
  | 'stamps'
  | 'employees'
  | 'kingdom'
  | 'automation'
  | 'secret'
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
    | 'click_add_pps_percent'
    | 'building_cost_reduction'
    | 'golden_frequency'
    | 'express_point_mult'
    | 'synergy_multiplier'
    | 'offline_mult';
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
  currency?: 'packages' | 'express_points';
}

export interface UpgradeRequirement {
  type: 'building_count' | 'total_packages' | 'upgrade_count' | 'clicks' | 'express_points' | 'challenge_count';
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
  corporateLevel: number;
  corporatePoints: number;
  corporateUpgrades: string[];
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
  soundEnabled: boolean;
  theme: 'dark' | 'light';
}

export interface EventEffect {
  type:
    | 'production_mult'
    | 'click_mult'
    | 'building_discount'
    | 'instant_packages'
    | 'lose_packages'
    | 'building_boost'
    | 'express_points'
    | 'player_choice';
  value: number;
  buildingType?: string;
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'positive' | 'negative' | 'neutral';
  effect: EventEffect;
  durationMs: number;
  choices?: EventChoice[];
  seasonal?: string;
}

export interface EventChoice {
  label: string;
  effect: EventEffect;
  durationMs: number;
}

export interface ActiveEvent {
  id: string;
  name: string;
  icon: string;
  type: 'positive' | 'negative' | 'neutral';
  effect: EventEffect;
  remainingMs: number;
  totalMs: number;
}

// Building synergies
export interface BuildingSynergy {
  source: BuildingType;
  target: BuildingType;
  bonusPerUnit: number;
  description: string;
}

// Rare loot
export type LootRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface RareLoot {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: LootRarity;
  effect: UpgradeEffect;
  obtainedAt: number;
}

export interface RareLootConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: LootRarity;
  effect: UpgradeEffect;
  dropWeight: number;
}

// Challenges
export interface ChallengeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'speed_click' | 'no_click' | 'building_rush' | 'golden_hunt' | 'endurance';
  durationMs: number;
  target: number;
  reward: ChallengeReward;
}

export interface ChallengeReward {
  expressPoints: number;
  lootId?: string;
  multiplierBonus?: number;
}

export interface ActiveChallenge {
  id: string;
  type: string;
  progress: number;
  target: number;
  remainingMs: number;
  totalMs: number;
}

// Lore / Story
export interface LoreEntry {
  id: string;
  title: string;
  text: string;
  icon: string;
  requirement: LoreRequirement;
}

export interface LoreRequirement {
  type: 'packages' | 'buildings' | 'prestige' | 'clicks' | 'events' | 'challenges' | 'pps';
  value: number;
  buildingType?: BuildingType;
}

// Delivery Contracts
export interface ActiveContract {
  configId: string;
  type: string;
  name: string;
  icon: string;
  description: string;
  target: number;
  progress: number;
  accepted: boolean;
  remainingMs: number;
  totalMs: number;
  reward: { expressPoints: number };
}

// Route Planner
export interface RoutePlannerResult {
  distance: number;
  rating: 'excellent' | 'good' | 'ok';
  buffMultiplier: number;
  buffDurationMs: number;
  expressPointsEarned: number;
}

// Mini-game
export interface MiniGameResult {
  score: number;
  expressPointsEarned: number;
  lootDropped?: RareLoot;
}

// Seasonal event
export interface SeasonalTheme {
  id: string;
  name: string;
  months: number[];
  icon: string;
  productionBonus: number;
  specialEvent?: GameEvent;
}

// Daily Login Rewards
export interface DailyRewardConfig {
  day: number;
  name: string;
  icon: string;
  reward: { type: 'ep' | 'packages' | 'buff'; value: number };
}

// Package Types
export interface PackageTypeConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  valueMultiplier: number;
  weight: number;
}

// Stock Market
export interface StockPrice {
  buildingId: string;
  currentPrice: number;
  previousPrice: number;
  history: number[];
  momentum: number;
}

// Research Tree
export interface ResearchNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  branch: 'logistics' | 'engineering' | 'finance' | 'innovation';
  cost: { ep: number; timeMs: number };
  effects: UpgradeEffect[];
  requires: string[];
  position: { x: number; y: number };
}

export interface ActiveResearch {
  nodeId: string;
  remainingMs: number;
  totalMs: number;
}

// Fleet Management
export interface FleetRoute {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: { buildingType: string; count: number }[];
  bonusMultiplier: number;
}

// Employee System
export type EmployeeType =
  | 'clicker'
  | 'sorter'
  | 'manager'
  | 'accountant'
  | 'scout'
  | 'trainer';

export interface Employee {
  id: string;
  type: EmployeeType;
  name: string;
  level: number;
  xp: number;
  assignment: string | null;
}

export interface EmployeeConfig {
  type: EmployeeType;
  name: string;
  icon: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
  effects: { type: string; valuePerLevel: number }[];
}

// Idle Kingdom
export interface KingdomCity {
  id: string;
  name: string;
  level: number;
  epPerMinute: number;
  unlocked: boolean;
}

export interface KingdomState {
  cities: KingdomCity[];
  totalEpGenerated: number;
}

// Leaderboard
export interface LeaderboardEntry {
  name: string;
  score: number;
  rank: number;
  isPlayer: boolean;
}

// Weather
export type WeatherType =
  | 'clear'
  | 'cloudy'
  | 'rainy'
  | 'storm'
  | 'foggy'
  | 'snow';

// Great Delay
export type GreatDelayStage = 0 | 1 | 2 | 3;

// Automation
export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  icon: string;
  epCost: number;
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
  activeEvents: ActiveEvent[];
  totalEventsExperienced: number;
  // New fields
  expressPoints: number;
  totalExpressPointsEarned: number;
  rareLoot: RareLoot[];
  activeChallenge: ActiveChallenge | null;
  completedChallenges: string[];
  loreUnlocked: string[];
  activeContracts: ActiveContract[];
  completedContractIds: string[];
  totalContractsCompleted: number;
  lastSaveTime: number;
  easterEggs: EasterEggsState;
  // Phase 1: Small features
  dailyStreak: number;
  lastLoginDate: string;
  totalDaysPlayed: number;
  packageTypeCounts: Record<string, number>;
  autoBuyUnlocked: boolean;
  autoBuyEnabled: boolean;
  autoBuyInterval: number;
  // Phase 2: Medium features
  stockPortfolio: Record<string, number>;
  stockProfitTotal: number;
  completedResearch: string[];
  activeResearch: ActiveResearch | null;
  assignedRoutes: string[];
  priorityStamps: number;
  stampProgress: number;
  buildingLevels: Record<string, number>;
  employees: Employee[];
  totalEmployeesHired: number;
  // Phase 3: Large features
  greatDelayStage: GreatDelayStage;
  greatDelayPledged: boolean;
  kingdom: KingdomState;
  leaderboardSeed: number;
  seasonHighScore: number;
  unlockedAutomation: string[];
  enabledAutomation: string[];
}

export interface EasterEggsState {
  konamiUsed: boolean;
  rapidClickTimestamps: number[];
  routeExcellent?: boolean;
}
