# CashFlow Game Makefile
# This Makefile provides convenient commands to build, run, and test the application

.PHONY: help install clean build build-prod start test test-ui test-debug test-headed test-report docker-build docker-run docker-stop docker-logs docker-clean dev watch lint format

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
NC := \033[0m # No Color

##@ General

help: ## Display this help message
	@echo "$(GREEN)CashFlow Game - Development Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(GREEN)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

install: ## Install dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm ci --legacy-peer-deps

install-browsers: ## Install Playwright browsers
	@echo "$(GREEN)Installing Playwright browsers...$(NC)"
	npm run test:e2e:install

clean: ## Clean node_modules and build artifacts
	@echo "$(YELLOW)Cleaning project...$(NC)"
	rm -rf node_modules dist .angular playwright-report test-results
	@echo "$(GREEN)Clean completed$(NC)"

##@ Building

build: ## Build application for development
	@echo "$(GREEN)Building application (development)...$(NC)"
	npm run build

build-prod: ## Build application for production
	@echo "$(GREEN)Building application (production)...$(NC)"
	npm run build:prod

watch: ## Build application in watch mode for development
	@echo "$(GREEN)Starting build in watch mode...$(NC)"
	npm run watch

##@ Running

start: ## Start development server
	@echo "$(GREEN)Starting development server...$(NC)"
	@echo "Application will be available at http://localhost:4200"
	npm run start

dev: start ## Alias for start command
run: start ## Alias for start command

##@ Testing

test: ## Run end-to-end tests
	@echo "$(GREEN)Running Playwright tests...$(NC)"
	npm run test:e2e

test-ui: ## Run tests with UI mode (interactive)
	@echo "$(GREEN)Running Playwright tests in UI mode...$(NC)"
	npm run test:e2e:ui

test-debug: ## Run tests in debug mode
	@echo "$(GREEN)Running Playwright tests in debug mode...$(NC)"
	npm run test:e2e:debug

test-headed: ## Run tests in headed mode (visible browser)
	@echo "$(GREEN)Running Playwright tests in headed mode...$(NC)"
	npm run test:e2e:headed

test-report: ## Show test reports
	@echo "$(GREEN)Opening test report...$(NC)"
	npm run test:e2e:report

##@ Docker Operations

docker-build: ## Build Docker image
	@echo "$(GREEN)Building Docker image...$(NC)"
	docker build -t cashflow:latest .

docker-run: ## Run application in Docker container
	@echo "$(GREEN)Running Docker container...$(NC)"
	@echo "Application will be available at http://localhost:1002"
	docker-compose up -d

docker-stop: ## Stop Docker container
	@echo "$(YELLOW)Stopping Docker container...$(NC)"
	docker-compose down

docker-logs: ## View Docker container logs
	@echo "$(GREEN)Showing Docker logs...$(NC)"
	docker-compose logs -f

docker-clean: ## Clean Docker containers and images
	@echo "$(YELLOW)Cleaning Docker containers and images...$(NC)"
	docker-compose down -v --remove-orphans
	docker rmi cashflow:latest 2>/dev/null || true
	@echo "$(GREEN)Docker cleanup completed$(NC)"

##@ Utilities

check-deps: ## Check if all dependencies are installed
	@echo "$(GREEN)Checking dependencies...$(NC)"
	@if [ ! -d "node_modules" ]; then \
		echo "$(RED)Dependencies not installed. Run 'make install'$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Dependencies are installed$(NC)"

check-browsers: ## Check if Playwright browsers are installed
	@echo "$(GREEN)Checking Playwright browsers...$(NC)"
	@npx playwright --version > /dev/null 2>&1 || { echo "$(RED)Playwright not found. Run 'make install' first$(NC)"; exit 1; }
	@echo "$(GREEN)Playwright browsers are available$(NC)"

status: ## Show project status
	@echo "$(GREEN)Project Status:$(NC)"
	@echo "Node version: $$(node --version)"
	@echo "NPM version: $$(npm --version)"
	@if [ -d "node_modules" ]; then echo "Dependencies: $(GREEN)Installed$(NC)"; else echo "Dependencies: $(RED)Not installed$(NC)"; fi
	@if [ -d "dist" ]; then echo "Build: $(GREEN)Available$(NC)"; else echo "Build: $(YELLOW)Not built$(NC)"; fi
	@if docker ps | grep -q cashflow; then echo "Docker: $(GREEN)Running$(NC)"; else echo "Docker: $(YELLOW)Not running$(NC)"; fi

##@ Quick Commands

setup: install install-browsers ## Complete project setup
	@echo "$(GREEN)Project setup completed!$(NC)"

serve: check-deps start ## Check dependencies and start development server

test-all: check-deps check-browsers test ## Run all tests with dependency checks

build-and-serve: build start ## Build and serve the application

docker-full: docker-build docker-run ## Build and run Docker container
	@echo "$(GREEN)Docker container is running at http://localhost:1002$(NC)"

##@ Maintenance

update: ## Update dependencies
	@echo "$(GREEN)Updating dependencies...$(NC)"
	npm update

audit: ## Run security audit
	@echo "$(GREEN)Running security audit...$(NC)"
	npm audit

audit-fix: ## Fix security vulnerabilities
	@echo "$(GREEN)Fixing security vulnerabilities...$(NC)"
	npm audit fix --legacy-peer-deps

##@ CI/CD

ci-install: ## Install dependencies for CI environment
	@echo "$(GREEN)Installing dependencies for CI...$(NC)"
	npm ci --legacy-peer-deps

ci-test: ci-install install-browsers test ## Run full CI test suite
	@echo "$(GREEN)CI tests completed$(NC)"

ci-build: ci-install build-prod ## Build application for CI
	@echo "$(GREEN)CI build completed$(NC)"

##@ Information

version: ## Show application version
	@node -p "require('./package.json').version"

info: ## Show detailed project information
	@echo "$(GREEN)CashFlow Game Project Information:$(NC)"
	@echo "Name: $$(node -p "require('./package.json').name")"
	@echo "Version: $$(node -p "require('./package.json').version")"
	@echo "Description: Financial literacy game built with Angular"
	@echo "Technologies: Angular, PrimeNG, Chart.js, Playwright"
	@echo "Build tool: Angular CLI"
	@echo "Testing: Playwright E2E"
	@echo "Container: Docker with nginx"