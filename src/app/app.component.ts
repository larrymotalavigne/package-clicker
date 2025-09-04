import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from './services/game-state.service';
import { GameActionsService } from './services/game-actions.service';
import { ConfigService } from './services/config.service';
import { AchievementService } from './services/achievement.service';
import { SaveService } from './services/save.service';
import { GameState, Achievement, BuildingConfig, Building } from './models/game.models';
import { BuildingCardComponent } from './components/building-card/building-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BuildingCardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  // Signal-based reactive properties - initialized in ngOnInit
  gameState!: any;
  achievements!: any;
  packagesPerSecond!: any;
  
  private gameInterval!: any;
  private saveInterval!: any;

  constructor(
    private gameStateService: GameStateService,
    private gameActionsService: GameActionsService,
    private configService: ConfigService,
    private achievementService: AchievementService,
    private saveService: SaveService
  ) {
    // Load initial state from save
    const savedState = this.saveService.loadGameState();
    if (savedState) {
      // Apply saved state to game state service
      this.gameStateService.resetState();
      // TODO: Implement proper state restoration
    }

    // Initialize achievements from saved state
    const savedAchievements = savedState?.achievements || [];
    this.achievementService.setUnlockedAchievements(savedAchievements);
  }

  ngOnInit() {
    // Initialize signal-based reactive properties after services are available
    this.gameState = this.gameStateService.gameState;
    this.achievements = this.achievementService.achievements;
    this.packagesPerSecond = this.gameStateService.packagesPerSecond;
    
    // Start auto-generation timer using config service
    this.gameInterval = setInterval(() => {
      this.gameActionsService.generatePassiveIncome();
    }, this.configService.getGameLoopInterval());
    
    // Auto-save using config service interval
    this.saveInterval = setInterval(() => {
      this.saveService.saveGameState(this.gameState());
    }, this.configService.getAutoSaveInterval());
  }

  ngOnDestroy() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    
    // Final save before component destruction
    this.saveService.saveGameState(this.gameState());
  }

  clickPackage() {
    this.gameActionsService.clickPackage();
  }

  buyBuilding(buildingType: string) {
    this.gameActionsService.buyBuilding(buildingType);
  }

  formatNumber(num: number): string {
    return this.configService.formatNumber(num);
  }

  getBuildingPrice(buildingType: string): number {
    return this.gameActionsService.getBuildingPrice(buildingType);
  }

  canAfford(buildingType: string): boolean {
    return this.gameActionsService.canAffordBuilding(buildingType);
  }

  getBuildingConfigs(): BuildingConfig[] {
    return this.configService.getBuildingConfigs();
  }

  getBuildingData(buildingId: string): Building {
    const currentState = this.gameState();
    return currentState.buildings[buildingId as keyof typeof currentState.buildings];
  }

  // Additional methods for enhanced functionality
  getAchievementProgress(): any[] {
    return this.achievementService.getAchievementProgress(this.gameState());
  }

  getTotalBuildingValue(): number {
    return this.gameActionsService.getTotalBuildingValue();
  }

  exportSave(): void {
    const exportData = this.saveService.exportSaveData();
    if (exportData) {
      // Create download link
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `package-clicker-save-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  resetGame(): void {
    if (confirm('Are you sure you want to reset your game? This cannot be undone!')) {
      this.gameActionsService.resetGame();
    }
  }
}