# Package Clicker Game

An Angular-based incremental clicker game with a shipping/logistics theme. Built with modern Angular 20.x, TypeScript in strict mode, and comprehensive testing using Playwright.

## 🎮 Game Features

- **Click-based gameplay**: Primary interaction through package clicking
- **Building system**: 10 different building types with escalating costs
- **Achievement system**: 11 different achievements with various triggers
- **Auto-save functionality**: Game state persists across sessions
- **Number formatting**: Large numbers display with K/M/B/T suffixes
- **Performance optimized**: Smooth gameplay with debouncing and batched updates

## 🚀 Quick Start

### Prerequisites

- Node.js v20.19+ or v22.12+ (for Angular CLI compatibility)
- npm or yarn package manager
- Docker (optional, for containerized deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd packageclicker

# Install dependencies
make install
# OR
npm ci --legacy-peer-deps

# Install Playwright browsers for testing
make install-browsers
# OR
npm run test:e2e:install
```

### Development Server

```bash
# Start development server (http://localhost:4200)
make start
# OR
npm run start
```

The application will automatically open in your browser at `http://localhost:4200`.

## 🛠️ Development

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

### Testing

The project uses **Playwright** for end-to-end testing with multi-browser support.

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

# View test reports
make test-report
# OR
npm run test:e2e:report
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

## 📁 Project Structure

```
src/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── building-card/    # Building display component
│   │   └── virtual-buildings-list/  # Virtual scrolling component
│   ├── config/               # Configuration files
│   │   └── buildings.config.ts
│   ├── interfaces/           # TypeScript interface definitions
│   │   └── service.interfaces.ts
│   ├── models/               # Data models and types
│   │   └── game.models.ts
│   ├── services/             # Business logic services
│   │   ├── achievement.service.ts
│   │   ├── config.service.ts
│   │   ├── game-actions.service.ts
│   │   ├── game-state.service.ts
│   │   └── save.service.ts
│   ├── types/                # TypeScript type definitions
│   ├── app.component.ts      # Main application component
│   └── app.component.html    # Main UI template
├── index.html                # Application entry point
└── main.ts                   # Angular bootstrap
```

## 🏗️ Architecture

### Service-Based Architecture

- **GameStateService**: Manages core game state using Angular signals
- **GameActionsService**: Handles player interactions and game logic
- **ConfigService**: Centralized configuration and utility functions
- **AchievementService**: Achievement tracking with performance optimizations
- **SaveService**: Data persistence with validation and backup features

### Key Technologies

- **Angular 20.x**: Modern framework with standalone components
- **TypeScript 5.8**: Strict mode enabled for type safety
- **Angular Signals**: Reactive state management
- **Playwright**: End-to-end testing framework
- **Docker**: Containerized deployment with nginx

### Performance Features

- **OnPush Change Detection**: Optimized component updates
- **Debounced Click Events**: Prevents UI lag from rapid clicking
- **Lazy Achievement Checking**: Reduces computational overhead
- **Virtual Scrolling**: Handles large lists efficiently
- **Batch State Updates**: Minimizes unnecessary re-renders

## 🧪 Testing

### Test Structure

- **End-to-End Tests**: Located in `tests/` directory
- **Unit Tests**: Service-level tests with comprehensive coverage
- **Integration Tests**: Game state persistence and loading

### Key Test Selectors

- Package counter: `#package-count`
- Main clickable package: `#big-package`
- Store section: `#store`
- Store items: `.store-item`
- Stats section: `#stats`

## 🔧 Configuration

### Game Constants

All game constants are managed through the `ConfigService`:
- Game loop interval: 100ms
- Auto-save interval: 30 seconds
- Building price multiplier: 1.15
- Achievement check optimization: 10% chance per loop

### Build Configuration

- **TypeScript Strict Mode**: Comprehensive strict compiler options
- **ES2022**: Modern JavaScript features and syntax
- **Source Maps**: Enabled for debugging
- **Angular CLI**: Primary build and development tool

## 🚀 Deployment

### Production Build

```bash
# Create optimized production build
npm run build:prod
```

### Docker Production

```bash
# Build and run production container
docker compose up -d
```

The application will be available at `http://localhost:1002` with nginx serving optimized static files.

## 🤝 Contributing

1. Follow Angular style guide conventions
2. Ensure all tests pass before submitting
3. Use descriptive commit messages
4. Maintain TypeScript strict mode compliance
5. Add tests for new features

## 📊 Performance Monitoring

The game includes built-in performance optimizations:
- Minimal localStorage operations
- Efficient number formatting with caching
- Throttled achievement checking
- Optimized game loop with batched updates

## 🐛 Debugging

### Development Tools

- Browser DevTools for runtime debugging
- Angular DevTools extension for component inspection
- Playwright debug mode for test troubleshooting
- Local storage inspection for game state debugging

### Common Issues

- **Node.js Version**: Ensure you're using Node.js v20.19+ or v22.12+
- **Package Installation**: Use `--legacy-peer-deps` flag if needed
- **Test Failures**: Check browser installation with `npm run test:e2e:install`

## 📝 License

This project is licensed under the MIT License.