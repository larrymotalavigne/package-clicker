import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingConfig, Building } from '../../models/game.models';

@Component({
  selector: 'app-building-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="store-item"
         [class.affordable]="affordable"
         (click)="onBuildingClick()">
      <div class="item-icon">{{ building.icon }}</div>
      <div class="item-info">
        <div class="item-name">{{ building.name }}</div>
        <div class="item-description">{{ building.description }}</div>
        <div class="item-stats">
          <span class="item-count">{{ buildingData.count }}</span> owned |
          <span class="item-production">+{{ buildingData.pps }} pps each</span>
        </div>
      </div>
      <div class="item-price">{{ formattedPrice }}</div>
    </div>
  `,
  styleUrl: './building-card.component.css'
})
export class BuildingCardComponent {
  @Input() building!: BuildingConfig;
  @Input() buildingData!: Building;
  @Input() affordable: boolean = false;
  @Input() formattedPrice: string = '';
  
  @Output() buildingClick = new EventEmitter<string>();

  onBuildingClick(): void {
    this.buildingClick.emit(this.building.id);
  }
}