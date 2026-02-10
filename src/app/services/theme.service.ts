import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private gameStateService = inject(GameStateService);

  init(): void {
    this.applyTheme(this.gameStateService.gameState().settings.theme);
  }

  toggle(): void {
    const current = this.gameStateService.gameState().settings.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    this.gameStateService.updateSettings({ theme: next });
    this.applyTheme(next);
  }

  applyTheme(theme: 'dark' | 'light'): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
