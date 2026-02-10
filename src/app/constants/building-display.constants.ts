export interface BuildingDisplayInfo {
  name: string;
  description: string;
  icon: string;
}

export const BUILDING_DISPLAY_INFO: Record<string, BuildingDisplayInfo> = {
  cursor: {
    name: 'Delivery Truck',
    description: 'The workhorse of FedEx Ground. POD scan included.',
    icon: '\u{1F69A}'
  },
  grandma: {
    name: 'Sorting Facility',
    description: 'Barcode scanners go beep. Packages go whoosh. Efficiency goes brrr.',
    icon: '\u{1F3ED}'
  },
  farm: {
    name: 'Distribution Center',
    description: 'Large-scale hub. The DEBRIEF system monitors every trip from here.',
    icon: '\u{1F3E2}'
  },
  mine: {
    name: 'Cargo Plane',
    description: 'FedEx Express air fleet. "When it absolutely, positively has to be there overnight."',
    icon: '\u{2708}\u{FE0F}'
  },
  factory: {
    name: 'Cargo Ship',
    description: 'International shipping. Scan code VAN registered. Then we wait.',
    icon: '\u{1F6A2}'
  },
  bank: {
    name: 'FedEx Store',
    description: '"Skip the line privilege." — Every FedEx Store employee, sarcastically.',
    icon: '\u{1F3EA}'
  },
  warehouse: {
    name: 'Mega Warehouse',
    description: 'Visible from space. The Kaamelott Team stores their backups here.',
    icon: '\u{1F3ED}'
  },
  airport: {
    name: 'International Airport',
    description: 'Global express hub. Memphis SuperHub wishes it were this efficient.',
    icon: '\u{1F6EB}'
  },
  spaceport: {
    name: 'Space Delivery Port',
    description: 'Interplanetary delivery. K-API latency: 14 light-minutes. "C\'est pas faux."',
    icon: '\u{1F680}'
  },
  ceo: {
    name: 'Frederic W Smith (CEO)',
    description: 'The man who bet his last $5,000 in Vegas to save FedEx. True story.',
    icon: '\u{1F468}\u{200D}\u{1F4BC}'
  }
};

export function getBuildingDisplayInfo(id: string): BuildingDisplayInfo | undefined {
  return BUILDING_DISPLAY_INFO[id];
}
