import { Injectable, inject, signal, computed } from '@angular/core';
import { GameStateService } from './game-state.service';
import { CONTRACT_DEFINITIONS, ContractConfig } from '../config/contracts.config';
import { ActiveContract } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private gs = inject(GameStateService);

  readonly activeContracts = computed(
    () => this.gs.gameState().activeContracts
  );
  readonly completedContractCount = computed(
    () => this.gs.gameState().totalContractsCompleted
  );
  readonly boardRefreshTimer = signal(600000);
  readonly contractResult = signal<{
    success: boolean;
    reward: number;
  } | null>(null);

  private packagesAtAccept: Record<number, number> = {};

  refreshBoard(): void {
    const pps = this.gs.gameState().packagesPerSecond;
    const eligible = CONTRACT_DEFINITIONS.filter(
      (c) => !c.minPps || pps >= c.minPps
    );
    const picked = this.pickWeightedRandom(eligible, 3);
    const contracts = picked.map((c) => this.toActive(c));
    this.gs.updateContracts(contracts);
    this.boardRefreshTimer.set(600000);
    this.packagesAtAccept = {};
  }

  acceptContract(slot: number): void {
    const contracts = [...this.activeContracts()];
    if (!contracts[slot] || contracts[slot].accepted) return;
    contracts[slot] = { ...contracts[slot], accepted: true };
    this.gs.updateContracts(contracts);
    this.packagesAtAccept[slot] = this.gs.gameState().totalPackagesEarned;
  }

  refreshSlot(slot: number): void {
    if (!this.gs.spendExpressPoints(5)) return;
    const pps = this.gs.gameState().packagesPerSecond;
    const eligible = CONTRACT_DEFINITIONS.filter(
      (c) => !c.minPps || pps >= c.minPps
    );
    const current = this.activeContracts();
    const usedIds = current.map((c) => c.configId);
    const pool = eligible.filter((c) => !usedIds.includes(c.id));
    if (pool.length === 0) return;
    const picked = this.pickWeightedRandom(pool, 1);
    const contracts = [...current];
    contracts[slot] = this.toActive(picked[0]);
    this.gs.updateContracts(contracts);
  }

  tickContracts(deltaMs: number): void {
    this.tickBoardTimer(deltaMs);
    this.tickActiveTimers(deltaMs);
    this.tickPpsContracts();
    this.tickEarnContracts();
  }

  recordAction(type: string, amount: number): void {
    const contracts = this.activeContracts();
    let updated = false;
    const next = contracts.map((c, i) => {
      if (!c.accepted || c.type !== type) return c;
      if (type === 'reach_pps' || type === 'earn_packages') return c;
      const progress = Math.min(c.progress + amount, c.target);
      updated = true;
      if (progress >= c.target) {
        this.completeAtIndex(i, c);
        return { ...c, progress: c.target };
      }
      return { ...c, progress };
    });
    if (updated) this.gs.updateContracts(next);
  }

  private tickBoardTimer(deltaMs: number): void {
    const remaining = this.boardRefreshTimer() - deltaMs;
    if (remaining <= 0) {
      this.refreshBoard();
    } else {
      this.boardRefreshTimer.set(remaining);
    }
  }

  private tickActiveTimers(deltaMs: number): void {
    const contracts = this.activeContracts();
    let changed = false;
    const next = contracts.map((c, i) => {
      if (!c.accepted) return c;
      const remaining = c.remainingMs - deltaMs;
      if (remaining <= 0) {
        changed = true;
        this.failAtIndex(i);
        return { ...c, remainingMs: 0 };
      }
      if (remaining !== c.remainingMs) changed = true;
      return { ...c, remainingMs: remaining };
    });
    if (changed) this.gs.updateContracts(next);
  }

  private tickPpsContracts(): void {
    const contracts = this.activeContracts();
    const pps = this.gs.gameState().packagesPerSecond;
    let changed = false;
    const next = contracts.map((c, i) => {
      if (!c.accepted || c.type !== 'reach_pps') return c;
      if (pps >= c.target && c.progress < c.target) {
        changed = true;
        this.completeAtIndex(i, c);
        return { ...c, progress: c.target };
      }
      if (pps !== c.progress) {
        changed = true;
        return { ...c, progress: Math.min(pps, c.target) };
      }
      return c;
    });
    if (changed) this.gs.updateContracts(next);
  }

  private tickEarnContracts(): void {
    const contracts = this.activeContracts();
    const totalEarned = this.gs.gameState().totalPackagesEarned;
    let changed = false;
    const next = contracts.map((c, i) => {
      if (!c.accepted || c.type !== 'earn_packages') return c;
      const base = this.packagesAtAccept[i] ?? totalEarned;
      const earned = Math.max(0, totalEarned - base);
      const progress = Math.min(earned, c.target);
      if (progress >= c.target && c.progress < c.target) {
        changed = true;
        this.completeAtIndex(i, c);
        return { ...c, progress: c.target };
      }
      if (progress !== c.progress) {
        changed = true;
        return { ...c, progress };
      }
      return c;
    });
    if (changed) this.gs.updateContracts(next);
  }

  private completeAtIndex(
    _index: number,
    contract: ActiveContract
  ): void {
    this.gs.completeContract(contract.configId);
    this.gs.addExpressPoints(contract.reward.expressPoints);
    this.contractResult.set({
      success: true,
      reward: contract.reward.expressPoints,
    });
    setTimeout(() => this.contractResult.set(null), 3000);
  }

  private failAtIndex(_index: number): void {
    this.contractResult.set({ success: false, reward: 0 });
    setTimeout(() => this.contractResult.set(null), 3000);
  }

  private toActive(config: ContractConfig): ActiveContract {
    return {
      configId: config.id,
      type: config.type,
      name: config.name,
      icon: config.icon,
      description: config.description,
      target: config.target,
      progress: 0,
      accepted: false,
      remainingMs: config.durationMs,
      totalMs: config.durationMs,
      reward: { expressPoints: config.reward.expressPoints },
    };
  }

  private pickWeightedRandom(
    pool: ContractConfig[],
    count: number
  ): ContractConfig[] {
    const result: ContractConfig[] = [];
    const remaining = [...pool];
    for (let i = 0; i < count && remaining.length > 0; i++) {
      const totalW = remaining.reduce((s, c) => s + c.weight, 0);
      let roll = Math.random() * totalW;
      let picked = remaining[0];
      for (const c of remaining) {
        roll -= c.weight;
        if (roll <= 0) { picked = c; break; }
      }
      result.push(picked);
      const idx = remaining.indexOf(picked);
      remaining.splice(idx, 1);
    }
    return result;
  }
}
