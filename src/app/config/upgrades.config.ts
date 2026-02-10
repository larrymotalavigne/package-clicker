import { UpgradeConfig } from '../models/game.models';
import { BuildingType } from '../types/building-types';

const BUILDING_META: {
  type: BuildingType;
  name: string;
  tiers: { count: number; price: number; name: string; flavor: string }[];
}[] = [
  {
    type: 'cursor',
    name: 'Delivery Truck',
    tiers: [
      { count: 1, price: 100, name: 'Reinforced Tires', flavor: 'Built to last the extra mile.' },
      { count: 5, price: 500, name: 'GPS Navigation', flavor: 'Never lost, always delivering. Unlike that one DEX 07.' },
      { count: 25, price: 10000, name: 'Turbo Engine', flavor: 'Faster than FedEx Priority Overnight.' },
      { count: 50, price: 500000, name: 'Fleet Automation', flavor: 'They drive themselves now. DEBRIEF still flags them.' },
      { count: 100, price: 50000000, name: 'Quantum Trucks', flavor: 'Delivers before you order. POD pre-scanned.' },
    ],
  },
  {
    type: 'grandma',
    name: 'Sorting Facility',
    tiers: [
      { count: 1, price: 1000, name: 'Conveyor Belts', flavor: 'Packages flow like rivers.' },
      { count: 5, price: 5000, name: 'Barcode Scanners', flavor: 'Beep. Beep. VAN scan registered. Efficiency.' },
      { count: 25, price: 50000, name: 'Robotic Arms', flavor: 'Sorting at light speed.' },
      { count: 50, price: 5000000, name: 'AI Sorting', flavor: 'The machine knows where it goes.' },
      { count: 100, price: 500000000, name: 'Quantum Sorter', flavor: 'Sorted in all timelines.' },
    ],
  },
  {
    type: 'farm',
    name: 'Distribution Center',
    tiers: [
      { count: 1, price: 11000, name: 'Loading Docks', flavor: 'More docks, more throughput.' },
      { count: 5, price: 55000, name: 'Forklift Fleet', flavor: 'Lifting spirits and packages.' },
      { count: 25, price: 550000, name: 'Automated Shelving', flavor: 'Everything in its right place.' },
      { count: 50, price: 55000000, name: 'Drone Delivery', flavor: 'The sky is full of packages.' },
      { count: 100, price: 5500000000, name: 'Teleport Pads', flavor: 'From A to B, instantly.' },
    ],
  },
  {
    type: 'mine',
    name: 'Cargo Plane',
    tiers: [
      { count: 1, price: 120000, name: 'Extra Fuel Tanks', flavor: 'Going the extra distance.' },
      { count: 5, price: 600000, name: 'Cargo Hold Upgrade', flavor: 'Double the capacity.' },
      { count: 25, price: 6000000, name: 'Supersonic Jets', flavor: 'Breaking the sound barrier.' },
      { count: 50, price: 600000000, name: 'Stealth Delivery', flavor: 'You never see them coming.' },
      { count: 100, price: 60000000000, name: 'Space Planes', flavor: 'Orbit express delivery.' },
    ],
  },
  {
    type: 'factory',
    name: 'Cargo Ship',
    tiers: [
      { count: 1, price: 1300000, name: 'Bigger Hulls', flavor: 'More room for boxes.' },
      { count: 5, price: 6500000, name: 'Container Stacking', flavor: 'Higher and higher they go.' },
      { count: 25, price: 65000000, name: 'Nuclear Engine', flavor: 'Never needs to refuel.' },
      { count: 50, price: 6500000000, name: 'Submarine Route', flavor: 'Underwater express lane.' },
      { count: 100, price: 650000000000, name: 'Leviathan Class', flavor: 'A ship the size of a city.' },
    ],
  },
  {
    type: 'bank',
    name: 'FedEx Store',
    tiers: [
      { count: 1, price: 14000000, name: 'Customer Loyalty', flavor: 'They keep coming back.' },
      { count: 5, price: 70000000, name: 'Express Counter', flavor: 'Skip the line privilege.' },
      { count: 25, price: 700000000, name: 'Franchise Model', flavor: 'A store on every corner.' },
      { count: 50, price: 70000000000, name: 'Global Chain', flavor: 'From Tokyo to Toronto.' },
      { count: 100, price: 7000000000000, name: 'Dimensional Stores', flavor: 'Open in every universe.' },
    ],
  },
  {
    type: 'warehouse',
    name: 'Mega Warehouse',
    tiers: [
      { count: 1, price: 200000000, name: 'Climate Control', flavor: 'Perfect package conditions.' },
      { count: 5, price: 1000000000, name: 'Robot Workers', flavor: 'They never take breaks.' },
      { count: 25, price: 10000000000, name: 'Underground Vaults', flavor: 'Miles of storage below.' },
      { count: 50, price: 1000000000000, name: 'Floating Warehouses', flavor: 'Storage in the sky.' },
      { count: 100, price: 100000000000000, name: 'Pocket Dimension', flavor: 'Infinite storage, zero space.' },
    ],
  },
  {
    type: 'airport',
    name: 'International Airport',
    tiers: [
      { count: 1, price: 3300000000, name: 'Extra Runways', flavor: 'More flights, more packages.' },
      { count: 5, price: 16500000000, name: 'Hub Status', flavor: 'Memphis SuperHub status achieved. Fred Smith approves.' },
      { count: 25, price: 165000000000, name: 'Space Elevator', flavor: 'Why fly when you can ride?' },
      { count: 50, price: 16500000000000, name: 'Orbital Platform', flavor: 'Above the clouds.' },
      { count: 100, price: 1650000000000000, name: 'Warp Gate', flavor: 'Anywhere in an instant.' },
    ],
  },
  {
    type: 'spaceport',
    name: 'Space Delivery Port',
    tiers: [
      { count: 1, price: 51000000000, name: 'Better Rockets', flavor: 'Higher, faster, stronger.' },
      { count: 5, price: 255000000000, name: 'Mars Colony Route', flavor: 'Next stop: the red planet.' },
      { count: 25, price: 2550000000000, name: 'Hyperspace Drive', flavor: 'Punch it!' },
      { count: 50, price: 255000000000000, name: 'Dyson Sphere', flavor: 'Powered by the sun itself.' },
      { count: 100, price: 25500000000000000, name: 'Universal Post', flavor: 'Delivering across galaxies.' },
    ],
  },
  {
    type: 'ceo',
    name: 'CEO',
    tiers: [
      { count: 1, price: 750000000000, name: 'Executive Suite', flavor: 'Corner office with a view.' },
      { count: 5, price: 3750000000000, name: 'Board of Directors', flavor: 'Synergy at the highest level.' },
      { count: 25, price: 37500000000000, name: 'World Domination', flavor: 'Every company is now FedEx. C\'est pas faux.' },
      { count: 50, price: 3750000000000000, name: 'Time Travel Inc.', flavor: 'Delivered yesterday. K-API response time: -24 hours.' },
      { count: 100, price: 375000000000000000, name: 'Omniscient CEO', flavor: 'Knows every package. Every scan. Every non-compliant trip.' },
    ],
  },
  {
    type: 'satellite',
    name: 'Satellite Network',
    tiers: [
      { count: 1, price: 10000000000000, name: 'Low-Earth Orbit', flavor: 'Tracking packages from space. DEBRIEF goes orbital.' },
      { count: 5, price: 50000000000000, name: 'GPS Constellation', flavor: '24 satellites, 24/7 coverage. No blind spots.' },
      { count: 25, price: 500000000000000, name: 'Quantum Uplink', flavor: 'Data moves faster than light. Physicists concerned.' },
      { count: 50, price: 50000000000000000, name: 'Dyson Swarm', flavor: 'A million satellites. The sun wears a belt of tracking beacons.' },
      { count: 100, price: 5e18, name: 'Omniscient Array', flavor: 'Sees every package in every timeline.' },
    ],
  },
  {
    type: 'timemachine',
    name: 'Time Machine',
    tiers: [
      { count: 1, price: 140000000000000, name: 'Temporal Beacon', flavor: 'Yesterday\'s deliveries, today!' },
      { count: 5, price: 700000000000000, name: 'Paradox Engine', flavor: 'Delivering to yourself from the future. K-API: confused.' },
      { count: 25, price: 7000000000000000, name: 'Causal Loop', flavor: 'The package was always there. It just needed you to click.' },
      { count: 50, price: 700000000000000000, name: 'Eternity Drive', flavor: 'All of time is just one long delivery route.' },
      { count: 100, price: 7e19, name: 'Omega Point', flavor: 'Past, present, future — all packages delivered simultaneously.' },
    ],
  },
  {
    type: 'multiverse',
    name: 'Multiverse Portal',
    tiers: [
      { count: 1, price: 2000000000000000, name: 'Rift Stabilizer', flavor: 'One portal, infinite deliveries.' },
      { count: 5, price: 10000000000000000, name: 'Dimensional Hub', flavor: 'FedEx operates in 47 parallel realities. "On en a gros!"' },
      { count: 25, price: 1e17, name: 'Reality Mesh', flavor: 'Every universe gets next-day delivery.' },
      { count: 50, price: 1e19, name: 'Cosmic Weave', flavor: 'The fabric of spacetime IS the delivery network.' },
      { count: 100, price: 1e21, name: 'Absolute Infinity', flavor: 'There is nothing but packages. There was never anything else.' },
    ],
  },
];

