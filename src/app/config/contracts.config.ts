export interface ContractConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'earn_packages' | 'buy_buildings' | 'click_count' | 'reach_pps' | 'golden_clicks';
  target: number;
  durationMs: number;
  reward: { expressPoints: number };
  weight: number;
  minPps?: number;
}

export const CONTRACT_DEFINITIONS: ContractConfig[] = [
  // earn_packages: 4 tiers
  {
    id: 'ep_1k', name: 'Small Batch', description: 'Earn 1,000 packages',
    icon: '\uD83D\uDCE6', type: 'earn_packages', target: 1e3,
    durationMs: 180000, reward: { expressPoints: 5 }, weight: 10,
  },
  {
    id: 'ep_10k', name: 'Bulk Order', description: 'Earn 10,000 packages',
    icon: '\uD83D\uDCE6', type: 'earn_packages', target: 1e4,
    durationMs: 240000, reward: { expressPoints: 10 }, weight: 8, minPps: 10,
  },
  {
    id: 'ep_100k', name: 'Major Shipment', description: 'Earn 100,000 packages',
    icon: '\uD83D\uDCE6', type: 'earn_packages', target: 1e5,
    durationMs: 300000, reward: { expressPoints: 20 }, weight: 5, minPps: 100,
  },
  {
    id: 'ep_1m', name: 'Mega Delivery', description: 'Earn 1,000,000 packages',
    icon: '\uD83D\uDCE6', type: 'earn_packages', target: 1e6,
    durationMs: 300000, reward: { expressPoints: 50 }, weight: 3, minPps: 1000,
  },
  // buy_buildings: 3 tiers
  {
    id: 'bb_3', name: 'Expand Fleet', description: 'Buy 3 buildings',
    icon: '\uD83C\uDFED', type: 'buy_buildings', target: 3,
    durationMs: 180000, reward: { expressPoints: 8 }, weight: 8,
  },
  {
    id: 'bb_10', name: 'Growth Spurt', description: 'Buy 10 buildings',
    icon: '\uD83C\uDFED', type: 'buy_buildings', target: 10,
    durationMs: 300000, reward: { expressPoints: 15 }, weight: 5, minPps: 50,
  },
  {
    id: 'bb_25', name: 'Empire Builder', description: 'Buy 25 buildings',
    icon: '\uD83C\uDFED', type: 'buy_buildings', target: 25,
    durationMs: 300000, reward: { expressPoints: 30 }, weight: 3, minPps: 500,
  },
  // click_count: 3 tiers
  {
    id: 'cc_100', name: 'Quick Clicks', description: 'Click 100 times',
    icon: '\uD83D\uDD98', type: 'click_count', target: 100,
    durationMs: 120000, reward: { expressPoints: 5 }, weight: 9,
  },
  {
    id: 'cc_500', name: 'Click Storm', description: 'Click 500 times',
    icon: '\uD83D\uDD98', type: 'click_count', target: 500,
    durationMs: 180000, reward: { expressPoints: 12 }, weight: 6, minPps: 10,
  },
  {
    id: 'cc_1000', name: 'Click Frenzy', description: 'Click 1,000 times',
    icon: '\uD83D\uDD98', type: 'click_count', target: 1000,
    durationMs: 300000, reward: { expressPoints: 25 }, weight: 3, minPps: 100,
  },
  // reach_pps: 3 tiers
  {
    id: 'rp_100', name: 'Speed Up', description: 'Reach 100 PPS',
    icon: '\u26A1', type: 'reach_pps', target: 100,
    durationMs: 300000, reward: { expressPoints: 10 }, weight: 7, minPps: 10,
  },
  {
    id: 'rp_1k', name: 'Turbo Mode', description: 'Reach 1,000 PPS',
    icon: '\u26A1', type: 'reach_pps', target: 1000,
    durationMs: 300000, reward: { expressPoints: 20 }, weight: 4, minPps: 100,
  },
  {
    id: 'rp_10k', name: 'Warp Speed', description: 'Reach 10,000 PPS',
    icon: '\u26A1', type: 'reach_pps', target: 10000,
    durationMs: 300000, reward: { expressPoints: 40 }, weight: 2, minPps: 1000,
  },
  // golden_clicks: 2 tiers
  {
    id: 'gc_1', name: 'Lucky Find', description: 'Click 1 golden package',
    icon: '\u2B50', type: 'golden_clicks', target: 1,
    durationMs: 600000, reward: { expressPoints: 15 }, weight: 5,
  },
  {
    id: 'gc_3', name: 'Golden Rush', description: 'Click 3 golden packages',
    icon: '\u2B50', type: 'golden_clicks', target: 3,
    durationMs: 900000, reward: { expressPoints: 35 }, weight: 2, minPps: 100,
  },
  // Extra variety contracts
  {
    id: 'ep_5k', name: 'Priority Mail', description: 'Earn 5,000 packages',
    icon: '\uD83D\uDCE6', type: 'earn_packages', target: 5e3,
    durationMs: 180000, reward: { expressPoints: 8 }, weight: 7, minPps: 5,
  },
  {
    id: 'bb_5', name: 'Small Fleet', description: 'Buy 5 buildings',
    icon: '\uD83C\uDFED', type: 'buy_buildings', target: 5,
    durationMs: 240000, reward: { expressPoints: 10 }, weight: 7, minPps: 10,
  },
  {
    id: 'cc_250', name: 'Steady Clicks', description: 'Click 250 times',
    icon: '\uD83D\uDD98', type: 'click_count', target: 250,
    durationMs: 150000, reward: { expressPoints: 8 }, weight: 7,
  },
  {
    id: 'ep_50k', name: 'Express Delivery', description: 'Earn 50,000 packages',
    icon: '\uD83D\uDCE6', type: 'earn_packages', target: 5e4,
    durationMs: 240000, reward: { expressPoints: 15 }, weight: 4, minPps: 50,
  },
  {
    id: 'rp_500', name: 'Quick Ramp', description: 'Reach 500 PPS',
    icon: '\u26A1', type: 'reach_pps', target: 500,
    durationMs: 300000, reward: { expressPoints: 15 }, weight: 5, minPps: 50,
  },
];
