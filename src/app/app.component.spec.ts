import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GameService } from './services/game.service';
import { GameState, Achievement } from './models/game.models';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: any;
  let gameService: jasmine.SpyObj<GameService>;
  let mockGameState: GameState;

  beforeEach(async () => {
    // Create mock game state
    mockGameState = {
      packages: 100,
      packagesPerSecond: 5,
      packagesPerClick: 1,
      buildings: {
        cursor: { count: 2, basePrice: 15, pps: 1 },
        grandma: { count: 1, basePrice: 100, pps: 8 },
        farm: { count: 0, basePrice: 1100, pps: 47 },
        mine: { count: 0, basePrice: 12000, pps: 260 },
        factory: { count: 0, basePrice: 130000, pps: 1400 },
        bank: { count: 0, basePrice: 1400000, pps: 7800 },
        warehouse: { count: 0, basePrice: 20000000, pps: 44000 },
        airport: { count: 0, basePrice: 330000000, pps: 260000 },
        spaceport: { count: 0, basePrice: 5100000000, pps: 1600000 },
        ceo: { count: 0, basePrice: 75000000000, pps: 10000000 }
      },
      achievements: ['first_package', 'first_truck'],
      totalPackagesClicked: 50,
      totalPackagesEarned: 200
    };

    // Create spy for GameService
    const gameServiceSpy = jasmine.createSpyObj('GameService', [
      'getGameState',
      'getAchievements',
      'clickPackage',
      'buyBuilding',
      'generatePackages',
      'formatNumber',
      'getBuildingPrice',
      'saveGameState'
    ]);

    gameServiceSpy.getGameState.and.returnValue(mockGameState);
    gameServiceSpy.getAchievements.and.returnValue([]);
    gameServiceSpy.clickPackage.and.returnValue([]);
    gameServiceSpy.buyBuilding.and.returnValue([]);
    gameServiceSpy.generatePackages.and.returnValue([]);
    gameServiceSpy.formatNumber.and.callFake((num: number) => num.toString());
    gameServiceSpy.getBuildingPrice.and.returnValue(15);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: GameService, useValue: gameServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize game state and achievements on ngOnInit', () => {
      component.ngOnInit();

      expect(gameService.getGameState).toHaveBeenCalled();
      expect(gameService.getAchievements).toHaveBeenCalled();
      expect(component.gameState).toEqual(mockGameState);
    });

    it('should set up auto-generation interval on ngOnInit', (done) => {
      jasmine.clock().install();
      
      component.ngOnInit();
      
      // Fast-forward time to trigger interval
      jasmine.clock().tick(150);
      
      setTimeout(() => {
        expect(gameService.generatePackages).toHaveBeenCalled();
        expect(gameService.getGameState).toHaveBeenCalledTimes(2); // Initial + interval
        jasmine.clock().uninstall();
        done();
      }, 0);
    });

    it('should set up auto-save interval on ngOnInit', (done) => {
      jasmine.clock().install();
      
      component.ngOnInit();
      
      // Fast-forward time to trigger auto-save (30 seconds)
      jasmine.clock().tick(30001);
      
      setTimeout(() => {
        expect(gameService.saveGameState).toHaveBeenCalled();
        jasmine.clock().uninstall();
        done();
      }, 0);
    });
  });

  describe('Component Cleanup', () => {
    it('should clear intervals on ngOnDestroy', () => {
      spyOn(window, 'clearInterval');
      
      component.ngOnInit();
      component.ngOnDestroy();
      
      expect(clearInterval).toHaveBeenCalledTimes(2);
    });

    it('should handle ngOnDestroy when intervals are not set', () => {
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should call GameService when clicking package', () => {
      component.clickPackage();
      
      expect(gameService.clickPackage).toHaveBeenCalled();
      expect(gameService.getGameState).toHaveBeenCalled();
      expect(gameService.getAchievements).toHaveBeenCalled();
    });

    it('should update game state after clicking package', () => {
      const newGameState = { ...mockGameState, packages: 101 };
      gameService.getGameState.and.returnValue(newGameState);
      
      component.clickPackage();
      
      expect(component.gameState).toEqual(newGameState);
    });

    it('should call GameService when buying building', () => {
      component.buyBuilding('cursor');
      
      expect(gameService.buyBuilding).toHaveBeenCalledWith('cursor');
      expect(gameService.getGameState).toHaveBeenCalled();
    });

    it('should update game state after buying building', () => {
      const newGameState = { ...mockGameState, packages: 85 };
      gameService.getGameState.and.returnValue(newGameState);
      
      component.buyBuilding('cursor');
      
      expect(component.gameState).toEqual(newGameState);
    });

    it('should handle buying different building types', () => {
      const buildingTypes = ['cursor', 'grandma', 'farm', 'mine', 'factory', 'bank', 'warehouse', 'airport', 'spaceport', 'ceo'];
      
      buildingTypes.forEach(buildingType => {
        component.buyBuilding(buildingType);
        expect(gameService.buyBuilding).toHaveBeenCalledWith(buildingType);
      });
    });
  });

  describe('Helper Methods', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should format numbers using GameService', () => {
      gameService.formatNumber.and.returnValue('1.50K');
      
      const result = component.formatNumber(1500);
      
      expect(gameService.formatNumber).toHaveBeenCalledWith(1500);
      expect(result).toBe('1.50K');
    });

    it('should get building prices using GameService', () => {
      gameService.getBuildingPrice.and.returnValue(17);
      
      const result = component.getBuildingPrice('cursor');
      
      expect(gameService.getBuildingPrice).toHaveBeenCalledWith('cursor');
      expect(result).toBe(17);
    });

    it('should correctly determine if player can afford building', () => {
      gameService.getBuildingPrice.and.returnValue(50);
      
      const canAfford = component.canAfford('cursor');
      
      expect(canAfford).toBe(true); // 100 packages >= 50 cost
    });

    it('should correctly determine if player cannot afford building', () => {
      gameService.getBuildingPrice.and.returnValue(150);
      
      const canAfford = component.canAfford('cursor');
      
      expect(canAfford).toBe(false); // 100 packages < 150 cost
    });

    it('should handle edge case where packages equals building price', () => {
      gameService.getBuildingPrice.and.returnValue(100);
      
      const canAfford = component.canAfford('cursor');
      
      expect(canAfford).toBe(true); // 100 packages >= 100 cost
    });
  });

  describe('Auto-Generation Loop', () => {
    it('should continuously update game state during auto-generation', (done) => {
      jasmine.clock().install();
      
      let callCount = 0;
      gameService.generatePackages.and.callFake(() => {
        callCount++;
        return [];
      });
      
      component.ngOnInit();
      
      // Simulate multiple intervals
      jasmine.clock().tick(350); // 3.5 intervals
      
      setTimeout(() => {
        expect(callCount).toBeGreaterThanOrEqual(3);
        jasmine.clock().uninstall();
        done();
      }, 0);
    });

    it('should handle errors in auto-generation gracefully', (done) => {
      jasmine.clock().install();
      
      gameService.generatePackages.and.throwError('Test error');
      spyOn(console, 'error');
      
      expect(() => component.ngOnInit()).not.toThrow();
      
      jasmine.clock().tick(150);
      
      setTimeout(() => {
        jasmine.clock().uninstall();
        done();
      }, 0);
    });
  });

  describe('Performance Considerations', () => {
    it('should not cause memory leaks with multiple interval setups', () => {
      spyOn(window, 'setInterval').and.callThrough();
      spyOn(window, 'clearInterval').and.callThrough();
      
      // Initialize multiple times
      component.ngOnInit();
      component.ngOnDestroy();
      component.ngOnInit();
      component.ngOnDestroy();
      
      expect(clearInterval).toHaveBeenCalledTimes(4); // 2 intervals * 2 destroys
    });

    it('should handle rapid user interactions without issues', () => {
      component.ngOnInit();
      
      // Simulate rapid clicking
      for (let i = 0; i < 100; i++) {
        component.clickPackage();
      }
      
      expect(gameService.clickPackage).toHaveBeenCalledTimes(100);
      expect(gameService.getGameState).toHaveBeenCalledTimes(101); // Initial + 100 clicks
    });

    it('should handle rapid building purchases', () => {
      component.ngOnInit();
      
      // Simulate rapid building purchases
      for (let i = 0; i < 10; i++) {
        component.buyBuilding('cursor');
      }
      
      expect(gameService.buyBuilding).toHaveBeenCalledTimes(10);
      expect(gameService.getGameState).toHaveBeenCalledTimes(11); // Initial + 10 purchases
    });
  });

  describe('State Management', () => {
    it('should maintain state consistency between service and component', () => {
      const updatedState = { ...mockGameState, packages: 500 };
      gameService.getGameState.and.returnValue(updatedState);
      
      component.ngOnInit();
      
      expect(component.gameState).toEqual(updatedState);
    });

    it('should handle undefined or null game state gracefully', () => {
      gameService.getGameState.and.returnValue(null as any);
      
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle empty achievements array', () => {
      gameService.getAchievements.and.returnValue([]);
      
      component.ngOnInit();
      
      expect(component.achievements).toEqual([]);
    });

    it('should handle achievements with unlocked status', () => {
      const mockAchievements: Achievement[] = [
        { id: 'first_package', name: 'First Package!', description: 'Ship your first package', requirement: 1, type: 'packages', unlocked: true },
        { id: 'fast_clicker', name: 'Speed Demon', description: 'Click 100 times', requirement: 100, type: 'clicks', unlocked: false }
      ];
      
      gameService.getAchievements.and.returnValue(mockAchievements);
      
      component.ngOnInit();
      
      expect(component.achievements).toEqual(mockAchievements);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero packages correctly', () => {
      const zeroPackageState = { ...mockGameState, packages: 0 };
      gameService.getGameState.and.returnValue(zeroPackageState);
      
      component.ngOnInit();
      
      expect(component.canAfford('cursor')).toBe(false);
    });

    it('should handle very large package numbers', () => {
      const largePackageState = { ...mockGameState, packages: Number.MAX_SAFE_INTEGER };
      gameService.getGameState.and.returnValue(largePackageState);
      
      component.ngOnInit();
      
      expect(component.canAfford('cursor')).toBe(true);
    });

    it('should handle negative package numbers', () => {
      const negativePackageState = { ...mockGameState, packages: -100 };
      gameService.getGameState.and.returnValue(negativePackageState);
      
      component.ngOnInit();
      
      expect(component.canAfford('cursor')).toBe(false);
    });

    it('should handle invalid building types in canAfford', () => {
      gameService.getBuildingPrice.and.throwError('Invalid building type');
      
      expect(() => component.canAfford('invalid_building')).toThrow();
    });

    it('should handle service method failures gracefully', () => {
      gameService.clickPackage.and.throwError('Service error');
      
      expect(() => component.clickPackage()).toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should properly integrate with actual GameService methods', () => {
      // This would be more comprehensive with actual GameService
      component.ngOnInit();
      component.clickPackage();
      component.buyBuilding('cursor');
      
      expect(gameService.clickPackage).toHaveBeenCalled();
      expect(gameService.buyBuilding).toHaveBeenCalledWith('cursor');
      expect(gameService.getGameState).toHaveBeenCalledTimes(3); // ngOnInit + clickPackage + buyBuilding
    });

    it('should maintain correct method call order', () => {
      let callOrder: string[] = [];
      
      gameService.getGameState.and.callFake(() => {
        callOrder.push('getGameState');
        return mockGameState;
      });
      
      gameService.getAchievements.and.callFake(() => {
        callOrder.push('getAchievements');
        return [];
      });
      
      gameService.clickPackage.and.callFake(() => {
        callOrder.push('clickPackage');
        return [];
      });
      
      component.ngOnInit();
      component.clickPackage();
      
      expect(callOrder).toEqual(['getGameState', 'getAchievements', 'clickPackage', 'getGameState', 'getAchievements']);
    });
  });
});