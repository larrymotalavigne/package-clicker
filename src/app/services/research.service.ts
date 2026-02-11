import { Injectable, computed, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { RESEARCH_NODES } from '../config/research.config';
import { ResearchNode } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class ResearchService {
  private readonly nodes = RESEARCH_NODES;

  private gameStateService = inject(GameStateService);

  readonly activeResearch = computed(
    () => this.gameStateService.gameState().activeResearch
  );

  readonly completedResearch = computed(
    () => this.gameStateService.gameState().completedResearch
  );

  isCompleted(id: string): boolean {
    return this.completedResearch().includes(id);
  }

  canStart(node: ResearchNode): boolean {
    if (this.isCompleted(node.id)) return false;
    if (this.activeResearch() !== null) return false;
    const completed = this.completedResearch();
    const hasReqs = node.requires.every((r) => completed.includes(r));
    if (!hasReqs) return false;
    const state = this.gameStateService.gameState();
    return state.expressPoints >= node.cost.ep;
  }

  startResearch(node: ResearchNode): boolean {
    if (!this.canStart(node)) return false;
    const spent = this.gameStateService.spendExpressPoints(node.cost.ep);
    if (!spent) return false;
    this.gameStateService.updateResearch({
      nodeId: node.id,
      remainingMs: node.cost.timeMs,
      totalMs: node.cost.timeMs,
    });
    return true;
  }

  tickResearch(deltaMs: number): void {
    const active = this.activeResearch();
    if (!active) return;
    const remaining = active.remainingMs - deltaMs;
    if (remaining <= 0) {
      this.gameStateService.completeResearch(active.nodeId);
      return;
    }
    this.gameStateService.updateResearch({
      ...active,
      remainingMs: remaining,
    });
  }

  getNodeById(id: string): ResearchNode | undefined {
    return this.nodes.find((n) => n.id === id);
  }

  getGlobalMultiplier(): number {
    return this.aggregateEffect('global_multiplier');
  }

  getClickMultiplier(): number {
    return this.aggregateEffect('click_multiplier');
  }

  getEpMultiplier(): number {
    return this.aggregateEffect('express_point_mult');
  }

  getGoldenFreqMultiplier(): number {
    return this.aggregateEffect('golden_frequency');
  }

  getOfflineMultiplier(): number {
    return this.aggregateEffect('offline_mult');
  }

  private aggregateEffect(type: string): number {
    const completed = this.completedResearch();
    let mult = 1;
    for (const nodeId of completed) {
      const node = this.nodes.find((n) => n.id === nodeId);
      if (!node) continue;
      for (const e of node.effects) {
        if (e.type === type) {
          mult *= e.value;
        }
      }
    }
    return mult;
  }
}
