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
  {
    text: 'Your satellite network now has more orbital objects than SpaceX.',
    condition: (c) => (c.buildings['satellite'] ?? 0) >= 10,
  },
  {
    text: 'Time Machines are delivering packages to the past. Historians are confused.',
    condition: (c) => (c.buildings['timemachine'] ?? 0) >= 1,
  },
  {
    text: 'Your Multiverse Portals have made "local delivery" meaningless.',
    condition: (c) => (c.buildings['multiverse'] ?? 0) >= 1,
  },
  {
    text: '50 Time Machines running simultaneously. The timeline is mostly fine.',
    condition: (c) => (c.buildings['timemachine'] ?? 0) >= 50,
  },
  {
    text: 'Breaking: Multiverse logistics company delivers same package to infinite realities.',
    condition: (c) => (c.buildings['multiverse'] ?? 0) >= 10,
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

const EVENT_MESSAGES: NewsMessage[] = [
  {
    text: 'Breaking: Random events now affect production! Stay alert for opportunities.',
    condition: () => true,
  },
  {
    text: 'Package Rush incoming! Production is doubled across all facilities!',
    condition: () => true,
  },
  {
    text: 'Supply chain experts warn: disruptions could increase costs temporarily.',
    condition: () => true,
  },
  {
    text: 'Express Delivery mode activated! Clicks are worth more than ever!',
    condition: () => true,
  },
  {
    text: 'Tax season: Government rebates boosting package counts everywhere.',
    condition: () => true,
  },
  {
    text: 'Market analysts predict shifting demand across building sectors.',
    condition: () => true,
  },
];

const FEDEX_MESSAGES: NewsMessage[] = [
  // FedEx classics
  { text: 'FedEx: When it absolutely, positively has to be clicked overnight.' },
  { text: 'The world on time. Except Tuesdays. Tuesdays are weird.' },
  { text: 'Internal memo: "Please stop marking packages as POD before they are actually delivered."' },
  { text: 'DEBRIEF station agent reports: all trips compliant. For once.' },
  { text: 'Non-compliant trip detected on route 42. Driver claims "the packages clicked themselves."' },
  { text: 'Breaking: Fred Smith seen clicking packages manually. "Old habits," he says.' },
  { text: 'Scan code VAN registered. Package is on the van. The van is on a plane. The plane is in space.' },
  { text: 'FedEx tracking update: Your package is currently in a state of quantum superposition.' },
  { text: 'DEX 07 — Customer not available. Customer was clicking packages and could not be disturbed.' },
  { text: 'Station agent quoted: "I have debriefed 47 trips today. Send help. And packages."' },
  { text: 'FedEx Purple Promise: We will absolutely deliver your packages. Probably. Almost certainly.' },
  { text: 'BREAKING: FedEx driver achieves 100% POD rate. Promoted to CEO on the spot.' },
  { text: 'Supply chain update: The K-API is returning 200 OK. Celebrate while it lasts.' },
  { text: 'IT department confirms: the API is working. "It can be broken or not working but that is fine."' },
  { text: 'Overheard at the sorting facility: "Where the magic really happens!"' },
  { text: 'New hire orientation: "Congrats! You are joining a team of clickers from all over the world!"' },
  { text: 'FedEx Ground, FedEx Express, FedEx Freight... FedEx Clicker. Coming soon.' },
  { text: 'Reminder: Every package has a tracking number. Every click has a purpose.' },
  { text: 'FedEx Europe division reports record throughput. The Kaamelott Team takes full credit.' },
  { text: 'Internal ticket: "K-API response time exceeds 3 seconds." Resolution: "Click faster."' },
  { text: 'DEV environment status: broken. But that is fine.' },
  { text: 'The DEBRIEF system shows 0 non-compliant trips. This is either a miracle or a bug.' },
  // Kaamelott crossovers
  { text: '"C\'est pas faux." — Ancient logistics proverb on package delivery.' },
  { text: '"On en a gros!" — Package warehouse workers, upon seeing the daily shipment volume.' },
  { text: 'The Kaamelott Team sends their regards. And packages. Mostly packages.' },
  { text: 'Legend says the Holy Grail was actually just a really well-packaged delivery.' },
  { text: '"Faut pas respirer la compote, ca fait tousser." — Safety tip from the sorting facility.' },
  { text: 'King Arthur would have delivered the grail faster with a FedEx account.' },
  { text: '"C\'est pas un probleme de logistique, c\'est un probleme de clics!" — Station agent, probably.' },
];

const FEDEX_MILESTONE_MESSAGES: NewsMessage[] = [
  {
    text: 'FedEx HQ calling: You have been promoted from Courier to Senior Package Clicker.',
    condition: (c) => c.packages >= 1e5,
  },
  {
    text: 'Fred Smith sends a memo: "Who is this person clicking all our packages?!"',
    condition: (c) => c.packages >= 1e8,
  },
  {
    text: 'The Kaamelott Team has named a server after you. It crashes daily. It is an honor.',
    condition: (c) => c.packages >= 1e10,
  },
  {
    text: 'DEBRIEF alert: Your click-per-second rate exceeds the API rate limit. Impressive.',
    condition: (c) => c.pps >= 1000,
  },
  {
    text: 'Your delivery trucks outnumber actual FedEx vehicles. Legal is concerned.',
    condition: (c) => (c.buildings['cursor'] ?? 0) >= 100,
  },
  {
    text: 'Your FedEx Store franchise has more locations than Starbucks. Coffee not included.',
    condition: (c) => (c.buildings['bank'] ?? 0) >= 50,
  },
];

export const ALL_NEWS_MESSAGES: NewsMessage[] = [
  ...GENERIC,
  ...BUILDING_SPECIFIC,
  ...MILESTONE_MESSAGES,
  ...EVENT_MESSAGES,
  ...FEDEX_MESSAGES,
  ...FEDEX_MILESTONE_MESSAGES,
];
