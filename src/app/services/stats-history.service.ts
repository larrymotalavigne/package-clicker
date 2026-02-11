import { Injectable, signal } from '@angular/core';

const MAX_ENTRIES = 60;

@Injectable({ providedIn: 'root' })
export class StatsHistoryService {
  readonly ppsHistory = signal<number[]>([]);
  readonly packagesHistory = signal<number[]>([]);

  record(pps: number, packages: number): void {
    this.ppsHistory.update((h) =>
      [...h, pps].slice(-MAX_ENTRIES),
    );
    this.packagesHistory.update((h) =>
      [...h, packages].slice(-MAX_ENTRIES),
    );
  }

  getPpsHistory(): number[] {
    return this.ppsHistory();
  }

  getPackagesHistory(): number[] {
    return this.packagesHistory();
  }

  getMaxPps(): number {
    return Math.max(1, ...this.ppsHistory());
  }

  getMaxPackages(): number {
    return Math.max(1, ...this.packagesHistory());
  }
}
