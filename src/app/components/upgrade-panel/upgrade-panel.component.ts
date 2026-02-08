import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UpgradeConfig } from '../../models/game.models';

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
              [title]="u.name + ' - ' + u.description + ' (' + u.price + ')'"
              (click)="onPurchase(u)"
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
      }
      .upgrade-icon.affordable {
        opacity: 1;
        border-color: #7cc576;
        background: rgba(124, 197, 118, 0.1);
      }
      .upgrade-icon.affordable:hover {
        background: rgba(124, 197, 118, 0.2);
        transform: scale(1.1);
      }
    `,
  ],
})
export class UpgradePanelComponent {
  @Input() upgrades: UpgradeConfig[] = [];
  @Input() packages: number = 0;
  @Output() purchase = new EventEmitter<string>();

  trackUpgrade(_: number, u: UpgradeConfig): string {
    return u.id;
  }

  onPurchase(u: UpgradeConfig): void {
    if (this.packages >= u.price) {
      this.purchase.emit(u.id);
    }
  }
}
