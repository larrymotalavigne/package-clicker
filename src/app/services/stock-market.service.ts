import { Injectable, inject, signal, computed } from '@angular/core';
import { StockPrice } from '../models/game.models';
import { STOCK_CONFIGS, StockConfig } from '../config/stock-market.config';
import { GameStateService } from './game-state.service';

@Injectable({ providedIn: 'root' })
export class StockMarketService {
  private gameStateService = inject(GameStateService);

  readonly prices = signal<Map<string, StockPrice>>(new Map());

  readonly portfolioValue = computed(() => {
    return this.computePortfolioValue();
  });

  init(): void {
    const map = new Map<string, StockPrice>();
    for (const cfg of STOCK_CONFIGS) {
      map.set(cfg.buildingId, this.createInitialPrice(cfg));
    }
    this.prices.set(map);
  }

  tickPrices(): void {
    const current = this.prices();
    const updated = new Map<string, StockPrice>();

    for (const cfg of STOCK_CONFIGS) {
      const stock = current.get(cfg.buildingId);
      if (stock) {
        updated.set(cfg.buildingId, this.tickSingleStock(stock, cfg));
      }
    }

    this.prices.set(updated);
  }

  buyStock(buildingId: string, quantity: number): boolean {
    const stock = this.prices().get(buildingId);
    if (!stock || quantity <= 0) return false;

    const totalCost = stock.currentPrice * quantity;
    const state = this.gameStateService.gameState();
    if (state.packages < totalCost) return false;

    this.gameStateService.updatePackages(state.packages - totalCost);
    this.updatePortfolioHoldings(buildingId, quantity);
    return true;
  }

  sellStock(buildingId: string, quantity: number): boolean {
    const holdings = this.getHoldings(buildingId);
    if (holdings < quantity || quantity <= 0) return false;

    const stock = this.prices().get(buildingId);
    if (!stock) return false;

    const revenue = stock.currentPrice * quantity;
    const state = this.gameStateService.gameState();

    this.gameStateService.updatePackages(state.packages + revenue);
    this.updatePortfolioHoldings(buildingId, -quantity);
    this.gameStateService.addStockProfit(revenue);
    return true;
  }

  getHoldings(buildingId: string): number {
    const portfolio = this.gameStateService.gameState().stockPortfolio;
    return portfolio[buildingId] || 0;
  }

  getPortfolioValue(): number {
    return this.computePortfolioValue();
  }

  private createInitialPrice(cfg: StockConfig): StockPrice {
    return {
      buildingId: cfg.buildingId,
      currentPrice: cfg.basePrice,
      previousPrice: cfg.basePrice,
      history: [cfg.basePrice],
      momentum: 0,
    };
  }

  private tickSingleStock(
    stock: StockPrice,
    cfg: StockConfig
  ): StockPrice {
    const newMomentum =
      stock.momentum * 0.9 + (Math.random() - 0.5) * cfg.volatility;
    const newPrice = Math.max(1, stock.currentPrice * (1 + newMomentum));
    const history = [...stock.history, newPrice].slice(-20);

    return {
      buildingId: stock.buildingId,
      currentPrice: newPrice,
      previousPrice: stock.currentPrice,
      history,
      momentum: newMomentum,
    };
  }

  private updatePortfolioHoldings(
    buildingId: string,
    delta: number
  ): void {
    const state = this.gameStateService.gameState();
    const portfolio = { ...state.stockPortfolio };
    const current = portfolio[buildingId] || 0;
    const newCount = Math.max(0, current + delta);

    if (newCount === 0) {
      delete portfolio[buildingId];
    } else {
      portfolio[buildingId] = newCount;
    }

    this.gameStateService.updateStockPortfolio(portfolio);
  }

  private computePortfolioValue(): number {
    const portfolio = this.gameStateService.gameState().stockPortfolio;
    const priceMap = this.prices();
    let total = 0;

    for (const [id, count] of Object.entries(portfolio)) {
      const stock = priceMap.get(id);
      if (stock) {
        total += stock.currentPrice * count;
      }
    }

    return total;
  }
}
