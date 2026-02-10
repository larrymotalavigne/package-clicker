import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GameStateService } from './services/game-state.service';
import { GameActionsService } from './services/game-actions.service';
import { ConfigService } from './services/config.service';
import { AchievementService } from './services/achievement.service';
import { SaveService } from './services/save.service';
import { UpgradeService } from './services/upgrade.service';
import { GoldenPackageService } from './services/golden-package.service';
import { PrestigeService } from './services/prestige.service';
import { WrinklerService } from './services/wrinkler.service';
import { TooltipService } from './services/tooltip.service';
import { EventService } from './services/event.service';
import { OfflineEarningsService } from './services/offline-earnings.service';
import { SynergyService } from './services/synergy.service';
import { ChallengeService } from './services/challenge.service';
import { LoreService } from './services/lore.service';
import { RareLootService } from './services/rare-loot.service';
import { SoundService } from './services/sound.service';
import { ThemeService } from './services/theme.service';
import { signal, computed } from '@angular/core';

function createMockGameState() {
  return {
    packages: 100,
    packagesPerSecond: 5,
    packagesPerClick: 1,
    buildings: {
      cursor: { count: 2, basePrice: 15, pps: 0.1 },
      grandma: { count: 1, basePrice: 100, pps: 1 },
      farm: { count: 0, basePrice: 1100, pps: 8 },
      mine: { count: 0, basePrice: 12000, pps: 47 },
      factory: { count: 0, basePrice: 130000, pps: 260 },
      bank: { count: 0, basePrice: 1400000, pps: 1400 },
      warehouse: { count: 0, basePrice: 20000000, pps: 7800 },
      airport: { count: 0, basePrice: 330000000, pps: 44000 },
      spaceport: { count: 0, basePrice: 5100000000, pps: 260000 },
      ceo: { count: 0, basePrice: 75000000000, pps: 1600000 },
      satellite: { count: 0, basePrice: 1000000000000, pps: 65000000 },
      timemachine: { count: 0, basePrice: 14000000000000, pps: 430000000 },
      multiverse: { count: 0, basePrice: 200000000000000, pps: 2900000000 },
    },
    achievements: [],
    totalPackagesClicked: 50,
    totalPackagesEarned: 200,
    purchasedUpgrades: [],
    prestige: {
      level: 0,
      points: 0,
      totalEarnedAllTime: 0,
      heavenlyUpgrades: [],
      timesAscended: 0,
    },
    goldenPackageClicks: 0,
    wrinklers: [],
    settings: {
      particleEffects: true,
      shortNumbers: true,
      showBuffTimers: true,
      soundEnabled: false,
      theme: 'dark' as const,
    },
    totalBuildingsEver: 0,
    totalPlayTime: 0,
    lastTickTime: Date.now(),
    activeBuffs: [],
    activeEvents: [],
    totalEventsExperienced: 0,
    expressPoints: 0,
    totalExpressPointsEarned: 0,
    rareLoot: [],
    activeChallenge: null,
    completedChallenges: [] as string[],
    loreUnlocked: [] as string[],
    lastSaveTime: Date.now(),
    easterEggs: {
      konamiUsed: false,
      rapidClickTimestamps: [],
    },
  };
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: any;
  let gameStateService: any;
  let gameActionsService: any;
  let configService: any;
  let achievementService: any;
  let saveService: any;
  let upgradeService: any;
  let goldenPackageService: any;
  let prestigeService: any;
  let wrinklerService: any;
  let eventService: any;
  let offlineService: any;
  let challengeService: any;
  let loreService: any;
  let rareLootService: any;
  let soundService: any;
  let themeService: any;

  const mockState = createMockGameState();
  const gameStateSignal = signal(mockState);

  beforeEach(async () => {
    gameStateService = {
      gameState: gameStateSignal.asReadonly(),
      packagesPerSecond: computed(() => gameStateSignal().packagesPerSecond),
      totalBuildings: computed(() => 3),
      updatePackages: jest.fn(),
      updateTotalPackagesEarned: jest.fn(),
      updateTotalPackagesClicked: jest.fn(),
      updateBuilding: jest.fn(),
      updatePackagesPerSecond: jest.fn(),
      addAchievement: jest.fn(),
      addPurchasedUpgrade: jest.fn(),
      updateActiveBuffs: jest.fn(),
      incrementGoldenClicks: jest.fn(),
      updateWrinklers: jest.fn(),
      updateSettings: jest.fn(),
      updatePrestige: jest.fn(),
      updatePlayTime: jest.fn(),
      setFullState: jest.fn(),
      resetState: jest.fn(),
      resetForAscension: jest.fn(),
      getDefaultGameState: jest.fn().mockReturnValue(mockState),
      updateLastSaveTime: jest.fn(),
      addExpressPoints: jest.fn(),
      spendExpressPoints: jest.fn(),
      addRareLoot: jest.fn(),
      updateChallenge: jest.fn(),
      completeChallenge: jest.fn(),
      unlockLore: jest.fn(),
      updateActiveEvents: jest.fn(),
      addActiveEvent: jest.fn(),
      incrementEventsExperienced: jest.fn(),
      updateEasterEggs: jest.fn(),
    };

    gameActionsService = {
      clickPackage: jest.fn(),
      buyBuilding: jest.fn().mockReturnValue(true),
      canAffordBuilding: jest.fn().mockReturnValue(true),
      getBuildingPrice: jest.fn().mockReturnValue(15),
      generatePassiveIncome: jest.fn(),
      recalculatePps: jest.fn(),
      resetGame: jest.fn(),
      getEffectivePps: jest.fn().mockReturnValue(5),
      getEffectiveClickValue: jest.fn().mockReturnValue(1),
      streakMultiplier: 1,
    };

    configService = {
      getGameLoopInterval: jest.fn().mockReturnValue(100),
      getAutoSaveInterval: jest.fn().mockReturnValue(30000),
      getBasePriceMultiplier: jest.fn().mockReturnValue(1.15),
      getClickDebounceTime: jest.fn().mockReturnValue(50),
      getSaveVersion: jest.fn().mockReturnValue('2.0.0'),
      getStorageKey: jest.fn().mockReturnValue('packageClickerSave'),
      getBuildingConfigs: jest.fn().mockReturnValue([]),
      getBuildingConfig: jest.fn(),
      getBuildingIds: jest.fn().mockReturnValue([]),
      isBuildingType: jest.fn().mockReturnValue(true),
      getAchievementDefinitions: jest.fn().mockReturnValue([]),
      calculateBuildingPrice: jest.fn().mockReturnValue(15),
      formatNumber: jest.fn((n: number) => n.toString()),
    };

    achievementService = {
      completionPercentage: signal(0),
      unlockedCount: signal(0),
      totalCount: signal(0),
      checkAchievements: jest.fn().mockReturnValue({ newlyUnlocked: [] }),
      getAchievementProgress: jest.fn().mockReturnValue([]),
      getAchievementStats: jest.fn().mockReturnValue({ progressPercentage: 0 }),
      setUnlockedAchievements: jest.fn(),
      resetAchievements: jest.fn(),
    };

    saveService = {
      saveGameState: jest.fn(),
      loadGameState: jest.fn(),
      exportSaveData: jest.fn(),
      importSaveData: jest.fn(),
      wipeSave: jest.fn(),
    };

    upgradeService = {
      availableUpgrades: computed(() => []),
      purchaseUpgrade: jest.fn(),
      getClickMultiplier: jest.fn().mockReturnValue(1),
      getBuildingMultiplier: jest.fn().mockReturnValue(1),
      getGlobalMultiplier: jest.fn().mockReturnValue(1),
      getClickPpsPercent: jest.fn().mockReturnValue(0),
      getUpgradeEffects: jest.fn().mockReturnValue([]),
      getCostReduction: jest.fn().mockReturnValue(0),
      getGoldenFrequencyMult: jest.fn().mockReturnValue(1),
    };

    goldenPackageService = {
      visible: signal(false),
      position: signal({ x: 50, y: 50 }),
      start: jest.fn(),
      stop: jest.fn(),
      click: jest.fn(),
      tickBuffs: jest.fn(),
      getClickMultiplier: jest.fn().mockReturnValue(1),
      getProductionMultiplier: jest.fn().mockReturnValue(1),
    };

    prestigeService = {
      pendingGain: computed(() => 0),
      prestigeMultiplier: computed(() => 1),
      heavenlyMultiplier: computed(() => 1),
      heavenlyUpgrades: [],
      ascend: jest.fn(),
      purchaseHeavenlyUpgrade: jest.fn(),
    };

    wrinklerService = {
      wrinklers: signal([]),
      tick: jest.fn().mockReturnValue(0),
      pop: jest.fn(),
    };

    eventService = {
      pendingEvent: signal(null),
      activeEvents: computed(() => []),
      start: jest.fn(),
      stop: jest.fn(),
      acceptEvent: jest.fn(),
      dismissEvent: jest.fn(),
      tickEvents: jest.fn(),
      getProductionMultiplier: jest.fn().mockReturnValue(1),
      getClickMultiplier: jest.fn().mockReturnValue(1),
      getBuildingPriceMultiplier: jest.fn().mockReturnValue(1),
      getBuildingBoostMultiplier: jest.fn().mockReturnValue(1),
    };

    offlineService = {
      offlineEarnings: signal(0),
      offlineSeconds: signal(0),
      checkOfflineEarnings: jest.fn(),
      claimOfflineEarnings: jest.fn(),
    };

    challengeService = {
      activeChallenge: computed(() => null),
      completedChallenges: computed(() => []),
      challengeResult: signal(null),
      getAvailableChallenges: jest.fn().mockReturnValue([]),
      getAllChallenges: jest.fn().mockReturnValue([]),
      startChallenge: jest.fn(),
      recordClick: jest.fn(),
      recordBuildingPurchase: jest.fn(),
      recordGoldenClick: jest.fn(),
      tickChallenge: jest.fn(),
    };

    loreService = {
      unlockedLore: computed(() => []),
      unlockedCount: computed(() => 0),
      totalCount: 0,
      checkLoreUnlocks: jest.fn().mockReturnValue([]),
    };

    rareLootService = {
      lastDrop: signal(null),
      rollForLoot: jest.fn().mockReturnValue(null),
      getGlobalMultiplier: jest.fn().mockReturnValue(1),
      getClickMultiplier: jest.fn().mockReturnValue(1),
      getCostReduction: jest.fn().mockReturnValue(0),
      getGoldenFrequencyMult: jest.fn().mockReturnValue(1),
    };

    soundService = {
      playClick: jest.fn(),
      playPurchase: jest.fn(),
      playUpgrade: jest.fn(),
      playAchievement: jest.fn(),
      playGolden: jest.fn(),
      playEvent: jest.fn(),
      playLootDrop: jest.fn(),
      playChallengeComplete: jest.fn(),
      playChallengeFail: jest.fn(),
    };

    themeService = {
      init: jest.fn(),
      toggle: jest.fn(),
      applyTheme: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: GameStateService, useValue: gameStateService },
        { provide: GameActionsService, useValue: gameActionsService },
        { provide: ConfigService, useValue: configService },
        { provide: AchievementService, useValue: achievementService },
        { provide: SaveService, useValue: saveService },
        { provide: UpgradeService, useValue: upgradeService },
        { provide: GoldenPackageService, useValue: goldenPackageService },
        { provide: PrestigeService, useValue: prestigeService },
        { provide: WrinklerService, useValue: wrinklerService },
        { provide: EventService, useValue: eventService },
        { provide: TooltipService, useValue: { show: jest.fn(), hide: jest.fn(), visible: signal(false), data: signal(null) } },
        { provide: OfflineEarningsService, useValue: offlineService },
        { provide: SynergyService, useValue: { getSynergyMultiplier: jest.fn().mockReturnValue(1), getSynergiesForBuilding: jest.fn().mockReturnValue([]) } },
        { provide: ChallengeService, useValue: challengeService },
        { provide: LoreService, useValue: loreService },
        { provide: RareLootService, useValue: rareLootService },
        { provide: SoundService, useValue: soundService },
        { provide: ThemeService, useValue: themeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call recalculatePps on init', () => {
      component.ngOnInit();
      expect(gameActionsService.recalculatePps).toHaveBeenCalled();
    });

    it('should start golden package service on init', () => {
      component.ngOnInit();
      expect(goldenPackageService.start).toHaveBeenCalled();
    });

    it('should start event service on init', () => {
      component.ngOnInit();
      expect(eventService.start).toHaveBeenCalled();
    });

    it('should set up achievement state in constructor', () => {
      expect(achievementService.setUnlockedAchievements).toHaveBeenCalledWith(
        mockState.achievements
      );
    });

    it('should initialize theme on init', () => {
      component.ngOnInit();
      expect(themeService.init).toHaveBeenCalled();
    });

    it('should check offline earnings on init', () => {
      component.ngOnInit();
      expect(offlineService.checkOfflineEarnings).toHaveBeenCalled();
    });
  });

  describe('Component Cleanup', () => {
    it('should stop golden package service on destroy', () => {
      component.ngOnInit();
      component.ngOnDestroy();
      expect(goldenPackageService.stop).toHaveBeenCalled();
    });

    it('should stop event service on destroy', () => {
      component.ngOnInit();
      component.ngOnDestroy();
      expect(eventService.stop).toHaveBeenCalled();
    });

    it('should save game state on destroy', () => {
      component.ngOnInit();
      component.ngOnDestroy();
      expect(saveService.saveGameState).toHaveBeenCalled();
    });

    it('should update last save time on destroy', () => {
      component.ngOnInit();
      component.ngOnDestroy();
      expect(gameStateService.updateLastSaveTime).toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should call clickPackage on GameActionsService', () => {
      const event = new MouseEvent('click', {
        clientX: 100,
        clientY: 100,
      });
      Object.defineProperty(event, 'currentTarget', {
        value: {
          getBoundingClientRect: () => ({
            left: 0,
            top: 0,
            width: 200,
            height: 200,
          }),
        },
      });
      component.clickPackage(event);
      expect(gameActionsService.clickPackage).toHaveBeenCalled();
    });

    it('should play click sound on click', () => {
      const event = new MouseEvent('click', { clientX: 100, clientY: 100 });
      Object.defineProperty(event, 'currentTarget', {
        value: { getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 200 }) },
      });
      component.clickPackage(event);
      expect(soundService.playClick).toHaveBeenCalled();
    });

    it('should call buyBuilding on GameActionsService', () => {
      component.buyBuilding('cursor');
      expect(gameActionsService.buyBuilding).toHaveBeenCalledWith('cursor');
    });

    it('should play purchase sound on successful buy', () => {
      gameActionsService.buyBuilding.mockReturnValue(true);
      component.buyBuilding('cursor');
      expect(soundService.playPurchase).toHaveBeenCalled();
    });

    it('should handle buying different building types', () => {
      const types = ['cursor', 'grandma', 'farm'];
      types.forEach((t) => {
        component.buyBuilding(t);
        expect(gameActionsService.buyBuilding).toHaveBeenCalledWith(t);
      });
    });
  });

  describe('Upgrade Purchasing', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should purchase upgrade and recalculate PPS', () => {
      upgradeService.purchaseUpgrade.mockReturnValue(true);
      component.purchaseUpgrade('cursor_1');
      expect(upgradeService.purchaseUpgrade).toHaveBeenCalledWith('cursor_1');
      expect(gameActionsService.recalculatePps).toHaveBeenCalled();
    });

    it('should play upgrade sound on successful purchase', () => {
      upgradeService.purchaseUpgrade.mockReturnValue(true);
      component.purchaseUpgrade('cursor_1');
      expect(soundService.playUpgrade).toHaveBeenCalled();
    });
  });

  describe('Golden Package', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should call click on golden package service', () => {
      goldenPackageService.click.mockReturnValue({
        name: 'Frenzy',
        type: 'frenzy',
      });
      component.clickGolden();
      expect(goldenPackageService.click).toHaveBeenCalled();
    });

    it('should show achievement popup and screen flash on golden click', () => {
      goldenPackageService.click.mockReturnValue({
        name: 'Frenzy',
        type: 'frenzy',
      });
      component.clickGolden();
      expect(component.achievementPopup).toBe('Frenzy');
      expect(component.screenFlashClass).toBe('flash-frenzy');
    });

    it('should handle null return from golden click', () => {
      goldenPackageService.click.mockReturnValue(null);
      component.clickGolden();
      expect(component.achievementPopup).toBeNull();
    });

    it('should play golden sound on golden click', () => {
      goldenPackageService.click.mockReturnValue({
        name: 'Frenzy',
        type: 'frenzy',
      });
      component.clickGolden();
      expect(soundService.playGolden).toHaveBeenCalled();
    });

    it('should add express points on golden click', () => {
      goldenPackageService.click.mockReturnValue({
        name: 'Frenzy',
        type: 'frenzy',
      });
      component.clickGolden();
      expect(gameStateService.addExpressPoints).toHaveBeenCalled();
    });
  });

  describe('Wrinklers', () => {
    it('should pop wrinkler', () => {
      component.popWrinkler(3);
      expect(wrinklerService.pop).toHaveBeenCalledWith(3);
    });
  });

  describe('Prestige', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should ascend via prestige service', () => {
      component.showPrestige = true;
      component.ascend();
      expect(prestigeService.ascend).toHaveBeenCalled();
      expect(achievementService.resetAchievements).toHaveBeenCalled();
      expect(component.showPrestige).toBe(false);
    });

    it('should purchase heavenly upgrades', () => {
      component.purchaseHeavenly('start_packages');
      expect(prestigeService.purchaseHeavenlyUpgrade).toHaveBeenCalledWith(
        'start_packages'
      );
    });
  });

  describe('Helper Methods', () => {
    it('should format numbers via ConfigService', () => {
      configService.formatNumber.mockReturnValue('1.50K');
      const result = component.formatNumber(1500);
      expect(configService.formatNumber).toHaveBeenCalledWith(1500);
      expect(result).toBe('1.50K');
    });

    it('should get building price via GameActionsService', () => {
      gameActionsService.getBuildingPrice.mockReturnValue(17);
      const result = component.getBuildingPrice('cursor');
      expect(gameActionsService.getBuildingPrice).toHaveBeenCalledWith(
        'cursor'
      );
      expect(result).toBe(17);
    });

    it('should check affordability via GameActionsService', () => {
      gameActionsService.canAffordBuilding.mockReturnValue(true);
      expect(component.canAfford('cursor')).toBe(true);

      gameActionsService.canAffordBuilding.mockReturnValue(false);
      expect(component.canAfford('cursor')).toBe(false);
    });

    it('should return building configs via ConfigService', () => {
      const configs = [{ id: 'cursor', name: 'Cursor' }];
      configService.getBuildingConfigs.mockReturnValue(configs);
      expect(component.getBuildingConfigs()).toEqual(configs);
    });
  });

  describe('Save/Load Operations', () => {
    it('should save game state', () => {
      component.handleSave();
      expect(saveService.saveGameState).toHaveBeenCalled();
    });

    it('should wipe save and reset achievements', () => {
      component.handleWipe();
      expect(saveService.wipeSave).toHaveBeenCalled();
      expect(achievementService.resetAchievements).toHaveBeenCalled();
    });

    it('should update settings via game state service', () => {
      component.handleSettingChange({ particleEffects: false });
      expect(gameStateService.updateSettings).toHaveBeenCalledWith({
        particleEffects: false,
      });
    });

    it('should apply theme when theme setting changes', () => {
      component.handleSettingChange({ theme: 'light' });
      expect(themeService.applyTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('Reset Game', () => {
    it('should reset game after confirm', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      component.resetGame();
      expect(gameActionsService.resetGame).toHaveBeenCalled();
    });

    it('should not reset game when cancelled', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);
      component.resetGame();
      expect(gameActionsService.resetGame).not.toHaveBeenCalled();
    });
  });

  describe('Challenges', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should start a challenge', () => {
      component.startChallenge('speed_click_1');
      expect(challengeService.startChallenge).toHaveBeenCalledWith('speed_click_1');
    });
  });

  describe('Mini-Game', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should complete mini-game and add express points', () => {
      component.showMiniGame = true;
      component.completeMiniGame({ score: 20, expressPointsEarned: 4 });
      expect(gameStateService.addExpressPoints).toHaveBeenCalledWith(4);
      expect(component.showMiniGame).toBe(false);
    });
  });

  describe('Events', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should accept events with sound', () => {
      component.acceptEvent();
      expect(soundService.playEvent).toHaveBeenCalled();
      expect(eventService.acceptEvent).toHaveBeenCalled();
    });

    it('should dismiss events', () => {
      component.dismissEvent();
      expect(eventService.dismissEvent).toHaveBeenCalled();
    });
  });

  describe('Offline Earnings', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should claim offline earnings', () => {
      component.claimOffline();
      expect(offlineService.claimOfflineEarnings).toHaveBeenCalled();
    });
  });
});
