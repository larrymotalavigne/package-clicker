import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { LoreEntry } from '../../models/game.models';

@Component({
  selector: 'app-lore-viewer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lore-overlay" (click)="closePanel.emit()">
      <div class="lore-panel" (click)="$event.stopPropagation()">
        <div class="panel-header">
          <h2>\uD83D\uDCDC Story</h2>
          <span class="lore-count">{{ entries.length }} / {{ total }} chapters</span>
          <button class="close-btn" (click)="closePanel.emit()">\u2715</button>
        </div>

        <div class="lore-list">
          @for (entry of entries; track entry.id) {
            <div class="lore-entry" (click)="selectedId = selectedId === entry.id ? '' : entry.id">
              <div class="entry-header">
                <span class="entry-icon">{{ entry.icon }}</span>
                <span class="entry-title">{{ entry.title }}</span>
              </div>
              @if (selectedId === entry.id) {
                <div class="entry-text">{{ entry.text }}</div>
              }
            </div>
          }
          @if (entries.length === 0) {
            <div class="no-lore">No chapters unlocked yet. Keep playing to discover the story!</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lore-overlay {
      position: fixed; inset: 0; z-index: 1500;
      background: rgba(0,0,0,0.7); display: flex;
      align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease-out;
    }
    .lore-panel {
      background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
      border: 1px solid rgba(255,215,0,0.15); border-radius: 12px;
      padding: 24px; max-width: 600px; width: 90%; max-height: 80vh;
      overflow-y: auto; animation: slideIn 0.3s ease-out;
    }
    .panel-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    h2 { color: #ffd700; font-size: 1.2em; flex: 1; }
    .lore-count { color: rgba(255,255,255,0.4); font-size: 0.8em; }
    .close-btn { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 1.2em; cursor: pointer; }
    .lore-entry {
      border: 1px solid rgba(255,215,0,0.1); border-radius: 8px;
      margin-bottom: 8px; cursor: pointer; transition: border-color 0.2s;
    }
    .lore-entry:hover { border-color: rgba(255,215,0,0.3); }
    .entry-header { display: flex; align-items: center; gap: 10px; padding: 12px 16px; }
    .entry-icon { font-size: 1.3em; }
    .entry-title { color: #fff; font-weight: 600; font-size: 0.9em; }
    .entry-text {
      padding: 0 16px 16px; color: rgba(255,255,255,0.65);
      font-size: 0.85em; line-height: 1.6; font-style: italic;
      border-top: 1px solid rgba(255,255,255,0.05); margin-top: -4px; padding-top: 12px;
    }
    .no-lore { text-align: center; color: rgba(255,255,255,0.3); padding: 30px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `],
})
export class LoreViewerComponent {
  @Input() entries: LoreEntry[] = [];
  @Input() total: number = 0;
  @Output() closePanel = new EventEmitter<void>();

  selectedId = '';
}
