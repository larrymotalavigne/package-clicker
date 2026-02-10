import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RareLoot } from '../../models/game.models';

@Component({
  selector: 'app-loot-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loot) {
      <div class="loot-toast" [class]="'rarity-' + loot.rarity">
        <div class="loot-icon">{{ loot.icon }}</div>
        <div class="loot-info">
          <div class="loot-rarity">{{ loot.rarity.toUpperCase() }}</div>
          <div class="loot-name">{{ loot.name }}</div>
          <div class="loot-desc">{{ loot.description }}</div>
        </div>
      </div>
    }
  `,
  styles: [`
    .loot-toast {
      position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 12px;
      padding: 12px 20px; border-radius: 10px; z-index: 2100;
      animation: lootIn 0.4s cubic-bezier(0.34,1.56,0.64,1), lootOut 0.3s ease-in 3.5s forwards;
      box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    }
    .loot-icon { font-size: 2em; }
    .loot-rarity { font-size: 0.65em; letter-spacing: 2px; font-weight: 700; }
    .loot-name { color: #fff; font-weight: 700; font-size: 0.95em; }
    .loot-desc { color: rgba(255,255,255,0.6); font-size: 0.8em; }
    .rarity-common { background: rgba(160,160,160,0.2); border: 1px solid rgba(160,160,160,0.4); }
    .rarity-common .loot-rarity { color: #a0a0a0; }
    .rarity-uncommon { background: rgba(80,200,80,0.15); border: 1px solid rgba(80,200,80,0.4); }
    .rarity-uncommon .loot-rarity { color: #50c850; }
    .rarity-rare { background: rgba(80,140,255,0.15); border: 1px solid rgba(80,140,255,0.4); }
    .rarity-rare .loot-rarity { color: #508cff; }
    .rarity-epic { background: rgba(160,80,255,0.15); border: 1px solid rgba(160,80,255,0.4); }
    .rarity-epic .loot-rarity { color: #a050ff; }
    .rarity-legendary { background: rgba(255,200,0,0.15); border: 1px solid rgba(255,200,0,0.5); }
    .rarity-legendary .loot-rarity { color: #ffc800; }
    @keyframes lootIn {
      from { transform: translateX(-50%) translateY(-30px) scale(0.5); opacity: 0; }
      to { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
    }
    @keyframes lootOut {
      to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
  `],
})
export class LootDisplayComponent {
  @Input() loot: RareLoot | null = null;
}
