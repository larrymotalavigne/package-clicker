import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private gameStateService = inject(GameStateService);
  private audioCtx: AudioContext | null = null;

  private getCtx(): AudioContext | null {
    if (!this.gameStateService.gameState().settings.soundEnabled) return null;
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  playClick(): void {
    this.playTone(800, 0.05, 0.1);
  }

  playPurchase(): void {
    this.playTone(440, 0.08, 0.15);
    setTimeout(() => this.playTone(660, 0.06, 0.1), 80);
  }

  playUpgrade(): void {
    this.playTone(523, 0.06, 0.1);
    setTimeout(() => this.playTone(659, 0.06, 0.1), 60);
    setTimeout(() => this.playTone(784, 0.06, 0.15), 120);
  }

  playAchievement(): void {
    this.playTone(523, 0.08, 0.2);
    setTimeout(() => this.playTone(659, 0.08, 0.15), 100);
    setTimeout(() => this.playTone(784, 0.08, 0.15), 200);
    setTimeout(() => this.playTone(1047, 0.1, 0.3), 300);
  }

  playGolden(): void {
    this.playTone(880, 0.1, 0.2);
    setTimeout(() => this.playTone(1108, 0.08, 0.15), 100);
    setTimeout(() => this.playTone(1318, 0.08, 0.2), 200);
  }

  playEvent(): void {
    this.playTone(392, 0.1, 0.2);
    setTimeout(() => this.playTone(494, 0.08, 0.15), 120);
  }

  playLootDrop(): void {
    this.playTone(1047, 0.06, 0.1);
    setTimeout(() => this.playTone(784, 0.06, 0.1), 50);
    setTimeout(() => this.playTone(1047, 0.08, 0.15), 100);
    setTimeout(() => this.playTone(1318, 0.1, 0.3), 180);
  }

  playChallengeComplete(): void {
    this.playTone(523, 0.08, 0.15);
    setTimeout(() => this.playTone(659, 0.08, 0.1), 80);
    setTimeout(() => this.playTone(784, 0.08, 0.1), 160);
    setTimeout(() => this.playTone(1047, 0.12, 0.3), 240);
    setTimeout(() => this.playTone(1318, 0.12, 0.4), 340);
  }

  playChallengeFail(): void {
    this.playTone(350, 0.1, 0.2);
    setTimeout(() => this.playTone(280, 0.12, 0.3), 150);
  }

  private playTone(freq: number, vol: number, dur: number): void {
    const ctx = this.getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  }
}
