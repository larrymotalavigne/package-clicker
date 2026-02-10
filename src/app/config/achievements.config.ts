import { Achievement } from '../models/game.models';

function pkgAch(
  id: string,
  name: string,
  desc: string,
  req: number
): Achievement {
  return {
    id,
    name,
    description: desc,
    requirement: req,
    type: 'packages',
    category: 'Packages',
  };
}

function clickAch(
  id: string,
  name: string,
  desc: string,
  req: number
): Achievement {
  return {
    id,
    name,
    description: desc,
    requirement: req,
    type: 'clicks',
    category: 'Clicks',
  };
}

function bldAch(
  buildingType: string,
  count: number,
  id: string,
  name: string,
  desc: string
): Achievement {
  return {
    id,
    name,
    description: desc,
    requirement: count,
    type: buildingType as Achievement['type'],
    category: 'Buildings',
  };
}

function ppsAch(
  id: string,
  name: string,
  desc: string,
  req: number
): Achievement {
  return {
    id,
    name,
    description: desc,
    requirement: req,
    type: 'pps',
    category: 'Production',
  };
}

function upgradeAch(
  id: string,
  name: string,
  desc: string,
  req: number
): Achievement {
  return {
    id,
    name,
    description: desc,
    requirement: req,
    type: 'upgrades',
    category: 'Upgrades',
  };
}

function goldenAch(
  id: string,
  name: string,
  desc: string,
  req: number
): Achievement {
  return {
    id,
    name,
    description: desc,
    requirement: req,
    type: 'golden_clicks',
    category: 'Golden Packages',
  };
}

function eventAch(
  id: string,
  name: string,
  desc: string,
  req: number
): Achievement {
  return {
    id,
    name,
    description: desc,
    requirement: req,
    type: 'events',
    category: 'Events',
  };
}

function challengeAch(
  id: string,
  name: string,
  desc: string,
  req: number
): Achievement {
  return {
    id,
    name,
    description: desc,
    requirement: req,
    type: 'challenges',
    category: 'Challenges',
  };
}

function expressAch(
  id: string,
  name: string,
  desc: string,
  req: number
): Achievement {
  return {
    id,
    name,
    description: desc,
    requirement: req,
    type: 'express_points',
    category: 'Express Points',
  };
}

function loreAch(
  id: string,
  name: string,
  desc: string,
  req: number
): Achievement {
  return {
    id,
    name,
    description: desc,
    requirement: req,
    type: 'lore',
    category: 'Lore',
  };
}

const BUILDING_NAMES: Record<string, string> = {
  cursor: 'Delivery Truck',
  grandma: 'Sorting Facility',
  farm: 'Distribution Center',
  mine: 'Cargo Plane',
  factory: 'Cargo Ship',
  bank: 'FedEx Store',
  warehouse: 'Mega Warehouse',
  airport: 'International Airport',
  spaceport: 'Space Delivery Port',
  ceo: 'CEO',
  satellite: 'Satellite Network',
  timemachine: 'Time Machine',
  multiverse: 'Multiverse Portal',
};

const BUILDING_IDS = [
  'cursor',
  'grandma',
  'farm',
  'mine',
  'factory',
  'bank',
  'warehouse',
  'airport',
  'spaceport',
  'ceo',
  'satellite',
  'timemachine',
  'multiverse',
];

const MILESTONES = [1, 10, 25, 50, 100, 150, 200];

function buildingAchievements(): Achievement[] {
  const achs: Achievement[] = [];
  for (const bid of BUILDING_IDS) {
    const bname = BUILDING_NAMES[bid];
    for (const m of MILESTONES) {
      const id = `${bid}_${m}`;
      const name =
        m === 1
          ? `First ${bname}`
          : `${m} ${bname}${m > 1 ? 's' : ''}`;
      const desc =
        m === 1
          ? `Buy your first ${bname}`
          : `Own ${m} ${bname}s`;
      achs.push(bldAch(bid, m, id, name, desc));
    }
  }
  return achs;
}

