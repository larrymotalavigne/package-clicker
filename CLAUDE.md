# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Package Clicker is an Angular 20.x incremental clicker game inspired by Cookie Clicker, with a shipping/logistics theme. Features include 10 buildings, ~60 upgrades, golden packages with buff effects, prestige/ascension system with heavenly upgrades, wrinklers, 100+ achievements, news ticker, stats/options panels, and a dark-themed visual design using CSS-only art. Game state persists via localStorage with save migration support.

## Requirements

- Node.js v20.19+ or v22.12+ (Angular CLI v20 requirement). Use `nvm use 22` if on an older version.

## Commands

```bash
# Install
npm ci --legacy-peer-deps

# Dev server (http://localhost:4200)
npm run start

# Build
npm run build              # development
npm run build:prod         # production

# Unit tests (Jest)
npm run test               # run all
npm run test:watch         # watch mode
npm run test -- --testPathPattern=app.component  # single test file

# E2E tests (Playwright - requires `npm run test:e2e:install` first)
npm run test:e2e           # all browsers
npm run test:e2e:headed    # visible browser
npm run test:e2e:debug     # debug mode

# Lint & format
npm run lint               # ESLint via ng lint
npm run lint:fix           # ESLint with auto-fix
npx eslint src/            # ESLint directly (flat config)
npm run format             # Prettier write
npm run format:check       # Prettier check only
```

A `Makefile` provides shortcuts (e.g., `make test`, `make start`) for all the above.

## Architecture

### Service Layer (all `providedIn: 'root'`, Angular Signals for state, `inject()` pattern)

- **GameStateService** (`services/game-state.service.ts`) - Core state container using `signal()` and `computed()`. Owns the single `GameState` object with all game data (packages, buildings, upgrades, prestige, buffs, settings). All state mutations go through this service.
- **GameActionsService** (`services/game-actions.service.ts`) - Orchestrates player actions (click, buy building, passive income). Implements **batched updates** via `requestAnimationFrame` and click **debouncing** (50ms). Integrates upgrade multipliers, buff multipliers, prestige multipliers, and wrinkler diversion.
- **ConfigService** (`services/config.service.ts`) - Central source of truth for game constants, building configs (from `config/buildings.config.ts`), achievement definitions (from `config/achievements.config.ts`), and number formatting.
- **AchievementService** (`services/achievement.service.ts`) - Achievement tracking with lazy checking. Supports types: `packages`, `clicks`, `pps`, `upgrades`, `golden_clicks`, `prestige`, and per-building.
- **SaveService** (`services/save.service.ts`) - Save/load with checksum validation, v1→v2 migration, legacy achievement mapping, backup management, import/export, and wipe.
- **UpgradeService** (`services/upgrade.service.ts`) - Manages ~60 upgrades with unlock conditions, purchase logic, and multiplier computation (building, click, global, click-PPS-percent).
- **GoldenPackageService** (`services/golden-package.service.ts`) - Random golden package spawning (5-15min intervals), buff effects (Frenzy 7x/77s, Lucky instant, Click Frenzy 777x/13s), buff timer management.
- **PrestigeService** (`services/prestige.service.ts`) - Prestige formula `floor(cbrt(totalEarned / 1e12))`, each level = +1% CpS. 15 heavenly upgrades in tree structure. Ascension resets buildings/packages but keeps prestige.
- **WrinklerService** (`services/wrinkler.service.ts`) - Max 10 wrinklers, each diverts 5% of CPS, popping returns 110% of eaten packages.
- **TooltipService** (`services/tooltip.service.ts`) - Signal-based tooltip data management.

### Data Flow

```
AppComponent (OnPush) -> GameActionsService -> GameStateService (signals)
                                            -> AchievementService
                                            -> ConfigService
                                            -> UpgradeService
                                            -> GoldenPackageService
                                            -> PrestigeService
                                            -> WrinklerService
                                            -> SaveService
```

Game intervals in `AppComponent.ngOnInit()`:
- Game loop: 100ms (`generatePassiveIncome`)
- Buff/play timer: 100ms (`tickBuffs`, `updatePlayTime`)
- PPS recalculation: 1s (`recalculatePps`)
- Auto-save: 30s

