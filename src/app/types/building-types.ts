// Dynamic building type system to replace hardcoded string literals

export type BuildingType = 
  | 'cursor'
  | 'grandma'
  | 'farm'
  | 'mine'
  | 'factory'
  | 'bank'
  | 'warehouse'
  | 'airport'
  | 'spaceport'
  | 'ceo';

// Type guard to check if a string is a valid building type
export function isBuildingType(value: string): value is BuildingType {
  const validTypes: readonly string[] = [
    'cursor', 'grandma', 'farm', 'mine', 'factory', 
    'bank', 'warehouse', 'airport', 'spaceport', 'ceo'
  ];
  return validTypes.includes(value);
}

// Get all valid building types
export function getAllBuildingTypes(): readonly BuildingType[] {
  return [
    'cursor', 'grandma', 'farm', 'mine', 'factory',
    'bank', 'warehouse', 'airport', 'spaceport', 'ceo'
  ] as const;
}

// Validate building type with error handling
export function validateBuildingType(type: string): BuildingType {
  if (!isBuildingType(type)) {
    throw new Error(`Invalid building type: ${type}. Valid types are: ${getAllBuildingTypes().join(', ')}`);
  }
  return type;
}