export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  // Package milestones (12)
  pkgAch('pkg_1', 'First Delivery', 'Earn 1 package', 1),
  pkgAch('pkg_100', 'Mail Room', 'Earn 100 packages', 100),
  pkgAch('pkg_1k', 'Package Collector', 'Earn 1,000 packages', 1e3),
  pkgAch('pkg_10k', 'Package Hoarder', 'Earn 10,000 packages', 1e4),
  pkgAch('pkg_100k', 'Logistics Master', 'Earn 100,000 packages', 1e5),
  pkgAch('pkg_1m', 'Million Mile', 'Earn 1,000,000 packages', 1e6),
  pkgAch('pkg_10m', 'Express Empire', 'Earn 10,000,000 packages', 1e7),
  pkgAch('pkg_100m', 'Global Network', 'Earn 100,000,000 packages', 1e8),
  pkgAch('pkg_1b', 'Billion Box', 'Earn 1 billion packages', 1e9),
  pkgAch('pkg_10b', 'Mega Logistics', 'Earn 10 billion packages', 1e10),
  pkgAch('pkg_100b', 'Cosmic Courier', 'Earn 100 billion packages', 1e11),
  pkgAch('pkg_1t', 'Trillion Ton', 'Earn 1 trillion packages', 1e12),

  // Click milestones (6)
  clickAch('click_1', 'First Click', 'Click your first package', 1),
  clickAch('click_100', 'Clicker', 'Click 100 packages', 100),
  clickAch('click_1k', 'Speed Demon', 'Click 1,000 packages', 1e3),
  clickAch('click_10k', 'Carpal Tunnel', 'Click 10,000 packages', 1e4),
  clickAch('click_100k', 'Machine Gun', 'Click 100,000 packages', 1e5),
  clickAch('click_1m', 'Click God', 'Click 1,000,000 packages', 1e6),

  // Building milestones (70)
  ...buildingAchievements(),

  // PPS milestones (7)
  ppsAch('pps_1', 'First Scan', 'Produce 1 package per second', 1),
  ppsAch('pps_10', 'Conveyor Belt', 'Produce 10 packages per second', 10),
  ppsAch('pps_100', 'Memphis Hub', 'Produce 100 pps', 100),
  ppsAch('pps_1k', 'FedEx Ground', 'Produce 1,000 pps', 1e3),
  ppsAch('pps_10k', 'FedEx Express', 'Produce 10,000 pps', 1e4),
  ppsAch('pps_100k', 'Purple Promise', 'Produce 100,000 pps', 1e5),
  ppsAch('pps_1m', 'The World On Time', 'Produce 1,000,000 pps', 1e6),

  // Upgrade milestones (4)
  upgradeAch('upg_1', 'First Upgrade', 'Purchase your first upgrade', 1),
  upgradeAch('upg_10', 'Upgrader', 'Purchase 10 upgrades', 10),
  upgradeAch('upg_25', 'Enhancement', 'Purchase 25 upgrades', 25),
  upgradeAch('upg_50', 'Fully Loaded', 'Purchase 50 upgrades', 50),

  // Golden package clicks (4)
  goldenAch('golden_1', 'Lucky Find', 'Click 1 golden package', 1),
  goldenAch('golden_7', 'Lucky Seven', 'Click 7 golden packages', 7),
  goldenAch('golden_27', 'Golden Touch', 'Click 27 golden packages', 27),
  goldenAch('golden_77', 'Midas', 'Click 77 golden packages', 77),

  // Events (4)
  eventAch('event_1', 'First DEBRIEF', 'Experience your first event', 1),
  eventAch('event_10', 'Station Agent', 'Experience 10 events', 10),
  eventAch('event_25', 'Kaamelott Veteran', 'Experience 25 events', 25),
  eventAch('event_50', 'C\'est Pas Faux', 'Experience 50 events. Not bad.', 50),

  // Challenges (4)
  challengeAch('chal_1', 'First Challenge', 'Complete your first challenge', 1),
  challengeAch('chal_5', 'Challenger', 'Complete 5 challenges', 5),
  challengeAch('chal_10', 'Champion', 'Complete 10 challenges', 10),
  challengeAch('chal_25', 'Legend', 'Complete 25 challenges', 25),

  // Express Points (4)
  expressAch('ep_10', 'Express Novice', 'Earn 10 Express Points', 10),
  expressAch('ep_100', 'Express Pro', 'Earn 100 Express Points', 100),
  expressAch('ep_500', 'Express Elite', 'Earn 500 Express Points', 500),
  expressAch('ep_1000', 'Express Master', 'Earn 1,000 Express Points', 1000),

  // Lore (4)
  loreAch('lore_3', 'Curious Reader', 'Unlock 3 lore entries', 3),
  loreAch('lore_8', 'Historian', 'Unlock 8 lore entries', 8),
  loreAch('lore_12', 'Archivist', 'Unlock 12 lore entries', 12),
  loreAch('lore_16', 'Omniscient', 'Unlock all lore entries', 16),

  // Hidden / Secret (8)
  { id: 'secret_konami', name: 'The Purple Promise', description: 'Enter the ancient code.', requirement: 1, type: 'secret' as Achievement['type'], category: 'Secret', hidden: true },
  { id: 'secret_speed_demon', name: 'Speed Demon', description: 'Click 20 times in 3 seconds.', requirement: 1, type: 'secret' as Achievement['type'], category: 'Secret', hidden: true },
  { id: 'secret_night_owl', name: 'Night Owl', description: 'Play between midnight and 4 AM.', requirement: 1, type: 'secret' as Achievement['type'], category: 'Secret', hidden: true },
  { id: 'secret_full_house', name: 'Full House', description: 'Own at least 1 of every building type.', requirement: 1, type: 'secret' as Achievement['type'], category: 'Secret', hidden: true },
  { id: 'secret_watcher', name: 'The Watcher', description: 'Have 10 wrinklers simultaneously.', requirement: 10, type: 'secret' as Achievement['type'], category: 'Secret', hidden: true },
  { id: 'secret_combo_meal', name: 'Combo Meal', description: 'Have Frenzy and Click Frenzy active at once.', requirement: 1, type: 'secret' as Achievement['type'], category: 'Secret', hidden: true },
  { id: 'secret_long_game', name: 'The Long Game', description: 'Play for 24 cumulative hours.', requirement: 86400000, type: 'secret' as Achievement['type'], category: 'Secret', hidden: true },
  { id: 'secret_completionist', name: 'Completionist', description: 'Unlock all non-hidden achievements.', requirement: 1, type: 'secret' as Achievement['type'], category: 'Secret', hidden: true },
];
