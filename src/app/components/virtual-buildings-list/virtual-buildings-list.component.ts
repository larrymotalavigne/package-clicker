import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  signal,
  computed
} from '@angular/core';
import { BuildingConfig, Building } from '../../models/game.models';
import { BuildingCardComponent } from '../building-card/building-card.component';

export interface VirtualItem {
  index: number;
  data: BuildingConfig;
  buildingData: Building;
  top: number;
  height: number;
}

@Component({
  selector: 'app-virtual-buildings-list',
  standalone: true,
  imports: [BuildingCardComponent],
  template: `
    <div
      #scrollContainer
      class="virtual-scroll-container"
      [style.height.px]="containerHeight"
      (scroll)="onScroll()"
      [style.overflow-y]="'auto'"
    >
      <div
        class="virtual-scroll-content"
        [style.height.px]="totalHeight()"
        [style.position]="'relative'"
      >
        @for (item of visibleItems(); track item.index) {
          <div
            class="virtual-item"
            [style.position]="'absolute'"
            [style.top.px]="item.top"
            [style.width]="'100%'"
            [style.height.px]="item.height"
          >
            <app-building-card
              [building]="item.data"
              [buildingData]="item.buildingData"
              [affordable]="getCanAfford(item.data.id)"
              [formattedPrice]="formatPrice(item.data.id)"
              (buildingClick)="onBuyBuilding($event)"
            ></app-building-card>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .virtual-scroll-container {
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
    }

    .virtual-scroll-content {
      min-height: 100%;
    }

    .virtual-item {
      padding: 4px;
      box-sizing: border-box;
    }

    @media (max-width: 768px) {
      .virtual-item {
        padding: 2px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualBuildingsListComponent implements OnInit, OnDestroy {
  @Input() buildingConfigs: BuildingConfig[] = [];
  @Input() buildingData: { [key: string]: Building } = {};
  @Input() containerHeight: number = 400;
  @Input() itemHeight: number = 120;
  @Input() overscan: number = 3; // Number of extra items to render for smooth scrolling

  @Output() buyBuilding = new EventEmitter<string>();

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef<HTMLDivElement>;

  private scrollTop = signal(0);
  private resizeObserver?: ResizeObserver;

  // Computed signals for virtual scrolling
  readonly totalHeight = computed(() => this.buildingConfigs.length * this.itemHeight);
  readonly visibleStartIndex = computed(() =>
    Math.max(0, Math.floor(this.scrollTop() / this.itemHeight) - this.overscan)
  );
  readonly visibleEndIndex = computed(() =>
    Math.min(
      this.buildingConfigs.length - 1,
      Math.ceil((this.scrollTop() + this.containerHeight) / this.itemHeight) + this.overscan
    )
  );
  readonly visibleItems = computed(() => {
    const start = this.visibleStartIndex();
    const end = this.visibleEndIndex();
    const items: VirtualItem[] = [];

    for (let i = start; i <= end; i++) {
      if (i >= 0 && i < this.buildingConfigs.length) {
        const config = this.buildingConfigs[i];
        const building = this.buildingData[config.id];

        items.push({
          index: i,
          data: config,
          buildingData: building,
          top: i * this.itemHeight,
          height: this.itemHeight
        });
      }
    }

    return items;
  });

  // Input getters (to be injected from parent)
  @Input() getBuildingPrice!: (buildingType: string) => number;
  @Input() getCanAfford!: (buildingType: string) => boolean;
  @Input() formatNumber!: (num: number) => string;

  formatPrice(buildingType: string): string {
    return this.formatNumber(this.getBuildingPrice(buildingType));
  }

  ngOnInit() {
    // Set up resize observer to handle container size changes
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          this.containerHeight = entry.contentRect.height;
        }
      });

      this.resizeObserver.observe(this.scrollContainer.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  onScroll(): void {
    if (this.scrollContainer) {
      this.scrollTop.set(this.scrollContainer.nativeElement.scrollTop);
    }
  }

  onBuyBuilding(buildingType: string): void {
    this.buyBuilding.emit(buildingType);
  }

  trackByIndex(index: number, item: VirtualItem): number {
    return item.index;
  }

  // Scroll to specific building
  scrollToBuilding(buildingId: string): void {
    const index = this.buildingConfigs.findIndex(config => config.id === buildingId);
    if (index >= 0) {
      const targetScrollTop = index * this.itemHeight;
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = targetScrollTop;
        this.scrollTop.set(targetScrollTop);
      }
    }
  }

  // Get visible range info for debugging
  getVisibleRange(): { start: number; end: number; total: number } {
    return {
      start: this.visibleStartIndex(),
      end: this.visibleEndIndex(),
      total: this.buildingConfigs.length
    };
  }

  // Dynamic item height calculation (for future use with variable-height items)
  updateItemHeight(index: number, height: number): void {
    // This would be used if items have different heights
    // For now, we use fixed height for simplicity
    console.log(`Item ${index} height updated to ${height}px`);
  }

  // Smooth scroll to top
  scrollToTop(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  // Smooth scroll to bottom
  scrollToBottom(): void {
    if (this.scrollContainer) {
      const maxScroll = this.totalHeight() - this.containerHeight;
      this.scrollContainer.nativeElement.scrollTo({
        top: maxScroll,
        behavior: 'smooth'
      });
    }
  }
}