const TIER_MULTIPLIERS = [2, 2, 2, 2, 2];

function buildBuildingUpgrades(): UpgradeConfig[] {
  const upgrades: UpgradeConfig[] = [];

  for (const building of BUILDING_META) {
    for (let i = 0; i < building.tiers.length; i++) {
      const tier = building.tiers[i];
      upgrades.push({
        id: `${building.type}_tier${i + 1}`,
        name: tier.name,
        description: `${building.name}s are twice as efficient`,
        flavorText: tier.flavor,
        price: tier.price,
        icon: '⬆',
        effects: [
          {
            type: 'building_multiplier',
            buildingType: building.type,
            value: TIER_MULTIPLIERS[i],
          },
        ],
        requirement: {
          type: 'building_count',
          buildingType: building.type,
          value: tier.count,
        },
      });
    }
  }

  return upgrades;
}

const CLICK_UPGRADES: UpgradeConfig[] = [
  {
    id: 'click_1',
    name: 'Reinforced Clicking',
    description: 'Clicking is twice as powerful',
    flavorText: 'Click harder, ship faster.',
    price: 100,
    icon: '👆',
    effects: [{ type: 'click_multiplier', value: 2 }],
    requirement: { type: 'clicks', value: 100 },
  },
  {
    id: 'click_2',
    name: 'Ambidextrous',
    description: 'Clicking is twice as powerful',
    flavorText: 'Two hands, double the power.',
    price: 5000,
    icon: '👆',
    effects: [{ type: 'click_multiplier', value: 2 }],
    requirement: { type: 'clicks', value: 500 },
  },
  {
    id: 'click_3',
    name: 'Thousand Fingers',
    description: 'Each building adds 0.1% of PPS to clicks',
    flavorText: 'All hands on deck.',
    price: 100000,
    icon: '👆',
    effects: [{ type: 'click_add_pps_percent', value: 0.1 }],
    requirement: { type: 'clicks', value: 5000 },
  },
  {
    id: 'click_4',
    name: 'Power Click',
    description: 'Clicking is twice as powerful',
    flavorText: 'One click to rule them all.',
    price: 5000000,
    icon: '👆',
    effects: [{ type: 'click_multiplier', value: 2 }],
    requirement: { type: 'clicks', value: 25000 },
  },
  {
    id: 'click_5',
    name: 'Ultimate Click',
    description: 'Clicking is twice as powerful',
    flavorText: 'The click heard around the world.',
    price: 500000000,
    icon: '👆',
    effects: [{ type: 'click_multiplier', value: 2 }],
    requirement: { type: 'clicks', value: 100000 },
  },
];

