import { Injectable, signal } from '@angular/core';

export interface TooltipData {
  title: string;
  description: string;
  extra?: string;
  x: number;
  y: number;
}

@Injectable({ providedIn: 'root' })
export class TooltipService {
  readonly tooltip = signal<TooltipData | null>(null);

  show(data: TooltipData): void {
    this.tooltip.set(data);
  }

  hide(): void {
    this.tooltip.set(null);
  }
}
