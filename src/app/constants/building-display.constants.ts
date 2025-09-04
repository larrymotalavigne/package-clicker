export interface BuildingDisplayInfo {
  name: string;
  description: string;
  icon: string;
}

export const BUILDING_DISPLAY_INFO: Record<string, BuildingDisplayInfo> = {
  cursor: {
    name: 'Delivery Truck',
    description: 'Automatically delivers packages',
    icon: '🚚'
  },
  grandma: {
    name: 'Sorting Facility',
    description: 'Sorts and processes packages efficiently',
    icon: '🏭'
  },
  farm: {
    name: 'Distribution Center',
    description: 'Large-scale package distribution hub',
    icon: '🏢'
  },
  mine: {
    name: 'Cargo Plane',
    description: 'Express air delivery service',
    icon: '✈️'
  },
  factory: {
    name: 'Cargo Ship',
    description: 'International shipping operations',
    icon: '🚢'
  },
  bank: {
    name: 'FedEx Store',
    description: 'Retail packaging and shipping services',
    icon: '🏪'
  },
  warehouse: {
    name: 'Mega Warehouse',
    description: 'Massive automated storage and processing facility',
    icon: '🏭'
  },
  airport: {
    name: 'International Airport',
    description: 'Global express delivery hub with cargo jets',
    icon: '🛫'
  },
  spaceport: {
    name: 'Space Delivery Port',
    description: 'Interplanetary package delivery system',
    icon: '🚀'
  },
  ceo: {
    name: 'Frederic W Smith (CEO)',
    description: 'The legendary founder and CEO of FedEx himself!',
    icon: '👨‍💼'
  }
};

export function getBuildingDisplayInfo(id: string): BuildingDisplayInfo | undefined {
  return BUILDING_DISPLAY_INFO[id];
}