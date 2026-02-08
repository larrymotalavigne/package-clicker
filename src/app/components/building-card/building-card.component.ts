import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BuildingConfig, Building } from '../../models/game.models';

@Component({
  selector: 'app-building-card',
  standalone: true,
  imports: [],
  template: `
    <div
      class="building-row"
      [class.affordable]="affordable"
      [class.locked]="!affordable"
      (click)="onBuildingClick()"
    >
      <div class="building-icon">{{ building.icon }}</div>
      <div class="building-info">
        <div class="building-name">{{ building.name }}</div>
        <div class="building-price">{{ formattedPrice }}</div>
      </div>
      @if (buildingData.count > 0) {
        <div class="building-count">
          {{ buildingData.count }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .building-row {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        transition: background 0.15s;
        position: relative;
        min-height: 56px;
      }
      .building-row:hover {
        background: rgba(255, 255, 255, 0.06);
      }
      .building-row.affordable {
        opacity: 1;
      }
      .building-row.locked {
        opacity: 0.45;
      }
      .building-icon {
        font-size: 1.6em;
        width: 40px;
        text-align: center;
        flex-shrink: 0;
      }
      .building-info {
        flex: 1;
        min-width: 0;
        padding: 0 10px;
      }
      .building-name {
        font-size: 0.85em;
        font-weight: 600;
        color: #e0e0e0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .building-price {
        font-size: 0.75em;
        color: #7cc576;
        margin-top: 2px;
      }
      .locked .building-price {
        color: #c55;
      }
      .building-count {
        font-size: 1.6em;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.2);
        min-width: 50px;
        text-align: right;
        flex-shrink: 0;
      }
    `,
  ],
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
