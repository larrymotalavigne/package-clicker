import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
      [class.just-bought]="justBought"
      (click)="onBuildingClick()"
    >
      <div class="building-icon">{{ building.icon }}</div>
      <div class="building-info">
        <div class="building-name">{{ building.name }}</div>
        <div class="building-price">{{ formattedPrice }}</div>
      </div>
      @if (buildingData.count > 0) {
        <div class="building-count" [class.count-bounce]="justBought">
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
        overflow: hidden;
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
      .building-row.just-bought::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 215, 0, 0.15),
          transparent
        );
        animation: purchaseFlash 0.4s ease-out forwards;
      }
      .building-row.affordable:hover {
        background-image: linear-gradient(
          90deg,
          transparent,
          rgba(255, 215, 0, 0.04),
          transparent
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s linear infinite;
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
      .building-count.count-bounce {
        animation: countBounce 0.3s ease-out;
      }
      @keyframes countBounce {
        0% {
          transform: scale(1);
        }
        40% {
          transform: scale(1.4);
          color: rgba(255, 215, 0, 0.6);
        }
        100% {
          transform: scale(1);
        }
      }
      @keyframes purchaseFlash {
        0% {
          opacity: 1;
          transform: translateX(-100%);
        }
        100% {
          opacity: 0;
          transform: translateX(100%);
        }
      }
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `,
  ],
})
export class BuildingCardComponent implements OnChanges {
  @Input() building!: BuildingConfig;
  @Input() buildingData!: Building;
  @Input() affordable: boolean = false;
  @Input() formattedPrice: string = '';

  @Output() buildingClick = new EventEmitter<string>();

  justBought = false;
  private lastCount = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingData']) {
      const newCount = this.buildingData?.count ?? 0;
      if (this.lastCount > 0 && newCount > this.lastCount) {
        this.justBought = true;
        setTimeout(() => (this.justBought = false), 400);
      }
      this.lastCount = newCount;
    }
  }

  onBuildingClick(): void {
    this.buildingClick.emit(this.building.id);
  }
}
