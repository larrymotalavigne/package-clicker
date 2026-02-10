import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  computed,
  inject,
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
import { GameSettings } from './models/game.models';
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

  gameState = this.gameStateService.gameState;
  packagesPerSecond = this.gameStateService.packagesPerSecond;
  goldenVisible = this.goldenPackageService.visible;
  goldenPosition = this.goldenPackageService.position;
  wrinklers = this.wrinklerService.wrinklers;

  showStats = false;
  showOptions = false;
  showPrestige = false;
  achievementPopup: string | null = null;
  isClicking = false;
  screenFlashClass = '';

  readonly pendingEvent = this.eventService.pendingEvent;
  readonly activeEvents = this.eventService.activeEvents;

  readonly availableUpgrades = this.upgradeService.availableUpgrades;

  readonly milkPercent = computed(
    () => this.achievementService.completionPercentage()
  );

  readonly effectivePps = computed(() => {
    const state = this.gameStateService.gameState();
    return this.gameActionsService.getEffectivePps(state);
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
      const data =
        state.buildings[c.id as keyof typeof state.buildings];
      return {
        name: c.name,
        count: data?.count ?? 0,
        cps: data ? data.count * data.pps : 0,
      };
    });
  });

  readonly achievementProgress = computed(() => {
    return this.achievementService.getAchievementProgress(
      this.gameState()
    );
  });

  private gameInterval!: ReturnType<typeof setInterval>;
  private saveInterval!: ReturnType<typeof setInterval>;
  private buffInterval!: ReturnType<typeof setInterval>;
  private ppsRecalcInterval!: ReturnType<typeof setInterval>;

  constructor() {
    const saved = this.gameState();
    this.achievementService.setUnlockedAchievements(
      saved.achievements
    );
  }

  ngOnInit(): void {
    this.gameActionsService.recalculatePps();

    this.gameInterval = setInterval(() => {
      this.gameActionsService.generatePassiveIncome();
    }, this.configService.getGameLoopInterval());

    this.saveInterval = setInterval(() => {
      this.saveService.saveGameState(this.gameState());
    }, this.configService.getAutoSaveInterval());

    this.buffInterval = setInterval(() => {
      this.goldenPackageService.tickBuffs(100);
      this.gameStateService.updatePlayTime(100);
      this.eventService.tickEvents(100);
    }, 100);

    this.ppsRecalcInterval = setInterval(() => {
      this.gameActionsService.recalculatePps();
    }, 1000);

    this.goldenPackageService.start();
    this.eventService.start();
  }

  ngOnDestroy(): void {
    clearInterval(this.gameInterval);
    clearInterval(this.saveInterval);
    clearInterval(this.buffInterval);
    clearInterval(this.ppsRecalcInterval);
    this.goldenPackageService.stop();
    this.eventService.stop();
    this.saveService.saveGameState(this.gameState());
  }

  clickPackage(event: MouseEvent): void {
    this.gameActionsService.clickPackage();

    this.isClicking = true;
    setTimeout(() => (this.isClicking = false), 150);

    if (
      this.particles &&
      this.gameState().settings.particleEffects
    ) {
      const rect = (
        event.currentTarget as HTMLElement
      ).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.particles.spawn(
        x,
        y,
        '+' + this.formatNumber(this.effectiveClick())
      );
    }
  }

  buyBuilding(type: string): void {
    this.gameActionsService.buyBuilding(type);
  }

  purchaseUpgrade(id: string): void {
    this.upgradeService.purchaseUpgrade(id);
    this.gameActionsService.recalculatePps();
  }

  clickGolden(): void {
    const buff = this.goldenPackageService.click();
    if (buff) {
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
    }
  }

  popWrinkler(id: number): void {
    this.wrinklerService.pop(id);
  }

  ascend(): void {
    this.prestigeService.ascend();
    this.achievementService.resetAchievements();
    this.showPrestige = false;
  }

  purchaseHeavenly(id: string): void {
    this.prestigeService.purchaseHeavenlyUpgrade(id);
  }

  acceptEvent(): void {
    this.eventService.acceptEvent();
  }

  dismissEvent(): void {
    this.eventService.dismissEvent();
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
  }

  resetGame(): void {
    if (
      confirm(
        'Are you sure you want to reset? This cannot be undone!'
      )
    ) {
      this.gameActionsService.resetGame();
    }
  }
}
