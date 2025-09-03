# Package Clicker Game - Development Guidelines

## Project Overview
This is an Angular-based package clicker game (Package Clicker) with a shipping/logistics theme. The project uses modern Angular 20.x with TypeScript in strict mode and includes comprehensive Docker deployment setup.

## Build/Configuration Instructions

### Prerequisites
- Node.js (compatible with Angular 20.x)
- npm or yarn
- Docker (for containerized deployment)

### Initial Setup
```bash
# Install dependencies
make install
# OR
npm ci --legacy-peer-deps

# Install Playwright browsers for testing
make install-browsers
# OR
npm run test:e2e:install
```

### Build Commands
```bash
# Development build
make build
# OR
npm run build

# Production build
make build-prod
# OR
npm run build:prod

# Watch mode for development
make watch
# OR
npm run watch
```

### Development Server
```bash
# Start development server (http://localhost:4200)
make start
# OR
npm run start
```

### Docker Deployment
```bash
# Build Docker image
make docker-build

# Run with docker-compose (http://localhost:1002)
make docker-run

# Stop container
make docker-stop

# View logs
make docker-logs

# Clean Docker resources
make docker-clean
```

## Testing Information

### Test Framework
The project uses **Playwright** for end-to-end testing with multi-browser support (Chromium, Firefox, WebKit).

### Test Configuration
- Configuration file: `playwright.config.ts`
- Test directory: `tests/`
- Automatic dev server startup during testing
- HTML reporting enabled
- Base URL: `http://localhost:4200`

### Running Tests
```bash
# Run all tests
make test
# OR
npm run test:e2e

# Interactive UI mode
make test-ui
# OR
npm run test:e2e:ui

# Debug mode
make test-debug
# OR
npm run test:e2e:debug

# Headed mode (visible browser)
make test-headed
# OR
npm run test:e2e:headed

# View test reports
make test-report
# OR
npm run test:e2e:report
```

### Adding New Tests
1. Create test files in the `tests/` directory with `.spec.ts` extension
2. Use the existing `tests/game.spec.ts` as a reference
3. Key selectors for testing:
   - Package counter: `#package-count`
   - Main clickable package: `#big-package`
   - Store section: `#store`
   - Store items: `.store-item`
   - Stats section: `#stats`
   - Packages per second: `#pps`

### Example Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    
    // Test implementation
    const element = page.locator('#element-id');
    await expect(element).toBeVisible();
  });
});
```

## Development Information

### Project Structure
```
src/
├── app/
│   ├── app.component.ts        # Main application component
│   ├── app.component.html      # Main UI template
│   ├── services/
│   │   └── game.service.ts     # Core game logic and state management
│   └── models/
│       └── game.models.ts      # TypeScript interfaces and types
├── index.html                  # Application entry point
├── main.ts                     # Angular bootstrap
└── styles.css                  # Global styles
```

### Architecture Notes
- **Single Page Application**: All game logic runs in one main component
- **Service-Based Architecture**: GameService handles all game state and logic
- **Local Storage**: Game state is automatically saved/loaded from localStorage
- **Reactive Updates**: UI updates automatically based on game state changes

### Key Features
- **Click-based gameplay**: Primary interaction through package clicking
- **Building system**: 10 different building types with escalating costs
- **Achievement system**: 11 different achievements with various triggers
- **Auto-save functionality**: Game state persists across sessions
- **Number formatting**: Large numbers display with K/M/B/T suffixes

### Game Logic
- **Buildings**: Each building type has count, basePrice, and packages-per-second (pps)
- **Price scaling**: Building prices increase by 15% per purchase: `basePrice * 1.15^count`
- **Achievements**: Tracked based on packages earned, clicks, or building counts
- **Passive income**: Automatic package generation every 100ms based on total pps

### Code Style Guidelines
- **TypeScript Strict Mode**: Enabled with comprehensive strict compiler options
- **Angular Style Guide**: Follow official Angular coding standards
- **ES2022**: Modern JavaScript features and syntax
- **Descriptive naming**: Clear, self-documenting variable and method names
- **Component isolation**: Single responsibility principle for services and components

### Development Tools
- **Angular CLI**: Primary build and development tool
- **TypeScript 5.8**: With strict type checking
- **Makefile**: Convenient command shortcuts for common tasks
- **Docker**: Production deployment with nginx
- **Playwright**: End-to-end testing framework

### Configuration Files
- `angular.json`: Angular CLI configuration
- `tsconfig.json`: TypeScript compiler configuration (strict mode)
- `package.json`: Dependencies and npm scripts
- `playwright.config.ts`: Test configuration
- `Dockerfile`: Container build instructions
- `docker-compose.yml`: Container orchestration
- `Makefile`: Development command shortcuts

### Debugging Tips
- Use browser developer tools for runtime debugging
- Angular DevTools extension for component inspection
- Playwright debug mode for test troubleshooting
- Check browser console for Angular-specific errors
- Local storage inspection for game state debugging

### Performance Considerations
- Game loop runs every 100ms for passive income generation
- Achievement checking is throttled (10% chance per game loop cycle)
- Number formatting optimized for large values
- Local storage operations are minimal and efficient