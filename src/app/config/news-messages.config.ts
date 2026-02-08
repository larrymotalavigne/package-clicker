export interface NewsMessage {
  text: string;
  condition?: (ctx: NewsContext) => boolean;
}

export interface NewsContext {
  packages: number;
  pps: number;
  buildings: Record<string, number>;
  totalClicks: number;
}

const GENERIC: NewsMessage[] = [
  { text: 'Breaking: Local package enthusiast clicks box for the millionth time.' },
  { text: 'Tip: Buy buildings to generate passive income!' },
  { text: 'Did you know? Upgrades can multiply your production significantly.' },
  { text: 'Scientists baffled by exponential growth in package deliveries.' },
  { text: 'Package stocks hit all-time high following mysterious surge in demand.' },
  { text: 'New study finds clicking packages is oddly satisfying.' },
  { text: 'Weather forecast: 100% chance of packages, with scattered upgrades.' },
  { text: 'Breaking: Area man discovers infinite packages, economists confused.' },
  { text: 'Top 10 reasons why packages are the currency of the future.' },
  { text: 'Package CEO quoted: "We need more packages."' },
  { text: 'Local warehouse reports mysterious overnight expansion.' },
  { text: 'Shipping lanes report record traffic levels.' },
  { text: 'Experts agree: there is no such thing as too many packages.' },
  { text: 'Survey says: 9 out of 10 people want more packages.' },
  { text: '"Just one more click," says person on their 10,000th click.' },
  { text: 'Breaking: Cardboard shortage feared as package production soars.' },
  { text: 'Motivational quote of the day: "Every package begins with a single click."' },
  { text: 'Delivery drones report unusual levels of job satisfaction.' },
  { text: 'Fun fact: If all your packages were stacked, they would reach... higher.' },
  { text: 'Package inspectors report: all packages are in perfect condition.' },
  { text: 'The golden age of logistics is upon us.' },
  { text: 'Remember: a watched package never delivers itself. Keep clicking!' },
  { text: 'Package production up 200% following investment in new buildings.' },
  { text: 'Your packages are the envy of logistics companies worldwide.' },
  { text: 'Alert: Golden packages spotted in the area. Stay vigilant!' },
  { text: 'Customer reviews: ⭐⭐⭐⭐⭐ "Best package service ever!"' },
  { text: 'News flash: Package clicker addiction reaches epidemic levels.' },
  { text: 'Today in history: The first package was clicked.' },
  { text: 'Celebrity endorsement: "I only use Package Clicker," says nobody famous.' },
  { text: 'Opinion: Are we making too many packages? No. Next question.' },
];

const BUILDING_SPECIFIC: NewsMessage[] = [
  {
    text: 'Your delivery trucks are humming along nicely.',
    condition: (c) => (c.buildings['cursor'] ?? 0) >= 1,
  },
  {
    text: 'Sorting facilities report peak efficiency!',
    condition: (c) => (c.buildings['grandma'] ?? 0) >= 5,
  },
  {
    text: 'Distribution centers expanding to meet demand.',
    condition: (c) => (c.buildings['farm'] ?? 0) >= 5,
  },
  {
    text: 'Air traffic control reports: "It is all packages up here."',
    condition: (c) => (c.buildings['mine'] ?? 0) >= 1,
  },
  {
    text: 'Cargo ships forming a convoy across the Pacific!',
    condition: (c) => (c.buildings['factory'] ?? 0) >= 1,
  },
  {
    text: 'FedEx stores report lines around the block.',
    condition: (c) => (c.buildings['bank'] ?? 0) >= 5,
  },
  {
    text: 'Your mega warehouses are visible from space.',
    condition: (c) => (c.buildings['warehouse'] ?? 0) >= 10,
  },
  {
    text: 'International airports adding new terminals for package traffic.',
    condition: (c) => (c.buildings['airport'] ?? 0) >= 1,
  },
  {
    text: 'Space delivery ports successfully colonize new asteroid.',
    condition: (c) => (c.buildings['spaceport'] ?? 0) >= 1,
  },
  {
    text: 'CEO quoted: "More packages. Always more packages."',
    condition: (c) => (c.buildings['ceo'] ?? 0) >= 1,
  },
  {
    text: 'Your fleet of 50 trucks dominates the highways.',
    condition: (c) => (c.buildings['cursor'] ?? 0) >= 50,
  },
  {
    text: '100 sorting facilities! The packages flow like a river.',
    condition: (c) => (c.buildings['grandma'] ?? 0) >= 100,
  },
  {
    text: 'Your cargo plane fleet darkens the sky.',
    condition: (c) => (c.buildings['mine'] ?? 0) >= 25,
  },
  {
    text: 'Your spaceports are delivering to neighboring galaxies.',
    condition: (c) => (c.buildings['spaceport'] ?? 0) >= 25,
  },
  {
    text: 'All 200 CEOs agree: packages are the future.',
    condition: (c) => (c.buildings['ceo'] ?? 0) >= 200,
  },
];

const MILESTONE_MESSAGES: NewsMessage[] = [
  {
    text: 'Congratulations! You have earned over a million packages!',
    condition: (c) => c.packages >= 1e6,
  },
  {
    text: 'BILLION packages delivered! You are a logistics legend!',
    condition: (c) => c.packages >= 1e9,
  },
  {
    text: 'A TRILLION packages?! The universe bows to your logistics empire!',
    condition: (c) => c.packages >= 1e12,
  },
  {
    text: 'Your PPS is over 9000!',
    condition: (c) => c.pps >= 9000,
  },
  {
    text: 'Over 10,000 clicks! Your fingers must be tired.',
    condition: (c) => c.totalClicks >= 10000,
  },
];

export const ALL_NEWS_MESSAGES: NewsMessage[] = [
  ...GENERIC,
  ...BUILDING_SPECIFIC,
  ...MILESTONE_MESSAGES,
];
