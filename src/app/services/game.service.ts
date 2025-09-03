import { Injectable } from '@angular/core';
import { GameState, Achievement, Building } from '../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameState: GameState = {
    packages: 0,
    packagesPerSecond: 0,
    packagesPerClick: 1,
    buildings: {
      cursor: { count: 0, basePrice: 15, pps: 1 },
      grandma: { count: 0, basePrice: 100, pps: 8 },
      farm: { count: 0, basePrice: 1100, pps: 47 },
      mine: { count: 0, basePrice: 12000, pps: 260 },
      factory: { count: 0, basePrice: 130000, pps: 1400 },
      bank: { count: 0, basePrice: 1400000, pps: 7800 },
      warehouse: { count: 0, basePrice: 20000000, pps: 44000 },
      airport: { count: 0, basePrice: 330000000, pps: 260000 },
      spaceport: { count: 0, basePrice: 5100000000, pps: 1600000 },
      ceo: { count: 0, basePrice: 75000000000, pps: 10000000 }
    },
    achievements: [],
    totalPackagesClicked: 0,
    totalPackagesEarned: 0
  };

  private achievementDefinitions: Achievement[] = [
    { id: 'first_package', name: 'First Package!', description: 'Ship your first package', requirement: 1, type: 'packages' },
    { id: 'hundred_packages', name: 'Century Delivery', description: 'Ship 100 packages', requirement: 100, type: 'packages' },
    { id: 'thousand_packages', name: 'Millennium Express', description: 'Ship 1,000 packages', requirement: 1000, type: 'packages' },
    { id: 'first_truck', name: 'Fleet Starter', description: 'Buy your first delivery truck', requirement: 1, type: 'cursor' },
    { id: 'ten_trucks', name: 'Truck Fleet', description: 'Own 10 delivery trucks', requirement: 10, type: 'cursor' },
    { id: 'first_facility', name: 'Industrial Growth', description: 'Build your first sorting facility', requirement: 1, type: 'grandma' },
    { id: 'first_warehouse', name: 'Storage Empire', description: 'Build your first mega warehouse', requirement: 1, type: 'warehouse' },
    { id: 'first_airport', name: 'Sky High Logistics', description: 'Build your first international airport', requirement: 1, type: 'airport' },
    { id: 'first_spaceport', name: 'To Infinity and Beyond', description: 'Build your first space delivery port', requirement: 1, type: 'spaceport' },
    { id: 'first_ceo', name: 'Executive Decision', description: 'Hire Frederic W Smith himself!', requirement: 1, type: 'ceo' },
    { id: 'fast_clicker', name: 'Speed Demon', description: 'Click 100 times', requirement: 100, type: 'clicks' },
    { id: 'million_packages', name: 'Million Mile Delivery', description: 'Ship 1,000,000 packages', requirement: 1000000, type: 'packages' }
  ];

  constructor() {
    this.loadGameState();
    this.updatePackagesPerSecond();
    // Initial check without caring about new achievements
    this.checkAchievements();
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  getAchievements(): Achievement[] {
    return this.achievementDefinitions.map(achievement => ({
      ...achievement,
      unlocked: this.gameState.achievements.includes(achievement.id)
    }));
  }

  clickPackage(): Achievement[] {
    this.gameState.packages += this.gameState.packagesPerClick;
    this.gameState.totalPackagesClicked++;
    this.gameState.totalPackagesEarned += this.gameState.packagesPerClick;
    return this.checkAchievements();
  }

  generatePackages(): Achievement[] {
    const newAchievements: Achievement[] = [];
    if (this.gameState.packagesPerSecond > 0) {
      const packagesToAdd = this.gameState.packagesPerSecond / 10;
      this.gameState.packages += packagesToAdd;
      this.gameState.totalPackagesEarned += packagesToAdd;
      
      if (Math.random() < 0.1) {
        newAchievements.push(...this.checkAchievements());
      }
    }
    return newAchievements;
  }

  buyBuilding(buildingType: string): Achievement[] {
    const building = this.gameState.buildings[buildingType as keyof typeof this.gameState.buildings];
    const price = this.getBuildingPrice(buildingType);
    
    if (this.gameState.packages >= price) {
      this.gameState.packages -= price;
      building.count++;
      this.updatePackagesPerSecond();
      return this.checkAchievements();
    }
    return [];
  }

  getBuildingPrice(buildingType: string): number {
    const building = this.gameState.buildings[buildingType as keyof typeof this.gameState.buildings];
    return Math.floor(building.basePrice * Math.pow(1.15, building.count));
  }

  private updatePackagesPerSecond(): void {
    this.gameState.packagesPerSecond = 0;
    Object.values(this.gameState.buildings).forEach(building => {
      this.gameState.packagesPerSecond += building.count * building.pps;
    });
  }

  private checkAchievements(): Achievement[] {
    const newAchievements: Achievement[] = [];
    
    this.achievementDefinitions.forEach(achievement => {
      if (!this.gameState.achievements.includes(achievement.id)) {
        let earned = false;
        
        switch (achievement.type) {
          case 'packages':
            earned = this.gameState.totalPackagesEarned >= achievement.requirement;
            break;
          case 'clicks':
            earned = this.gameState.totalPackagesClicked >= achievement.requirement;
            break;
          default:
            if (achievement.type in this.gameState.buildings) {
              const building = this.gameState.buildings[achievement.type as keyof typeof this.gameState.buildings];
              earned = building.count >= achievement.requirement;
            }
            break;
        }
        
        if (earned) {
          this.gameState.achievements.push(achievement.id);
          newAchievements.push(achievement);
        }
      }
    });
    
    return newAchievements;
  }

  formatNumber(num: number): string {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
  }

  saveGameState(): void {
    localStorage.setItem('packageClickerSave', JSON.stringify(this.gameState));
  }

  private loadGameState(): void {
    const saved = localStorage.getItem('packageClickerSave');
    if (saved) {
      try {
        const loadedState = JSON.parse(saved);
        this.gameState = { ...this.gameState, ...loadedState };
      } catch (e) {
        console.warn('Could not load save data');
      }
    }
  }

  resetGame(): void {
    localStorage.removeItem('packageClickerSave');
    this.gameState = {
      packages: 0,
      packagesPerSecond: 0,
      packagesPerClick: 1,
      buildings: {
        cursor: { count: 0, basePrice: 15, pps: 1 },
        grandma: { count: 0, basePrice: 100, pps: 8 },
        farm: { count: 0, basePrice: 1100, pps: 47 },
        mine: { count: 0, basePrice: 12000, pps: 260 },
        factory: { count: 0, basePrice: 130000, pps: 1400 },
        bank: { count: 0, basePrice: 1400000, pps: 7800 },
        warehouse: { count: 0, basePrice: 20000000, pps: 44000 },
        airport: { count: 0, basePrice: 330000000, pps: 260000 },
        spaceport: { count: 0, basePrice: 5100000000, pps: 1600000 },
        ceo: { count: 0, basePrice: 75000000000, pps: 10000000 }
      },
      achievements: [],
      totalPackagesClicked: 0,
      totalPackagesEarned: 0
    };
    this.updatePackagesPerSecond();
  }
}