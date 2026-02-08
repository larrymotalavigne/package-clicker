import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSettings } from '../../models/game.models';

@Component({
  selector: 'app-options-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="closePanel.emit()">
      <div class="panel" (click)="$event.stopPropagation()">
        <div class="panel-header">
          <h2>Options</h2>
          <button class="close-btn" (click)="closePanel.emit()">x</button>
        </div>

        <div class="options-body">
          <div class="option-group">
            <h3>Save</h3>
            <div class="option-buttons">
              <button (click)="save.emit()">Save Game</button>
              <button (click)="exportSave.emit()">Export</button>
              <button (click)="onImport()">Import</button>
              <button class="danger" (click)="onWipe()">
                Wipe Save
              </button>
            </div>
          </div>

          <div class="option-group">
            <h3>Display</h3>
            <label class="toggle">
              <input
                type="checkbox"
                [checked]="settings.particleEffects"
                (change)="toggleSetting('particleEffects')"
              />
              Particle Effects
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                [checked]="settings.shortNumbers"
                (change)="toggleSetting('shortNumbers')"
              />
              Short Numbers
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                [checked]="settings.showBuffTimers"
                (change)="toggleSetting('showBuffTimers')"
              />
              Buff Timers
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .panel {
        background: #1a1a2e;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        width: 90%;
        max-width: 400px;
        color: #e0e0e0;
      }
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .panel-header h2 {
        margin: 0;
        font-size: 1.2em;
      }
      .close-btn {
        background: none;
        border: none;
        color: #888;
        font-size: 1.2em;
        cursor: pointer;
        padding: 4px 8px;
      }
      .options-body {
        padding: 16px 20px;
      }
      .option-group {
        margin-bottom: 20px;
      }
      .option-group h3 {
        font-size: 0.85em;
        color: rgba(255, 255, 255, 0.4);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 10px;
      }
      .option-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .option-buttons button {
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 6px;
        color: #e0e0e0;
        cursor: pointer;
        font-size: 0.85em;
        font-family: inherit;
        transition: background 0.15s;
      }
      .option-buttons button:hover {
        background: rgba(255, 255, 255, 0.14);
      }
      .option-buttons button.danger {
        border-color: rgba(255, 80, 80, 0.4);
        color: #ff5050;
      }
      .option-buttons button.danger:hover {
        background: rgba(255, 80, 80, 0.15);
      }
      .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85em;
        padding: 6px 0;
        cursor: pointer;
      }
      .toggle input {
        accent-color: #ffd700;
      }
    `,
  ],
})
export class OptionsPanelComponent {
  @Input() settings!: GameSettings;
  @Output() closePanel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() exportSave = new EventEmitter<void>();
  @Output() importSave = new EventEmitter<string>();
  @Output() wipeSave = new EventEmitter<void>();
  @Output() settingChange = new EventEmitter<Partial<GameSettings>>();

  toggleSetting(key: keyof GameSettings): void {
    this.settingChange.emit({ [key]: !this.settings[key] });
  }

  onImport(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.importSave.emit(reader.result as string);
      };
      reader.readAsText(file);
    };
    input.click();
  }

  onWipe(): void {
    if (
      confirm(
        'Are you sure? This will permanently delete your save!'
      )
    ) {
      this.wipeSave.emit();
    }
  }
}
