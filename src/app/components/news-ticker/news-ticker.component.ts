import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';

import {
  ALL_NEWS_MESSAGES,
  FORTUNE_COOKIES,
  HAIKUS,
  NewsContext,
} from '../../config/news-messages.config';

@Component({
  selector: 'app-news-ticker',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ticker">
      <span class="ticker-label">News:</span>
      <span class="ticker-text">{{ currentMessage() }}</span>
    </div>
  `,
  styles: [
    `
      .ticker {
        display: flex;
        align-items: center;
        padding: 6px 16px;
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        font-size: 0.75em;
        color: rgba(255, 255, 255, 0.6);
        overflow: hidden;
        white-space: nowrap;
      }
      .ticker-label {
        color: rgba(255, 255, 255, 0.3);
        margin-right: 8px;
        flex-shrink: 0;
      }
      .ticker-text {
        animation: tickerSlide 0.5s ease-out;
      }
      @keyframes tickerSlide {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class NewsTickerComponent implements OnInit, OnDestroy {
  @Input() context: NewsContext = {
    packages: 0,
    pps: 0,
    buildings: {},
    totalClicks: 0,
  };

  readonly currentMessage = signal('Welcome to Package Clicker!');
  private interval: ReturnType<typeof setInterval> | null = null;
  private tickCount = 0;

  ngOnInit(): void {
    this.interval = setInterval(() => this.pickMessage(), 10000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  private pickMessage(): void {
    this.tickCount++;

    if (this.tickCount % 5 === 0) {
      const pool = [...FORTUNE_COOKIES, ...HAIKUS];
      const idx = Math.floor(Math.random() * pool.length);
      this.currentMessage.set(pool[idx].text);
      return;
    }

    const eligible = ALL_NEWS_MESSAGES.filter(
      (m) => !m.condition || m.condition(this.context)
    );
    if (eligible.length === 0) return;
    const idx = Math.floor(Math.random() * eligible.length);
    this.currentMessage.set(eligible[idx].text);
  }
}