### Config Files (`src/app/config/`)

- `buildings.config.ts` - 10 building definitions (id, name, icon, basePrice, pps)
- `achievements.config.ts` - 103+ achievement definitions across all types
- `upgrades.config.ts` - ~58 upgrade definitions (5 tiers per building + click + global)
- `prestige.config.ts` - 15 heavenly upgrades in tree structure
- `news-messages.config.ts` - 50+ context-aware news messages

### Key Types (`models/game.models.ts`)

- `GameState` - Core state: packages, buildings (`Record<BuildingType, Building>`), achievements, purchasedUpgrades, prestige, goldenPackageClicks, wrinklers, settings, activeBuffs, counters
- `BuildingType` (`types/building-types.ts`) - Union type of 10 building IDs
- `UpgradeConfig` - Upgrade definition with effects and requirements
- `PrestigeState` - Prestige level, points, heavenly upgrades, times ascended
- `ActiveBuff` - Frenzy/Click Frenzy/Lucky with multiplier and timer
- `GameSettings` - particleEffects, shortNumbers, showBuffTimers

### Components (all standalone, OnPush)

- **AppComponent** - Main game view. Left panel: news ticker, stats, click area with 3D box, milk bar, action buttons. Right panel: upgrade panel, building store.
- **BuildingCardComponent** - Compact Cookie Clicker-style building row (icon | name+price | count)
- **UpgradePanelComponent** - Horizontal scrollable row of upgrade icons
- **ParticleEffectsComponent** - CSS-animated click feedback particles
- **MilkBarComponent** - Achievement completion percentage bar
- **GoldenPackageComponent** - Random spawn golden package with shimmer animation
- **BuffDisplayComponent** - Active buff timers with progress bars
- **NewsTickerComponent** - Scrolling context-aware news messages
- **TooltipComponent** - Hover tooltips for buildings/upgrades
- **StatsPanelComponent** - Modal with General/Buildings/Achievements tabs
- **OptionsPanelComponent** - Save/export/import/wipe and display settings
- **PrestigeScreenComponent** - Full overlay with heavenly upgrade tree
- **WrinklerComponent** - CSS dark blobs orbiting the package

### Game Mechanics

- Building price formula: `floor(basePrice * 1.15^count)`
- Passive income: `effectivePPS / 10` added every 100ms (with upgrade/buff/prestige multipliers)
- Click value: `packagesPerClick * clickMultiplier * buffMultiplier * prestigeMultiplier + ppsPercent`
- Prestige formula: `floor(cbrt(totalEarnedAllTime / 1e12))`, +1% CpS per level
- Wrinkler diversion: each diverts 5% CPS, returns 110% when popped
- Golden packages: spawn every 5-15min, effects last 13-77s
- Save version: `2.0.0`, localStorage key: `packageClickerSave`

## Testing

- **Unit tests** (`src/app/app.component.spec.ts`): Jest with `jest-preset-angular`. Tests mock all 10 services via `inject()` pattern.
- **E2E tests** (`tests/game.spec.ts`): Playwright across Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari. Dev server auto-starts.
- Key test selectors: `#package-count`, `#big-package`, `#store-items`, `#stats`, `#pps`
- Coverage threshold: 70% (branches, functions, lines, statements)

## Code Style

- TypeScript strict mode with all strict Angular compiler options
- Standalone components only (no NgModules)
- `inject()` function for DI (not constructor injection)
- Angular built-in control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`/`*ngFor`
- Component prefix: `app-` (kebab-case elements, camelCase attribute directives)
- ESLint flat config (`eslint.config.js`): `no-console` (warn, allow warn/error), `complexity` max 10, `max-lines-per-function` 50 (100 in tests), `explicit-function-return-type` (warn)
- CSS-only icons and art — no external image files
- All game data in `src/app/config/` files, logic in services

## Deployment

CI/CD builds a Docker image, pushes to `registry.atomdev.fr/packageclicker`, and deploys via docker-compose to an Unraid server (port 1004). The container uses nginx to serve the static Angular build.
