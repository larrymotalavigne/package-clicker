import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  computed,
  inject,
  signal,
  HostListener,
} from '@angular/core';
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

import { ChallengeService } from './services/challenge.service';
import { LoreService } from './services/lore.service';
import { RareLootService } from './services/rare-loot.service';
import { SoundService } from './services/sound.service';
import { ThemeService } from './services/theme.service';
import { ContractService } from './services/contract.service';
import { AutoBuyService } from './services/auto-buy.service';
import { AutomationService } from './services/automation.service';
import { DailyRewardService } from './services/daily-reward.service';
import { EmployeeService } from './services/employee.service';
import { FleetService } from './services/fleet.service';
import { GreatDelayService } from './services/great-delay.service';
import { IdleKingdomService } from './services/idle-kingdom.service';
import { LeaderboardService } from './services/leaderboard.service';
import { PackageTypeService } from './services/package-type.service';
import { PriorityStampService } from './services/priority-stamp.service';
import { ResearchService } from './services/research.service';
import { StatsHistoryService } from './services/stats-history.service';
import { StockMarketService } from './services/stock-market.service';
import { WeatherService } from './services/weather.service';
import { GameSettings, MiniGameResult, RoutePlannerResult, SeasonalTheme } from './models/game.models';
import { getCurrentSeason } from './config/seasonal.config';
import { BuildingCardComponent } from './components/building-card/building-card.component';
import { UpgradePanelComponent } from './components/upgrade-panel/upgrade-panel.component';
import { ParticleEffectsComponent } from './components/particle-effects/particle-effects.component';
import { MilkBarComponent } from './components/milk-bar/milk-bar.component';
import { GoldenPackageComponent } from './components/golden-package/golden-package.component';
import { BuffDisplayComponent } from './components/buff-display/buff-display.component';
import { NewsTickerComponent } from './components/news-ticker/news-ticker.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { StatsPanelComponent } from './components/stats-panel/stats-panel.component';
import { OptionsPanelComponent } from './components/options-panel/options-panel.component';
import { PrestigeScreenComponent } from './components/prestige-screen/prestige-screen.component';
import { WrinklerComponent } from './components/wrinkler/wrinkler.component';
import { EventPopupComponent } from './components/event-popup/event-popup.component';
import { OfflinePopupComponent } from './components/offline-popup/offline-popup.component';
import { ChallengePanelComponent } from './components/challenge-panel/challenge-panel.component';
import { LoreViewerComponent } from './components/lore-viewer/lore-viewer.component';
import { LootDisplayComponent } from './components/loot-display/loot-display.component';
import { ProgressHintsComponent, ProgressHint } from './components/progress-hints/progress-hints.component';
import { SeasonalBannerComponent } from './components/seasonal-banner/seasonal-banner.component';
import { MiniGameComponent } from './components/mini-game/mini-game.component';
import { ContractPanelComponent } from './components/contract-panel/contract-panel.component';
import { RoutePlannerComponent } from './components/route-planner/route-planner.component';
import { AutomationPanelComponent } from './components/automation-panel/automation-panel.component';
import { DailyRewardPopupComponent } from './components/daily-reward-popup/daily-reward-popup.component';
import { EmployeePanelComponent } from './components/employee-panel/employee-panel.component';
import { FleetPanelComponent } from './components/fleet-panel/fleet-panel.component';
import { IdleKingdomComponent } from './components/idle-kingdom/idle-kingdom.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ResearchPanelComponent } from './components/research-panel/research-panel.component';
import { StampDisplayComponent } from './components/stamp-display/stamp-display.component';
import { StockMarketComponent } from './components/stock-market/stock-market.component';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';
import { RESEARCH_NODES } from './config/research.config';
import { NewsContext } from './config/news-messages.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    BuildingCardComponent,
    UpgradePanelComponent,
    ParticleEffectsComponent,
    MilkBarComponent,
    GoldenPackageComponent,
    BuffDisplayComponent,
    NewsTickerComponent,
    TooltipComponent,
    StatsPanelComponent,
    OptionsPanelComponent,
    PrestigeScreenComponent,
    WrinklerComponent,
    EventPopupComponent,
    OfflinePopupComponent,
    ChallengePanelComponent,
    LoreViewerComponent,
    LootDisplayComponent,
    ProgressHintsComponent,
    SeasonalBannerComponent,
    MiniGameComponent,
    ContractPanelComponent,
    RoutePlannerComponent,
    AutomationPanelComponent,
    DailyRewardPopupComponent,
    EmployeePanelComponent,
    FleetPanelComponent,
    IdleKingdomComponent,
    LeaderboardComponent,
    ResearchPanelComponent,
    StampDisplayComponent,
    StockMarketComponent,
    WeatherDisplayComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(ParticleEffectsComponent) particles!: ParticleEffectsComponent;

  private gameStateService = inject(GameStateService);
  private gameActionsService = inject(GameActionsService);
  private configService = inject(ConfigService);
  achievementService = inject(AchievementService);
  private saveService = inject(SaveService);
  private upgradeService = inject(UpgradeService);
  private goldenPackageService = inject(GoldenPackageService);
  prestigeService = inject(PrestigeService);
  private wrinklerService = inject(WrinklerService);
  tooltipService = inject(TooltipService);
  eventService = inject(EventService);
  offlineService = inject(OfflineEarningsService);
  challengeService = inject(ChallengeService);
  loreService = inject(LoreService);
  rareLootService = inject(RareLootService);
  soundService = inject(SoundService);
  themeService = inject(ThemeService);
  contractService = inject(ContractService);
  autoBuyService = inject(AutoBuyService);
  automationService = inject(AutomationService);
  dailyRewardService = inject(DailyRewardService);
  employeeService = inject(EmployeeService);
  fleetService = inject(FleetService);
  greatDelayService = inject(GreatDelayService);
  idleKingdomService = inject(IdleKingdomService);
  leaderboardService = inject(LeaderboardService);
  private packageTypeService = inject(PackageTypeService);
  priorityStampService = inject(PriorityStampService);
  researchService = inject(ResearchService);
  private statsHistoryService = inject(StatsHistoryService);
  stockMarketService = inject(StockMarketService);
  weatherService = inject(WeatherService);

  gameState = this.gameStateService.gameState;
  packagesPerSecond = this.gameStateService.packagesPerSecond;
  goldenVisible = this.goldenPackageService.visible;
  goldenPosition = this.goldenPackageService.position;
  wrinklers = this.wrinklerService.wrinklers;

  showStats = false;
  showOptions = false;
  showPrestige = false;
  showChallenges = false;
  showLore = false;
  showMiniGame = false;
  showContracts = false;
  showRoutePlanner = false;
  showAutomation = false;
  showEmployees = false;
  showFleet = false;
  showKingdom = false;
  showLeaderboard = false;
  showResearch = false;
  showStockMarket = false;
  achievementPopup: string | null = null;
  isClicking = false;
  screenFlashClass = '';

  // Konami code
  private readonly konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
  ];
  private konamiBuffer: string[] = [];

  // Click streak
  private clickStreak = 0;
  private lastStreakTime = 0;
  private streakTimeout: ReturnType<typeof setTimeout> | null = null;
  readonly streakDisplay = signal('');

  readonly pendingEvent = this.eventService.pendingEvent;
  readonly activeEvents = this.eventService.activeEvents;
  readonly availableUpgrades = this.upgradeService.availableUpgrades;
  readonly offlineEarnings = this.offlineService.offlineEarnings;
  readonly offlineSeconds = this.offlineService.offlineSeconds;
  readonly lastLootDrop = this.rareLootService.lastDrop;
  readonly challengeResult = this.challengeService.challengeResult;
  readonly contractResult = this.contractService.contractResult;
  readonly activeChallenge = this.challengeService.activeChallenge;
  readonly currentSeason: SeasonalTheme | undefined = getCurrentSeason();
  readonly researchNodes = RESEARCH_NODES;
  readonly dailyPopupVisible = this.dailyRewardService.showPopup;
  readonly dailyCurrentDay = this.dailyRewardService.currentDay;
  readonly dailyStreak = this.dailyRewardService.streak;
  readonly weatherCurrent = this.weatherService.currentWeather;

  readonly totalBuildings = this.gameStateService.totalBuildings;
  readonly milkPercent = computed(() => this.achievementService.completionPercentage());

  readonly effectivePps = computed(() => {
    const state = this.gameStateService.gameState();
    let pps = this.gameActionsService.getEffectivePps(state);
    if (this.currentSeason) pps *= (1 + this.currentSeason.productionBonus);
    return pps;
  });

  readonly effectiveClick = computed(() => {
    const state = this.gameStateService.gameState();
    return this.gameActionsService.getEffectiveClickValue(state);
  });

  readonly prestigePendingGain = this.prestigeService.pendingGain;

  readonly newsContext = computed((): NewsContext => {
    const s = this.gameState();
    const buildings: Record<string, number> = {};
    for (const [k, v] of Object.entries(s.buildings)) {
      buildings[k] = v.count;
    }
    return {
      packages: s.totalPackagesEarned,
      pps: s.packagesPerSecond,
      buildings,
      totalClicks: s.totalPackagesClicked,
    };
  });

  readonly buildingStats = computed(() => {
    const configs = this.configService.getBuildingConfigs();
    const state = this.gameState();
    return configs.map((c) => {
      const data = state.buildings[c.id as keyof typeof state.buildings];
      return {
        name: c.name,
        count: data?.count ?? 0,
        cps: data ? data.count * data.pps : 0,
      };
    });
  });

  readonly achievementProgress = computed(() => {
    return this.achievementService.getAchievementProgress(this.gameState());
  });

  readonly progressHints = computed((): ProgressHint[] => {
    const state = this.gameState();
    const hints: ProgressHint[] = [];
    const configs = this.configService.getBuildingConfigs();
    for (const c of configs) {
      const data = state.buildings[c.id as keyof typeof state.buildings];
      if (!data || data.count === 0) continue;
      const milestones = [10, 25, 50, 100, 150, 200];
      for (const m of milestones) {
        if (data.count < m) {
          hints.push({
            text: `${c.name}: ${data.count}/${m}`,
            progress: (data.count / m) * 100,
          });
          break;
        }
      }
    }
    return hints.slice(0, 3);
  });

  hintIndex = 0;

  private gameInterval!: ReturnType<typeof setInterval>;
  private saveInterval!: ReturnType<typeof setInterval>;
  private buffInterval!: ReturnType<typeof setInterval>;
  private ppsRecalcInterval!: ReturnType<typeof setInterval>;
  private hintInterval!: ReturnType<typeof setInterval>;
  private loreInterval!: ReturnType<typeof setInterval>;

  constructor() {
    const saved = this.gameState();
    this.achievementService.setUnlockedAchievements(saved.achievements);
  }

  ngOnInit(): void {
    this.themeService.init();
    this.gameActionsService.recalculatePps();
    this.offlineService.checkOfflineEarnings();
    this.logConsoleGreeting();

    this.contractService.refreshBoard();
    this.dailyRewardService.checkLogin();
    this.stockMarketService.init();
    this.leaderboardService.init();
    this.weatherService.start();
    this.idleKingdomService.initCities();
    this.greatDelayService.checkStageAdvance();

    this.gameInterval = setInterval(() => {
      this.gameActionsService.generatePassiveIncome();
    }, this.configService.getGameLoopInterval());

    this.saveInterval = setInterval(() => {
      this.gameStateService.updateLastSaveTime();
      this.saveService.saveGameState(this.gameState());
    }, this.configService.getAutoSaveInterval());

    this.buffInterval = setInterval(() => {
      this.goldenPackageService.tickBuffs(100);
      this.gameStateService.updatePlayTime(100);
      this.eventService.tickEvents(100);
      this.challengeService.tickChallenge(100);
      this.contractService.tickContracts(100);
      this.autoBuyService.tick(100);
      this.idleKingdomService.tick(100);
      this.priorityStampService.tick(100);
      this.researchService.tickResearch(100);
      this.employeeService.tickEmployees(100);
      this.leaderboardService.tickLeaderboard(100);
    }, 100);

    this.ppsRecalcInterval = setInterval(() => {
      this.gameActionsService.recalculatePps();
      this.stockMarketService.tickPrices();
      this.statsHistoryService.record(this.packagesPerSecond(), this.gameState().packages);
      this.greatDelayService.checkStageAdvance();
    }, 1000);

    this.hintInterval = setInterval(() => {
      this.hintIndex++;
    }, 5000);

    this.loreInterval = setInterval(() => {
      const newLore = this.loreService.checkLoreUnlocks();
      if (newLore.length > 0) {
        this.achievementPopup = 'New chapter unlocked!';
        setTimeout(() => (this.achievementPopup = null), 3000);
      }
    }, 5000);

    this.goldenPackageService.start();
    this.eventService.start();
  }

  ngOnDestroy(): void {
    clearInterval(this.gameInterval);
    clearInterval(this.saveInterval);
    clearInterval(this.buffInterval);
    clearInterval(this.ppsRecalcInterval);
    clearInterval(this.hintInterval);
    clearInterval(this.loreInterval);
    this.goldenPackageService.stop();
    this.eventService.stop();
    this.weatherService.stop();
    this.gameStateService.updateLastSaveTime();
    this.saveService.saveGameState(this.gameState());
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement) return;
    if (event.target instanceof HTMLTextAreaElement) return;

    this.konamiBuffer.push(event.key);
    if (this.konamiBuffer.length > 10) {
      this.konamiBuffer.shift();
    }
    if (this.konamiBuffer.length === 10 &&
        this.konamiBuffer.every((k, i) => k === this.konamiSequence[i])) {
      this.activateKonamiCode();
      this.konamiBuffer = [];
    }

    switch (event.key) {
      case ' ':
        event.preventDefault();
        this.gameActionsService.clickPackage();
        this.soundService.playClick();
        this.challengeService.recordClick();
        break;
      case '1': case '2': case '3': case '4': case '5':
      case '6': case '7': case '8': case '9': case '0': {
        const idx = event.key === '0' ? 9 : parseInt(event.key, 10) - 1;
        const configs = this.configService.getBuildingConfigs();
        if (idx < configs.length) this.buyBuilding(configs[idx].id);
        break;
      }
      case 's': this.showStats = !this.showStats; break;
      case 'o': this.showOptions = !this.showOptions; break;
      case 'c': this.showChallenges = !this.showChallenges; break;
      case 'l': this.showLore = !this.showLore; break;
      case 'r': this.showContracts = !this.showContracts; break;
      case 'p': this.showRoutePlanner = !this.showRoutePlanner; break;
      case 'a': this.showAutomation = !this.showAutomation; break;
      case 'e': this.showEmployees = !this.showEmployees; break;
      case 'f': this.showFleet = !this.showFleet; break;
      case 'k': this.showKingdom = !this.showKingdom; break;
      case 'b': this.showLeaderboard = !this.showLeaderboard; break;
      case 'h': this.showResearch = !this.showResearch; break;
      case 'm': this.showStockMarket = !this.showStockMarket; break;
      case 'Escape':
        this.showStats = false;
        this.showOptions = false;
        this.showPrestige = false;
        this.showChallenges = false;
        this.showLore = false;
        this.showContracts = false;
        this.showRoutePlanner = false;
        this.showAutomation = false;
        this.showEmployees = false;
        this.showFleet = false;
        this.showKingdom = false;
        this.showLeaderboard = false;
        this.showResearch = false;
        this.showStockMarket = false;
        break;
    }
  }

  clickPackage(event: MouseEvent): void {
    this.updateClickStreak();
    this.trackRapidClicks();
    this.gameActionsService.clickPackage();
    this.soundService.playClick();
    this.challengeService.recordClick();
    this.contractService.recordAction('click_count', 1);

    this.isClicking = true;
    setTimeout(() => (this.isClicking = false), 150);

    if (this.particles && this.gameState().settings.particleEffects) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.particles.spawn(x, y, '+' + this.formatNumber(this.effectiveClick()));
    }
  }

  buyBuilding(type: string): void {
    const bought = this.gameActionsService.buyBuilding(type);
    if (bought) {
      this.soundService.playPurchase();
      this.challengeService.recordBuildingPurchase();
      this.contractService.recordAction('buy_buildings', 1);
    }
  }

  purchaseUpgrade(id: string): void {
    const bought = this.upgradeService.purchaseUpgrade(id);
    if (bought) {
      this.soundService.playUpgrade();
      this.gameActionsService.recalculatePps();
    }
  }

  clickGolden(): void {
    const buff = this.goldenPackageService.click();
    if (buff) {
      this.soundService.playGolden();
      this.challengeService.recordGoldenClick();
      this.contractService.recordAction('golden_clicks', 1);
      this.achievementPopup = buff.name;
      setTimeout(() => (this.achievementPopup = null), 3000);

      if (buff.type === 'frenzy') {
        this.screenFlashClass = 'flash-frenzy';
      } else if (buff.type === 'click_frenzy') {
        this.screenFlashClass = 'flash-click-frenzy';
      } else {
        this.screenFlashClass = 'flash-lucky';
      }
      setTimeout(() => (this.screenFlashClass = ''), 500);

      // Chance for loot drop on golden click
      if (Math.random() < 0.15) {
        const loot = this.rareLootService.rollForLoot();
        if (loot) this.soundService.playLootDrop();
      }

      // Express points from golden clicks
      const epAmount = Math.floor(1 + Math.random() * 3);
      this.gameStateService.addExpressPoints(epAmount);
    }
  }

  popWrinkler(id: number): void {
    this.wrinklerService.pop(id);
  }

  ascend(): void {
    this.prestigeService.ascend();
    this.achievementService.resetAchievements();
    this.showPrestige = false;
    this.gameStateService.addExpressPoints(10 * this.prestigeService.pendingGain());
  }

  purchaseHeavenly(id: string): void {
    this.prestigeService.purchaseHeavenlyUpgrade(id);
  }

  acceptEvent(): void {
    this.soundService.playEvent();
    this.eventService.acceptEvent();
  }

  dismissEvent(): void {
    this.eventService.dismissEvent();
  }

  claimOffline(): void {
    this.offlineService.claimOfflineEarnings();
  }

  startChallenge(id: string): void {
    this.challengeService.startChallenge(id);
    this.showChallenges = false;
  }

  completeMiniGame(result: MiniGameResult): void {
    this.gameStateService.addExpressPoints(result.expressPointsEarned);
    this.showMiniGame = false;
    if (result.expressPointsEarned > 0) {
      this.soundService.playChallengeComplete();
    }
  }

  acceptContractSlot(index: number): void {
    this.contractService.acceptContract(index);
  }

  refreshContractSlot(index: number): void {
    this.contractService.refreshSlot(index);
  }

  claimDailyReward(): void {
    this.dailyRewardService.claimReward();
  }

  unlockAutomationRule(ruleId: string): void {
    this.automationService.unlockRule(ruleId);
  }

  toggleAutomationRule(ruleId: string): void {
    this.automationService.toggleRule(ruleId);
  }

  hireEmployee(type: string): void {
    const hired = this.employeeService.hire(type as any);
    if (hired) this.soundService.playPurchase();
  }

  assignFleetRoute(routeId: string): void {
    this.fleetService.assignRoute(routeId);
  }

  unassignFleetRoute(routeId: string): void {
    this.fleetService.unassignRoute(routeId);
  }

  upgradeKingdomCity(cityId: string): void {
    this.idleKingdomService.upgradeCity(cityId);
  }

  startResearch(node: any): void {
    this.researchService.startResearch(node);
  }

  buyStock(event: { buildingId: string; quantity: number }): void {
    this.stockMarketService.buyStock(event.buildingId, event.quantity);
  }

  sellStock(event: { buildingId: string; quantity: number }): void {
    this.stockMarketService.sellStock(event.buildingId, event.quantity);
  }

  completeRoutePlanner(result: RoutePlannerResult): void {
    const buff = {
      id: 'route_buff',
      name: 'Efficient Routes',
      type: 'frenzy' as const,
      multiplier: result.buffMultiplier,
      remainingMs: result.buffDurationMs,
      totalMs: result.buffDurationMs,
    };
    const buffs = [...this.gameState().activeBuffs, buff];
    this.gameStateService.updateActiveBuffs(buffs);
    this.gameStateService.addExpressPoints(result.expressPointsEarned);
    this.showRoutePlanner = false;

    this.achievementPopup = `Route ${result.rating}! +${result.expressPointsEarned} EP`;
    setTimeout(() => (this.achievementPopup = null), 3000);

    if (result.rating === 'excellent') {
      this.gameStateService.updateEasterEggs({ routeExcellent: true });
    }
  }

  formatNumber(num: number): string {
    return this.configService.formatNumber(num);
  }

  getBuildingPrice(type: string): number {
    return this.gameActionsService.getBuildingPrice(type);
  }

  canAfford(type: string): boolean {
    return this.gameActionsService.canAffordBuilding(type);
  }

  getBuildingConfigs() {
    return this.configService.getBuildingConfigs();
  }

  getBuildingData(id: string) {
    const state = this.gameState();
    return state.buildings[id as keyof typeof state.buildings];
  }

  handleSave(): void {
    this.gameStateService.updateLastSaveTime();
    this.saveService.saveGameState(this.gameState());
  }

  handleExport(): void {
    const data = this.saveService.exportSaveData();
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `package-clicker-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  handleImport(jsonData: string): void {
    if (this.saveService.importSaveData(jsonData)) {
      location.reload();
    }
  }

  handleWipe(): void {
    this.saveService.wipeSave();
    this.achievementService.resetAchievements();
  }

  handleSettingChange(settings: Partial<GameSettings>): void {
    this.gameStateService.updateSettings(settings);
    if (settings.theme) {
      this.themeService.applyTheme(settings.theme);
    }
  }

  private activateKonamiCode(): void {
    if (this.gameState().easterEggs?.konamiUsed) return;

    document.body.classList.add('barrel-roll');
    setTimeout(() => document.body.classList.remove('barrel-roll'), 1500);

    this.screenFlashClass = 'flash-konami';
    setTimeout(() => (this.screenFlashClass = ''), 500);

    const buff = {
      id: 'konami_frenzy',
      name: 'The Purple Promise',
      type: 'frenzy' as const,
      multiplier: 10,
      remainingMs: 30000,
      totalMs: 30000,
    };
    const buffs = [...this.gameState().activeBuffs, buff];
    this.gameStateService.updateActiveBuffs(buffs);

    this.gameStateService.updateEasterEggs({ konamiUsed: true });
    this.soundService.playGolden();

    this.achievementPopup = 'The Purple Promise Activated!';
    setTimeout(() => (this.achievementPopup = null), 3000);
  }

  private updateClickStreak(): void {
    const now = Date.now();
    if (now - this.lastStreakTime < 2000) {
      this.clickStreak++;
    } else {
      this.clickStreak = 1;
    }
    this.lastStreakTime = now;

    if (this.streakTimeout) clearTimeout(this.streakTimeout);
    this.streakTimeout = setTimeout(() => {
      this.clickStreak = 0;
      this.streakDisplay.set('');
      this.gameActionsService.streakMultiplier = 1;
    }, 2000);

    this.applyStreakBonus();
  }

  private applyStreakBonus(): void {
    if (this.clickStreak >= 50) {
      this.streakDisplay.set('x50!');
      this.setStreakMultiplier(5, 5000);
      this.screenFlashClass = 'flash-konami';
      setTimeout(() => (this.screenFlashClass = ''), 500);
    } else if (this.clickStreak >= 20) {
      this.streakDisplay.set('x20!');
      this.setStreakMultiplier(3, 3000);
      this.soundService.playChallengeComplete();
    } else if (this.clickStreak >= 10) {
      this.streakDisplay.set('x10!');
      this.setStreakMultiplier(2, 3000);
    } else if (this.clickStreak >= 5) {
      this.streakDisplay.set('x5!');
      this.setStreakMultiplier(1.5, 3000);
    } else {
      this.streakDisplay.set('');
    }
  }

  private setStreakMultiplier(mult: number, ms: number): void {
    this.gameActionsService.streakMultiplier = mult;
    setTimeout(() => {
      this.gameActionsService.streakMultiplier = 1;
    }, ms);
  }

  private trackRapidClicks(): void {
    const now = Date.now();
    const eggs = this.gameState().easterEggs ?? {
      konamiUsed: false,
      rapidClickTimestamps: [],
    };
    const timestamps = [...eggs.rapidClickTimestamps, now]
      .slice(-20);
    this.gameStateService.updateEasterEggs({
      rapidClickTimestamps: timestamps,
    });
  }

  private logConsoleGreeting(): void {
    const days = [
      'Sunday Funday!',
      'Ugh, Monday.',
      'Taco Tuesday!',
      'Hump Day!',
      'Almost Friday!',
      'TGIF!',
      'Weekend vibes!',
    ];
    const dayMsg = days[new Date().getDay()];
    console.warn(
      '%cPACKAGE CLICKER',
      'color:#4D148C;font-size:2em;font-weight:bold;'
    );
    console.warn(
      '%cThe world on time. One click at a time.',
      'color:#FF6600;font-size:1em;'
    );
    console.warn(
      '%cPsst... the ancient ones spoke of a code. Up, Up, Down, Down...',
      'color:#888;font-style:italic;'
    );
    console.warn(
      '%c' + dayMsg,
      'color:#ffd700;font-size:0.9em;'
    );
  }

  resetGame(): void {
    if (confirm('Are you sure you want to reset? This cannot be undone!')) {
      this.gameActionsService.resetGame();
    }
  }
}
