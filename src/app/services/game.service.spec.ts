import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { GameState, Achievement } from '../models/game.models';

describe('GameService', () => {
  let service: GameService;
  let mockLocalStorage: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
    
    // Clear localStorage mock before each test
    mockLocalStorage = (window as any).localStorage;
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
  });

  afterEach(() => {
    // Reset game state after each test
    service.resetGame();
  });

  describe('Initial State', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with correct default state', () => {
      const gameState = service.getGameState();
      
      expect(gameState.packages).toBe(0);
      expect(gameState.packagesPerSecond).toBe(0);
      expect(gameState.packagesPerClick).toBe(1);
      expect(gameState.totalPackagesClicked).toBe(0);
      expect(gameState.totalPackagesEarned).toBe(0);
      expect(gameState.achievements).toEqual([]);
    });

    it('should initialize all buildings with zero count', () => {
      const gameState = service.getGameState();
      const buildingTypes = ['cursor', 'grandma', 'farm', 'mine', 'factory', 'bank', 'warehouse', 'airport', 'spaceport', 'ceo'];
      
      buildingTypes.forEach(type => {
        const building = gameState.buildings[type as keyof typeof gameState.buildings];
        expect(building.count).toBe(0);
        expect(building.basePrice).toBeGreaterThan(0);
        expect(building.pps).toBeGreaterThan(0);
      });
    });

    it('should return correct achievement definitions', () => {
      const achievements = service.getAchievements();
      
      expect(achievements).toHaveLength(12);
      expect(achievements.every(achievement => 
        achievement.id && 
        achievement.name && 
        achievement.description && 
        achievement.requirement > 0 && 
        achievement.type
      )).toBe(true);
    });
  });

  describe('Package Clicking', () => {
    it('should increment packages when clicking', () => {
      const initialState = service.getGameState();
      expect(initialState.packages).toBe(0);
      
      service.clickPackage();
      const newState = service.getGameState();
      
      expect(newState.packages).toBe(1);
      expect(newState.totalPackagesClicked).toBe(1);
      expect(newState.totalPackagesEarned).toBe(1);
    });

    it('should increment by packagesPerClick amount', () => {
      // Manually set packagesPerClick to test
      const gameState = service.getGameState();
      gameState.packagesPerClick = 5;
      
      service.clickPackage();
      const newState = service.getGameState();
      
      expect(newState.packages).toBe(5);
      expect(newState.totalPackagesEarned).toBe(5);
    });

    it('should return achievements when earned through clicking', () => {
      const achievements = service.clickPackage();
      
      // Should earn "First Package!" achievement
      expect(achievements).toHaveLength(1);
      expect(achievements[0].id).toBe('first_package');
    });
  });

  describe('Building System', () => {
    it('should calculate correct building prices', () => {
      const cursorPrice = service.getBuildingPrice('cursor');
      expect(cursorPrice).toBe(15); // Base price
      
      const grandmaPrice = service.getBuildingPrice('grandma');
      expect(grandmaPrice).toBe(100); // Base price
    });

    it('should increase building price after purchase', () => {
      // Give enough packages to buy cursor
      for (let i = 0; i < 15; i++) {
        service.clickPackage();
      }
      
      const initialPrice = service.getBuildingPrice('cursor');
      service.buyBuilding('cursor');
      const newPrice = service.getBuildingPrice('cursor');
      
      expect(newPrice).toBe(Math.floor(15 * 1.15)); // 17
      expect(newPrice).toBeGreaterThan(initialPrice);
    });

    it('should not allow buying building without enough packages', () => {
      const initialState = service.getGameState();
      const initialPackages = initialState.packages;
      
      service.buyBuilding('cursor');
      const newState = service.getGameState();
      
      expect(newState.packages).toBe(initialPackages);
      expect(newState.buildings.cursor.count).toBe(0);
    });

    it('should successfully buy building with enough packages', () => {
      // Give enough packages to buy cursor
      for (let i = 0; i < 15; i++) {
        service.clickPackage();
      }
      
      service.buyBuilding('cursor');
      const newState = service.getGameState();
      
      expect(newState.packages).toBe(0); // 15 - 15 = 0
      expect(newState.buildings.cursor.count).toBe(1);
      expect(newState.packagesPerSecond).toBe(1);
    });

    it('should handle invalid building types gracefully', () => {
      for (let i = 0; i < 100; i++) {
        service.clickPackage();
      }
      
      const initialState = service.getGameState();
      service.buyBuilding('invalid_building');
      const newState = service.getGameState();
      
      // State should remain unchanged
      expect(newState.packages).toBe(initialState.packages);
    });
  });

  describe('Packages Per Second Generation', () => {
    it('should generate packages based on buildings owned', () => {
      // Buy a cursor (1 pps)
      for (let i = 0; i < 15; i++) {
        service.clickPackage();
      }
      service.buyBuilding('cursor');
      
      const initialPackages = service.getGameState().packages;
      service.generatePackages();
      const newPackages = service.getGameState().packages;
      
      expect(newPackages).toBeGreaterThan(initialPackages);
      expect(newPackages - initialPackages).toBe(0.1); // 1 pps / 10
    });

    it('should not generate packages when no buildings owned', () => {
      const initialPackages = service.getGameState().packages;
      service.generatePackages();
      const newPackages = service.getGameState().packages;
      
      expect(newPackages).toBe(initialPackages);
    });

    it('should update total packages earned during generation', () => {
      // Buy a cursor
      for (let i = 0; i < 15; i++) {
        service.clickPackage();
      }
      service.buyBuilding('cursor');
      
      const initialEarned = service.getGameState().totalPackagesEarned;
      service.generatePackages();
      const newEarned = service.getGameState().totalPackagesEarned;
      
      expect(newEarned).toBeGreaterThan(initialEarned);
    });
  });

  describe('Achievements', () => {
    it('should unlock package-based achievements', () => {
      service.clickPackage(); // Should unlock first_package
      const achievements = service.getAchievements();
      
      const firstPackage = achievements.find(a => a.id === 'first_package');
      expect(firstPackage?.unlocked).toBe(true);
    });

    it('should unlock building-based achievements', () => {
      // Buy first cursor
      for (let i = 0; i < 15; i++) {
        service.clickPackage();
      }
      service.buyBuilding('cursor');
      
      const achievements = service.getAchievements();
      const firstTruck = achievements.find(a => a.id === 'first_truck');
      expect(firstTruck?.unlocked).toBe(true);
    });

    it('should unlock click-based achievements', () => {
      // Click 100 times
      for (let i = 0; i < 100; i++) {
        service.clickPackage();
      }
      
      const achievements = service.getAchievements();
      const fastClicker = achievements.find(a => a.id === 'fast_clicker');
      expect(fastClicker?.unlocked).toBe(true);
    });

    it('should not unlock same achievement twice', () => {
      service.clickPackage();
      const gameState = service.getGameState();
      
      expect(gameState.achievements.filter(id => id === 'first_package')).toHaveLength(1);
    });
  });

  describe('Number Formatting', () => {
    it('should format small numbers without suffix', () => {
      expect(service.formatNumber(0)).toBe('0');
      expect(service.formatNumber(50)).toBe('50');
      expect(service.formatNumber(999)).toBe('999');
    });

    it('should format thousands with K suffix', () => {
      expect(service.formatNumber(1000)).toBe('1.00K');
      expect(service.formatNumber(1500)).toBe('1.50K');
      expect(service.formatNumber(999999)).toBe('999.99K');
    });

    it('should format millions with M suffix', () => {
      expect(service.formatNumber(1000000)).toBe('1.00M');
      expect(service.formatNumber(1500000)).toBe('1.50M');
      expect(service.formatNumber(999999999)).toBe('999.99M');
    });

    it('should format billions with B suffix', () => {
      expect(service.formatNumber(1000000000)).toBe('1.00B');
      expect(service.formatNumber(1500000000)).toBe('1.50B');
      expect(service.formatNumber(999999999999)).toBe('999.99B');
    });

    it('should format trillions with T suffix', () => {
      expect(service.formatNumber(1000000000000)).toBe('1.00T');
      expect(service.formatNumber(1500000000000)).toBe('1.50T');
    });

    it('should handle decimal numbers', () => {
      expect(service.formatNumber(1.5)).toBe('1');
      expect(service.formatNumber(999.9)).toBe('999');
    });
  });

  describe('Game State Persistence', () => {
    it('should save game state to localStorage', () => {
      service.clickPackage();
      service.saveGameState();
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'packageClickerSave',
        expect.stringContaining('packages')
      );
    });

    it('should load game state from localStorage', () => {
      const mockSaveData = {
        packages: 100,
        packagesPerSecond: 5,
        totalPackagesClicked: 50,
        achievements: ['first_package']
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSaveData));
      
      // Create new service to trigger loading
      const newService = new GameService();
      const gameState = newService.getGameState();
      
      expect(gameState.packages).toBe(100);
      expect(gameState.totalPackagesClicked).toBe(50);
      expect(gameState.achievements).toContain('first_package');
    });

    it('should handle invalid save data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid_json');
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const newService = new GameService();
      const gameState = newService.getGameState();
      
      expect(gameState.packages).toBe(0); // Should use default state
      expect(consoleSpy).toHaveBeenCalledWith('Could not load save data');
      
      consoleSpy.mockRestore();
    });

    it('should reset game state correctly', () => {
      // Modify game state
      service.clickPackage();
      for (let i = 0; i < 15; i++) {
        service.clickPackage();
      }
      service.buyBuilding('cursor');
      
      service.resetGame();
      const gameState = service.getGameState();
      
      expect(gameState.packages).toBe(0);
      expect(gameState.packagesPerSecond).toBe(0);
      expect(gameState.totalPackagesClicked).toBe(0);
      expect(gameState.totalPackagesEarned).toBe(0);
      expect(gameState.achievements).toEqual([]);
      expect(gameState.buildings.cursor.count).toBe(0);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('packageClickerSave');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers without errors', () => {
      const largeNumber = Number.MAX_SAFE_INTEGER;
      expect(() => service.formatNumber(largeNumber)).not.toThrow();
    });

    it('should handle negative numbers in formatting', () => {
      expect(service.formatNumber(-100)).toBe('-100');
      expect(service.formatNumber(-1000)).toBe('-1.00K');
    });

    it('should handle zero packages per second correctly', () => {
      service.generatePackages();
      const gameState = service.getGameState();
      expect(gameState.packages).toBe(0);
    });

    it('should maintain state consistency after multiple operations', () => {
      // Perform complex series of operations
      for (let i = 0; i < 50; i++) {
        service.clickPackage();
      }
      
      service.buyBuilding('cursor'); // costs 15
      service.buyBuilding('cursor'); // costs 17
      service.buyBuilding('grandma'); // costs 100, but should fail
      
      const gameState = service.getGameState();
      
      // Should have 50 - 15 - 17 = 18 packages left
      expect(gameState.packages).toBe(18);
      expect(gameState.buildings.cursor.count).toBe(2);
      expect(gameState.buildings.grandma.count).toBe(0);
      expect(gameState.packagesPerSecond).toBe(2); // 2 cursors * 1 pps each
    });
  });
});