const GLOBAL_UPGRADES: UpgradeConfig[] = [
  {
    id: 'global_1',
    name: 'Logistics Network',
    description: 'All production doubled',
    flavorText: 'Everything is connected.',
    price: 100000,
    icon: '🌐',
    effects: [{ type: 'global_multiplier', value: 2 }],
    requirement: { type: 'total_packages', value: 100000 },
  },
  {
    id: 'global_2',
    name: 'Supply Chain Mastery',
    description: 'All production doubled',
    flavorText: 'From origin to destination, perfected.',
    price: 10000000,
    icon: '🌐',
    effects: [{ type: 'global_multiplier', value: 2 }],
    requirement: { type: 'total_packages', value: 10000000 },
  },
  {
    id: 'global_3',
    name: 'World Domination',
    description: 'All production doubled',
    flavorText: 'Every corner of the globe.',
    price: 1000000000,
    icon: '🌐',
    effects: [{ type: 'global_multiplier', value: 2 }],
    requirement: { type: 'total_packages', value: 1000000000 },
  },
];

const COST_REDUCTION_UPGRADES: UpgradeConfig[] = [
  {
    id: 'cost_1',
    name: 'Bulk Ordering',
    description: 'All buildings cost 5% less',
    flavorText: 'FedEx corporate rate unlocked.',
    price: 50000,
    icon: '\u{1F3F7}\u{FE0F}',
    effects: [{ type: 'building_cost_reduction', value: 0.95 }],
    requirement: { type: 'total_packages', value: 50000 },
  },
  {
    id: 'cost_2',
    name: 'Supply Chain Deal',
    description: 'All buildings cost 5% less',
    flavorText: 'Negotiated by the Kaamelott Team themselves.',
    price: 5000000,
    icon: '\u{1F3F7}\u{FE0F}',
    effects: [{ type: 'building_cost_reduction', value: 0.95 }],
    requirement: { type: 'total_packages', value: 5000000 },
  },
  {
    id: 'cost_3',
    name: 'Government Contract',
    description: 'All buildings cost 10% less',
    flavorText: 'Fred Smith called in a favor.',
    price: 500000000,
    icon: '\u{1F3F7}\u{FE0F}',
    effects: [{ type: 'building_cost_reduction', value: 0.90 }],
    requirement: { type: 'total_packages', value: 500000000 },
  },
];

