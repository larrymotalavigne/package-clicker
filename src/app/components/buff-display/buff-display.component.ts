import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ActiveBuff } from '../../models/game.models';

@Component({
  selector: 'app-buff-display',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (buffs.length > 0) {
      <div class="buffs">
        @for (b of buffs; track $index) {
          <div class="buff" [class]="b.type">
            <span class="buff-name">{{ b.name }}</span>
            <span class="buff-timer">{{ formatTime(b.remainingMs) }}</span>
            <div
              class="buff-bar"
              [style.width.%]="(b.remainingMs / b.totalMs) * 100"
            ></div>
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      .buffs {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 8px 0;
      }
      .buff {
        position: relative;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 0.75em;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        color: #fff;
      }
      .buff.frenzy {
        background: rgba(255, 165, 0, 0.2);
        border: 1px solid rgba(255, 165, 0, 0.4);
      }
      .buff.click_frenzy {
        background: rgba(255, 0, 100, 0.2);
        border: 1px solid rgba(255, 0, 100, 0.4);
      }
      .buff.lucky {
        background: rgba(0, 200, 100, 0.2);
        border: 1px solid rgba(0, 200, 100, 0.4);
      }
      .buff-bar {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        opacity: 0.15;
        transition: width 0.1s linear;
      }
      .frenzy .buff-bar {
        background: #ffa500;
      }
      .click_frenzy .buff-bar {
        background: #ff0064;
      }
      .lucky .buff-bar {
        background: #00c864;
      }
      .buff-name {
        position: relative;
        z-index: 1;
      }
      .buff-timer {
        position: relative;
        z-index: 1;
        opacity: 0.7;
      }
    `,
  ],
})
export class BuffDisplayComponent {
  @Input() buffs: ActiveBuff[] = [];

  formatTime(ms: number): string {
    const s = Math.ceil(ms / 1000);
    return s + 's';
  }
}
