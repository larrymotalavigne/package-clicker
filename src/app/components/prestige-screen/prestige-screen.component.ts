import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { HeavenlyUpgradeConfig, PrestigeState } from '../../models/game.models';

@Component({
  selector: 'app-prestige-screen',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay">
      <div class="prestige-panel">
        <div class="prestige-header">
          <h2>Ascension</h2>
          <button class="close-btn" (click)="closeScreen.emit()">x</button>
        </div>

        <div class="prestige-info">
          <div class="info-row">
            <span>Current Level</span>
            <span class="gold">{{ prestige.level }}</span>
          </div>
          <div class="info-row">
            <span>Heavenly Points</span>
            <span class="gold">{{ prestige.points }}</span>
          </div>
          @if (pendingGain > 0) {
            <div class="info-row">
              <span>Points on ascension</span>
              <span class="green">+{{ pendingGain }}</span>
            </div>
          }
          <div class="info-row">
            <span>Prestige bonus</span>
            <span>+{{ prestige.level }}% CpS</span>
          </div>
        </div>

        <div class="upgrade-tree">
          @for (u of upgrades; track u.id) {
            <div
              class="hv-upgrade"
              [class.purchased]="isPurchased(u.id)"
              [class.available]="
                canAfford(u) && hasReqs(u) && !isPurchased(u.id)
              "
              [class.locked]="
                !hasReqs(u) && !isPurchased(u.id)
              "
              [style.left]="getX(u)"
              [style.top]="getY(u)"
              [title]="u.name + ': ' + u.description + ' (Cost: ' + u.price + ')'"
              (click)="onPurchase(u)"
            >
              {{ u.icon }}
            </div>
          }
        </div>

        <button
          class="ascend-btn"
          [disabled]="pendingGain <= 0"
          (click)="onAscend()"
        >
          Ascend (+{{ pendingGain }} points)
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 20, 0.9);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: overlayFadeIn 0.2s ease-out;
      }
      .prestige-panel {
        background: linear-gradient(180deg, #0d0d2b, #1a1a3e);
        border: 1px solid rgba(255, 215, 0, 0.2);
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        color: #e0e0e0;
        padding: 20px;
        animation: prestigeZoomIn 0.4s ease-out;
      }
      @keyframes overlayFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes prestigeZoomIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .prestige-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .prestige-header h2 {
        margin: 0;
        color: #ffd700;
        font-size: 1.4em;
      }
      .close-btn {
        background: none;
        border: none;
        color: #888;
        font-size: 1.2em;
        cursor: pointer;
      }
      .prestige-info {
        margin-bottom: 20px;
      }
      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        font-size: 0.9em;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      .gold {
        color: #ffd700;
        font-weight: 700;
      }
      .green {
        color: #7cc576;
        font-weight: 700;
      }
      .upgrade-tree {
        position: relative;
        height: 400px;
        margin: 20px 0;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        overflow: auto;
      }
      .hv-upgrade {
        position: absolute;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3em;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        transform: translate(-50%, -50%);
      }
      .hv-upgrade.purchased {
        background: rgba(255, 215, 0, 0.25);
        border: 2px solid #ffd700;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
      }
      .hv-upgrade.available {
        background: rgba(255, 215, 0, 0.1);
        border: 2px solid rgba(255, 215, 0, 0.5);
      }
      .hv-upgrade.available:hover {
        background: rgba(255, 215, 0, 0.2);
        transform: translate(-50%, -50%) scale(1.1);
      }
      .hv-upgrade.locked {
        background: rgba(255, 255, 255, 0.04);
        border: 2px solid rgba(255, 255, 255, 0.1);
        opacity: 0.4;
      }
      .ascend-btn {
        display: block;
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #ffd700, #ffaa00);
        border: none;
        border-radius: 8px;
        color: #1a1a2e;
        font-weight: 700;
        font-size: 1.1em;
        cursor: pointer;
        font-family: inherit;
        transition: opacity 0.2s;
      }
      .ascend-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .ascend-btn:not(:disabled):hover {
        filter: brightness(1.1);
      }
    `,
  ],
})
export class PrestigeScreenComponent {
  @Input() prestige!: PrestigeState;
  @Input() pendingGain: number = 0;
  @Input() upgrades: HeavenlyUpgradeConfig[] = [];
  @Output() closeScreen = new EventEmitter<void>();
  @Output() ascend = new EventEmitter<void>();
  @Output() purchaseUpgrade = new EventEmitter<string>();

  isPurchased(id: string): boolean {
    return this.prestige.heavenlyUpgrades.includes(id);
  }

  canAfford(u: HeavenlyUpgradeConfig): boolean {
    return this.prestige.points >= u.price;
  }

  hasReqs(u: HeavenlyUpgradeConfig): boolean {
    return u.requires.every((r) =>
      this.prestige.heavenlyUpgrades.includes(r)
    );
  }

  getX(u: HeavenlyUpgradeConfig): string {
    return `calc(50% + ${u.position.x * 60}px)`;
  }

  getY(u: HeavenlyUpgradeConfig): string {
    return `${30 + u.position.y * 36}px`;
  }

  onPurchase(u: HeavenlyUpgradeConfig): void {
    if (
      !this.isPurchased(u.id) &&
      this.canAfford(u) &&
      this.hasReqs(u)
    ) {
      this.purchaseUpgrade.emit(u.id);
    }
  }

  onAscend(): void {
    if (
      this.pendingGain > 0 &&
      confirm(
        'Are you sure? This will reset your buildings, packages, and upgrades!'
      )
    ) {
      this.ascend.emit();
    }
  }
}
