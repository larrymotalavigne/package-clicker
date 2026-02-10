import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { UpgradeConfig, UpgradeEffect } from '../../models/game.models';
import { TooltipService } from '../../services/tooltip.service';
import { ConfigService } from '../../services/config.service';
import { GameStateService } from '../../services/game-state.service';
import { UpgradeService } from '../../services/upgrade.service';

@Component({
  selector: 'app-upgrade-panel',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (upgrades.length > 0) {
      <div class="upgrade-panel">
        <div class="upgrade-label">Upgrades</div>
        <div class="upgrade-row">
          @for (u of upgrades; track u.id) {
            <div
              class="upgrade-icon"
              [class.affordable]="packages >= u.price"
              [class.purchased-flash]="flashId === u.id"
              (click)="onPurchase(u)"
              (mouseenter)="showTooltip($event, u)"
              (mousemove)="moveTooltip($event)"
              (mouseleave)="hideTooltip()"
            >
              {{ u.icon }}
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .upgrade-panel {
        padding: 8px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .upgrade-label {
        font-size: 0.7em;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.4);
        margin-bottom: 6px;
      }
      .upgrade-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .upgrade-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        cursor: pointer;
        font-size: 1.1em;
        transition: all 0.15s;
        opacity: 0.5;
        animation: upgradeAppear 0.3s ease-out backwards;
      }
      .upgrade-icon.affordable {
        opacity: 1;
        border-color: #7cc576;
        background: rgba(124, 197, 118, 0.1);
      }
      .upgrade-icon.affordable:hover {
        background: rgba(124, 197, 118, 0.25);
        transform: scale(1.15);
        box-shadow: 0 0 10px rgba(124, 197, 118, 0.3);
      }
      .upgrade-icon:not(.affordable):hover {
        opacity: 0.7;
        transform: scale(1.05);
      }
      .upgrade-icon.purchased-flash {
        animation: sparkle 0.3s ease-out;
      }
      @keyframes sparkle {
        0% {
          transform: scale(1);
          filter: brightness(1);
        }
        50% {
          transform: scale(1.2);
          filter: brightness(1.5);
        }
        100% {
          transform: scale(0.8);
          filter: brightness(1);
          opacity: 0;
        }
      }
      @keyframes upgradeAppear {
        from {
          opacity: 0;
          transform: scale(0) rotate(-15deg);
        }
        to {
          opacity: 0.5;
          transform: scale(1) rotate(0deg);
        }
      }
    `,
  ],
})
export class UpgradePanelComponent {
  private tooltipService = inject(TooltipService);
  private configService = inject(ConfigService);
  private gameStateService = inject(GameStateService);
  private upgradeService = inject(UpgradeService);

  @Input() upgrades: UpgradeConfig[] = [];
  @Input() packages: number = 0;
  @Output() purchase = new EventEmitter<string>();

  flashId: string | null = null;

  showTooltip(event: MouseEvent, u: UpgradeConfig): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const affordable = this.packages >= u.price;
    const costLabel = affordable ? 'Cost' : 'Cost (cannot afford)';
    const effectLine = this.formatEffects(u.effects);
    const currencyLabel = u.currency === 'express_points' ? ' EP' : '';
    const desc = `${u.description}\n${effectLine}\n${costLabel}: ${this.configService.formatNumber(u.price)}${currencyLabel}`;
    this.tooltipService.show({
      title: `${u.icon} ${u.name}`,
      description: desc,
      extra: u.flavorText,
      x: Math.min(rect.left, window.innerWidth - 300),
      y: rect.bottom + 8,
    });
  }

  private formatEffects(effects: UpgradeEffect[]): string {
    const state = this.gameStateService.gameState();
    const parts: string[] = [];
    for (const e of effects) {
      switch (e.type) {
        case 'building_multiplier': {
          if (!e.buildingType) break;
          const b = state.buildings[e.buildingType];
          if (b && b.count > 0) {
            const currentMult = this.upgradeService
              .getBuildingMultiplier(e.buildingType);
            const currentPps = b.count * b.pps * currentMult;
            const gain = currentPps * (e.value - 1);
            parts.push(
              `+${this.configService.formatNumber(gain)} PPS`
            );
          } else {
            parts.push(`x${e.value} building output`);
          }
          break;
        }
        case 'click_multiplier':
          parts.push(`x${e.value} click power`);
          break;
        case 'global_multiplier':
          parts.push(`x${e.value} all production`);
          break;
        case 'click_add_pps_percent':
          parts.push(`+${e.value}% of PPS per click`);
          break;
        case 'building_cost_reduction': {
          const pct = Math.round((1 - e.value) * 100);
          parts.push(`-${pct}% building costs`);
          break;
        }
        case 'golden_frequency': {
          const pct = Math.round((1 - e.value) * 100);
          parts.push(`+${pct}% golden packages`);
          break;
        }
        case 'synergy_multiplier': {
          const pct = Math.round((e.value - 1) * 100);
          parts.push(`+${pct}% synergy bonus`);
          break;
        }
        case 'offline_mult': {
          const pct = Math.round(e.value * 100);
          parts.push(`${pct}% offline production`);
          break;
        }
        case 'express_point_mult':
          parts.push(`x${e.value} Express Points`);
          break;
      }
    }
    return parts.length > 0
      ? `Effect: ${parts.join(', ')}`
      : '';
  }

  moveTooltip(event: MouseEvent): void {
    const tip = this.tooltipService.tooltip();
    if (tip) {
      this.tooltipService.show({
        ...tip,
        x: Math.min(event.clientX + 12, window.innerWidth - 300),
        y: event.clientY + 16,
      });
    }
  }

  hideTooltip(): void {
    this.tooltipService.hide();
  }

  onPurchase(u: UpgradeConfig): void {
    if (this.packages >= u.price) {
      this.hideTooltip();
      this.flashId = u.id;
      setTimeout(() => (this.flashId = null), 300);
      this.purchase.emit(u.id);
    }
  }
}