const GOLDEN_UPGRADES: UpgradeConfig[] = [
  {
    id: 'golden_freq_1',
    name: 'Golden Radar',
    description: 'Golden packages appear 20% more often',
    flavorText: 'Tracking the untraceable.',
    price: 777777,
    icon: '\u{1F4E1}',
    effects: [{ type: 'golden_frequency', value: 0.8 }],
    requirement: { type: 'total_packages', value: 500000 },
  },
  {
    id: 'golden_freq_2',
    name: 'Golden Magnet',
    description: 'Golden packages appear 30% more often',
    flavorText: 'They are attracted to your logistics empire.',
    price: 77777777,
    icon: '\u{1F9F2}',
    effects: [{ type: 'golden_frequency', value: 0.7 }],
    requirement: { type: 'total_packages', value: 50000000 },
  },
];

const SYNERGY_UPGRADES: UpgradeConfig[] = [
  {
    id: 'syn_truck_sort',
    name: 'Integrated Logistics',
    description: 'Trucks and Sorting Facilities boost each other by 5%',
    flavorText: 'Better together. Like scan and POD.',
    price: 200000,
    icon: '\u{1F91D}',
    effects: [{ type: 'synergy_multiplier', value: 1.05 }],
    requirement: { type: 'building_count', buildingType: 'grandma', value: 10 },
  },
  {
    id: 'syn_plane_ship',
    name: 'Air-Sea Network',
    description: 'Cargo Planes and Ships boost each other by 5%',
    flavorText: 'The Memphis-Shanghai express.',
    price: 50000000,
    icon: '\u{1F91D}',
    effects: [{ type: 'synergy_multiplier', value: 1.05 }],
    requirement: { type: 'building_count', buildingType: 'factory', value: 10 },
  },
  {
    id: 'syn_space_sat',
    name: 'Orbital Delivery Grid',
    description: 'Spaceports and Satellites boost each other by 10%',
    flavorText: 'Space logistics perfected.',
    price: 50000000000000,
    icon: '\u{1F91D}',
    effects: [{ type: 'synergy_multiplier', value: 1.1 }],
    requirement: { type: 'building_count', buildingType: 'satellite', value: 5 },
  },
];

const OFFLINE_UPGRADES: UpgradeConfig[] = [
  {
    id: 'offline_1',
    name: 'Night Shift',
    description: 'Earn 25% of PPS while offline',
    flavorText: 'The packages never sleep.',
    price: 1000000,
    icon: '\u{1F319}',
    effects: [{ type: 'offline_mult', value: 0.25 }],
    requirement: { type: 'total_packages', value: 1000000 },
  },
  {
    id: 'offline_2',
    name: 'Automation Suite',
    description: 'Earn 50% of PPS while offline',
    flavorText: 'Full autopilot. DEBRIEF still logs everything.',
    price: 100000000,
    icon: '\u{1F319}',
    effects: [{ type: 'offline_mult', value: 0.50 }],
    requirement: { type: 'total_packages', value: 100000000 },
  },
  {
    id: 'offline_3',
    name: 'Perpetual Engine',
    description: 'Earn 100% of PPS while offline',
    flavorText: 'Why even click? (Please keep clicking.)',
    price: 10000000000,
    icon: '\u{1F319}',
    effects: [{ type: 'offline_mult', value: 1.0 }],
    requirement: { type: 'total_packages', value: 10000000000 },
  },
];

const EXPRESS_POINT_UPGRADES: UpgradeConfig[] = [
  {
    id: 'ep_boost_1',
    name: 'Priority Handling',
    description: 'Earn 2x Express Points from all sources',
    flavorText: 'Priority mail gets priority rewards.',
    price: 50,
    icon: '\u{1F48E}',
    effects: [{ type: 'express_point_mult', value: 2 }],
    requirement: { type: 'express_points', value: 25 },
    currency: 'express_points',
  },
  {
    id: 'ep_boost_2',
    name: 'VIP Program',
    description: 'Earn 3x Express Points from all sources',
    flavorText: 'Platinum status achieved.',
    price: 200,
    icon: '\u{1F48E}',
    effects: [{ type: 'express_point_mult', value: 3 }],
    requirement: { type: 'express_points', value: 100 },
    currency: 'express_points',
  },
];

export const UPGRADE_DEFINITIONS: UpgradeConfig[] = [
  ...buildBuildingUpgrades(),
  ...CLICK_UPGRADES,
  ...GLOBAL_UPGRADES,
  ...COST_REDUCTION_UPGRADES,
  ...GOLDEN_UPGRADES,
  ...SYNERGY_UPGRADES,
  ...OFFLINE_UPGRADES,
  ...EXPRESS_POINT_UPGRADES,
];
