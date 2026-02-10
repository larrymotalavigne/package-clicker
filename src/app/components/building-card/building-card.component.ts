import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { BuildingConfig, Building } from '../../models/game.models';
import { TooltipService } from '../../services/tooltip.service';
import { ConfigService } from '../../services/config.service';

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
      [class.first-buy]="firstBuy"
      [class.owned]="buildingData.count > 0"
      (click)="onBuildingClick()"
      (mouseenter)="showTooltip($event)"
      (mouseleave)="hideTooltip()"
    >
      <div class="building-icon" [class.icon-wobble]="justBought">
        {{ building.icon }}
      </div>
      <div class="building-info">
        <div class="building-name">{{ building.name }}</div>
        <div class="building-price">{{ formattedPrice }}</div>
      </div>
      @if (buildingData.count > 0) {
        <div class="building-count" [class.count-bounce]="justBought">
          {{ buildingData.count }}
        </div>
      }
      @if (showFloater) {
        <span class="float-text">+1</span>
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
        transition: background 0.15s, opacity 0.3s;
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
      .building-row.first-buy {
        animation: firstBuyEntrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
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
        transition: transform 0.15s;
      }
      .building-icon.icon-wobble {
        animation: iconWobble 0.4s ease-out;
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
      .float-text {
        position: absolute;
        right: 24px;
        top: 40%;
        color: #7cc576;
        font-weight: 700;
        font-size: 1.1em;
        pointer-events: none;
        animation: floatUp 0.8s ease-out forwards;
        text-shadow: 0 0 8px rgba(124, 197, 118, 0.6);
      }
      .owned .building-icon {
        filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.15));
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
      @keyframes iconWobble {
        0% { transform: rotate(0deg) scale(1); }
        20% { transform: rotate(-12deg) scale(1.2); }
        40% { transform: rotate(10deg) scale(1.15); }
        60% { transform: rotate(-6deg) scale(1.05); }
        80% { transform: rotate(3deg) scale(1); }
        100% { transform: rotate(0deg) scale(1); }
      }
      @keyframes firstBuyEntrance {
        0% {
          transform: scale(0.3) translateX(60px);
          opacity: 0;
        }
        60% {
          transform: scale(1.08) translateX(-4px);
          opacity: 1;
        }
        80% {
          transform: scale(0.97) translateX(2px);
        }
        100% {
          transform: scale(1) translateX(0);
        }
      }
      @keyframes floatUp {
        0% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        50% {
          opacity: 0.8;
          transform: translateY(-20px) scale(1.1);
        }
        100% {
          opacity: 0;
          transform: translateY(-40px) scale(0.8);
        }
      }
    `,
  ],
})
export class BuildingCardComponent implements OnChanges {
  private tooltipService = inject(TooltipService);
  private configService = inject(ConfigService);

  @Input() building!: BuildingConfig;
  @Input() buildingData!: Building;
  @Input() affordable: boolean = false;
  @Input() formattedPrice: string = '';

  @Output() buildingClick = new EventEmitter<string>();

  justBought = false;
  firstBuy = false;
  showFloater = false;
  private lastCount = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingData']) {
      const newCount = this.buildingData?.count ?? 0;
      if (this.lastCount === 0 && newCount === 1) {
        this.triggerFirstBuy();
      } else if (this.lastCount > 0 && newCount > this.lastCount) {
        this.triggerBuy();
      }
      this.lastCount = newCount;
    }
  }

  showTooltip(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const prod = this.buildingData.count * this.buildingData.pps;
    const prodLine = this.buildingData.count > 0
      ? `\nEach: ${this.configService.formatNumber(this.building.pps)}/sec — Total: ${this.configService.formatNumber(prod)}/sec`
      : `\nProduces ${this.configService.formatNumber(this.building.pps)} per second each`;
    this.tooltipService.show({
      title: `${this.building.icon} ${this.building.name}`,
      description: `${this.building.description}${prodLine}`,
      extra: `Cost: ${this.formattedPrice} packages`,
      x: Math.max(10, rect.left - 290),
      y: Math.min(rect.top, window.innerHeight - 120),
    });
  }

  hideTooltip(): void {
    this.tooltipService.hide();
  }

  onBuildingClick(): void {
    this.buildingClick.emit(this.building.id);
  }

  private triggerFirstBuy(): void {
    this.firstBuy = true;
    this.justBought = true;
    this.showFloater = true;
    setTimeout(() => { this.firstBuy = false; this.justBought = false; }, 500);
    setTimeout(() => (this.showFloater = false), 800);
  }

  private triggerBuy(): void {
    this.justBought = true;
    this.showFloater = true;
    setTimeout(() => (this.justBought = false), 400);
    setTimeout(() => (this.showFloater = false), 800);
  }
}
