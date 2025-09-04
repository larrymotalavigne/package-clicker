import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { GameState, Achievement, BuildingConfig, Building } from './models/game.models';
import { BUILDING_CONFIGS } from './config/buildings.config';
import { BuildingCardComponent } from './components/building-card/building-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BuildingCardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  gameState!: GameState;
  achievements: Achievement[] = [];
  private gameInterval!: any;
  private saveInterval!: any;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameState = this.gameService.getGameState();
    this.achievements = this.gameService.getAchievements();
    
    // Start auto-generation timer
    this.gameInterval = setInterval(() => {
      this.gameService.generatePackages();
      this.gameState = this.gameService.getGameState();
    }, 100);
    
    // Auto-save every 30 seconds
    this.saveInterval = setInterval(() => {
      this.gameService.saveGameState();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
  }

  clickPackage() {
    this.gameService.clickPackage();
    this.gameState = this.gameService.getGameState();
    this.achievements = this.gameService.getAchievements();
  }

  buyBuilding(buildingType: string) {
    this.gameService.buyBuilding(buildingType);
    this.gameState = this.gameService.getGameState();
  }


  formatNumber(num: number): string {
    return this.gameService.formatNumber(num);
  }

  getBuildingPrice(buildingType: string): number {
    return this.gameService.getBuildingPrice(buildingType);
  }

  canAfford(buildingType: string): boolean {
    return this.gameState.packages >= this.getBuildingPrice(buildingType);
  }

  getBuildingConfigs(): BuildingConfig[] {
    return BUILDING_CONFIGS;
  }

  getBuildingData(buildingId: string): Building {
    return this.gameState.buildings[buildingId as keyof typeof this.gameState.buildings];
  }
}