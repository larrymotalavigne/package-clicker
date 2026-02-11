import { PackageTypeConfig } from '../models/game.models';

export const PACKAGE_TYPES: PackageTypeConfig[] = [
  { id: 'standard', name: 'Standard', icon: '\uD83D\uDCE6', color: '#8B4513', valueMultiplier: 1, weight: 70 },
  { id: 'priority', name: 'Priority', icon: '\uD83D\uDCEE', color: '#1E90FF', valueMultiplier: 1.5, weight: 18 },
  { id: 'express', name: 'Express', icon: '\u26A1', color: '#FF6600', valueMultiplier: 2, weight: 8 },
  { id: 'fragile', name: 'Fragile', icon: '\uD83D\uDD2E', color: '#FF69B4', valueMultiplier: 3, weight: 3 },
  { id: 'legendary', name: 'Legendary', icon: '\uD83D\uDC51', color: '#FFD700', valueMultiplier: 5, weight: 1 },
];
