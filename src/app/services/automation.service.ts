import { Injectable, computed, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { AUTOMATION_RULES } from '../config/automation.config';
import { AutomationRule } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class AutomationService {
  private gameStateService = inject(GameStateService);
  private tickCounters: Record<string, number> = {};

  readonly unlockedRules = computed(
    () => this.gameStateService.gameState().unlockedAutomation
  );

  readonly enabledRules = computed(
    () => this.gameStateService.gameState().enabledAutomation
  );

  getAllRules(): AutomationRule[] {
    return AUTOMATION_RULES;
  }

  allUnlocked(): boolean {
    return AUTOMATION_RULES.length === this.unlockedRules().length;
  }

  isUnlocked(ruleId: string): boolean {
    return this.unlockedRules().includes(ruleId);
  }

  isEnabled(ruleId: string): boolean {
    return this.enabledRules().includes(ruleId);
  }

  unlockRule(ruleId: string): boolean {
    const rule = AUTOMATION_RULES.find((r) => r.id === ruleId);
    if (!rule) return false;
    if (this.isUnlocked(ruleId)) return false;

    const spent = this.gameStateService.spendExpressPoints(rule.epCost);
    if (!spent) return false;

    this.gameStateService.updateAutomation(
      [...this.unlockedRules(), ruleId],
      this.enabledRules()
    );
    return true;
  }

  toggleRule(ruleId: string): void {
    if (!this.isUnlocked(ruleId)) return;

    const current = this.enabledRules();
    const newEnabled = current.includes(ruleId)
      ? current.filter((id) => id !== ruleId)
      : [...current, ruleId];

    this.gameStateService.updateAutomation(
      this.unlockedRules(),
      newEnabled
    );
  }

  shouldTick(
    ruleId: string,
    deltaMs: number,
    intervalMs: number
  ): boolean {
    const counter = (this.tickCounters[ruleId] || 0) + deltaMs;
    if (counter >= intervalMs) {
      this.tickCounters[ruleId] = counter - intervalMs;
      return true;
    }
    this.tickCounters[ruleId] = counter;
    return false;
  }

  resetCounters(): void {
    this.tickCounters = {};
  }
}
