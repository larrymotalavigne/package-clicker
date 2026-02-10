import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { GameEvent } from '../../models/game.models';

@Component({
  selector: 'app-event-popup',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="event-popup" [class]="'event-' + event.type">
      <div class="event-icon">{{ event.icon }}</div>
      <div class="event-body">
        <div class="event-name">{{ event.name }}</div>
        <div class="event-desc">{{ event.description }}</div>
      </div>
      <div class="event-actions">
        <button class="event-btn accept" (click)="accept.emit()">Accept</button>
        <button class="event-btn dismiss" (click)="dismiss.emit()">Dismiss</button>
      </div>
    </div>
  `,
  styles: [
    `
      .event-popup {
        position: fixed;
        top: 40px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        border-radius: 10px;
        background: #1a1a2e;
        border: 2px solid rgba(255, 255, 255, 0.15);
        z-index: 1100;
        min-width: 340px;
        max-width: 460px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
        animation: eventSlideIn 0.4s ease-out;
      }
      .event-positive {
        border-color: rgba(124, 197, 118, 0.6);
        box-shadow: 0 8px 30px rgba(124, 197, 118, 0.15);
      }
      .event-negative {
        border-color: rgba(255, 80, 80, 0.6);
        box-shadow: 0 8px 30px rgba(255, 80, 80, 0.15);
      }
      .event-neutral {
        border-color: rgba(100, 180, 255, 0.6);
        box-shadow: 0 8px 30px rgba(100, 180, 255, 0.15);
      }
      .event-icon {
        font-size: 2em;
        flex-shrink: 0;
      }
      .event-body {
        flex: 1;
        min-width: 0;
      }
      .event-name {
        font-weight: 700;
        font-size: 0.95em;
        color: #fff;
        margin-bottom: 2px;
      }
      .event-desc {
        font-size: 0.78em;
        color: rgba(255, 255, 255, 0.6);
        line-height: 1.3;
      }
      .event-actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex-shrink: 0;
      }
      .event-btn {
        padding: 5px 14px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 5px;
        font-size: 0.75em;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.15s;
      }
      .event-btn.accept {
        background: rgba(124, 197, 118, 0.2);
        color: #7cc576;
        border-color: rgba(124, 197, 118, 0.4);
      }
      .event-btn.accept:hover {
        background: rgba(124, 197, 118, 0.35);
      }
      .event-btn.dismiss {
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.5);
      }
      .event-btn.dismiss:hover {
        background: rgba(255, 255, 255, 0.12);
        color: rgba(255, 255, 255, 0.8);
      }
      @keyframes eventSlideIn {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(-30px);
        }
        60% {
          transform: translateX(-50%) translateY(4px);
        }
        100% {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `,
  ],
})
export class EventPopupComponent {
  @Input() event!: GameEvent;
  @Output() accept = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();
}
