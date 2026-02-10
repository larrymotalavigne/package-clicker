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
];
