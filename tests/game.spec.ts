import { test, expect } from '@playwright/test';

test.describe('Package Clicker Game', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display initial game state correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check initial package count
    await expect(page.locator('#package-count')).toHaveText('0');
    
    // Check initial packages per second
    await expect(page.locator('#pps')).toHaveText('0');
    
    // Check that big package is visible and clickable
    await expect(page.locator('#big-package')).toBeVisible();
    
    // Check that store is visible
    await expect(page.locator('#store')).toBeVisible();
    
    // Check that all building items are displayed
    const buildingTypes = ['cursor', 'grandma', 'farm', 'mine', 'factory', 'bank', 'warehouse', 'airport', 'spaceport', 'ceo'];
    for (const building of buildingTypes) {
      await expect(page.locator(`.store-item:has-text("Delivery Truck"), .store-item:has-text("Sorting Facility"), .store-item:has-text("Distribution Center"), .store-item:has-text("Cargo Plane"), .store-item:has-text("Cargo Ship"), .store-item:has-text("FedEx Store"), .store-item:has-text("Mega Warehouse"), .store-item:has-text("International Airport"), .store-item:has-text("Space Delivery Port"), .store-item:has-text("Frederic W Smith")`)).toBeVisible();
    }
  });

  test('should increment package count when clicking the big package', async ({ page }) => {
    await page.goto('/');
    
    // Click the package multiple times
    for (let i = 1; i <= 5; i++) {
      await page.locator('#big-package').click();
      await expect(page.locator('#package-count')).toHaveText(i.toString());
    }
  });

  test('should allow buying first building when enough packages are earned', async ({ page }) => {
    await page.goto('/');
    
    // Click package 15 times to afford first delivery truck (costs 15)
    for (let i = 0; i < 15; i++) {
      await page.locator('#big-package').click();
    }
    
    // Check that we can afford the first building
    const firstBuilding = page.locator('.store-item').first();
    await expect(firstBuilding).toHaveClass(/affordable/);
    
    // Buy the first building
    await firstBuilding.click();
    
    // Check that package count decreased
    await expect(page.locator('#package-count')).toHaveText('0');
    
    // Check that building count increased
    await expect(firstBuilding.locator('.item-count')).toHaveText('1');
    
    // Check that packages per second updated
    await expect(page.locator('#pps')).toHaveText('1');
  });

  test('should generate packages automatically when buildings are owned', async ({ page }) => {
    await page.goto('/');
    
    // Buy a delivery truck
    for (let i = 0; i < 15; i++) {
      await page.locator('#big-package').click();
    }
    await page.locator('.store-item').first().click();
    
    // Wait a bit for automatic generation
    await page.waitForTimeout(1000);
    
    // Check that packages have increased due to automatic generation
    const packageCount = await page.locator('#package-count').textContent();
    expect(parseInt(packageCount || '0')).toBeGreaterThan(0);
  });

  test('should display building prices correctly and increase after purchase', async ({ page }) => {
    await page.goto('/');
    
    const firstBuilding = page.locator('.store-item').first();
    
    // Check initial price (should be 15 for delivery truck)
    await expect(firstBuilding.locator('.item-price')).toHaveText('15');
    
    // Buy the building
    for (let i = 0; i < 15; i++) {
      await page.locator('#big-package').click();
    }
    await firstBuilding.click();
    
    // Check that price increased (15 * 1.15 = 17.25, rounded down to 17)
    await expect(firstBuilding.locator('.item-price')).toHaveText('17');
  });

  test('should format large numbers correctly', async ({ page }) => {
    await page.goto('/');
    
    // Simulate having a large number of packages using localStorage
    await page.evaluate(() => {
      const gameState = {
        packages: 1500,
        packagesPerSecond: 0,
        packagesPerClick: 1,
        buildings: {
          cursor: { count: 0, basePrice: 15, pps: 1 },
          grandma: { count: 0, basePrice: 100, pps: 8 },
          farm: { count: 0, basePrice: 1100, pps: 47 },
          mine: { count: 0, basePrice: 12000, pps: 260 },
          factory: { count: 0, basePrice: 130000, pps: 1400 },
          bank: { count: 0, basePrice: 1400000, pps: 7800 },
          warehouse: { count: 0, basePrice: 20000000, pps: 44000 },
          airport: { count: 0, basePrice: 330000000, pps: 260000 },
          spaceport: { count: 0, basePrice: 5100000000, pps: 1600000 },
          ceo: { count: 0, basePrice: 75000000000, pps: 10000000 }
        },
        achievements: [],
        totalPackagesClicked: 0,
        totalPackagesEarned: 1500
      };
      localStorage.setItem('packageClickerSave', JSON.stringify(gameState));
    });
    
    await page.reload();
    
    // Check that 1500 is displayed as "1.50K"
    await expect(page.locator('#package-count')).toHaveText('1.50K');
  });

  test('should handle building affordability states correctly', async ({ page }) => {
    await page.goto('/');
    
    // Initially, no buildings should be affordable
    const buildings = page.locator('.store-item');
    const buildingCount = await buildings.count();
    
    for (let i = 0; i < buildingCount; i++) {
      const building = buildings.nth(i);
      await expect(building).not.toHaveClass(/affordable/);
    }
    
    // After earning packages, some should become affordable
    for (let i = 0; i < 100; i++) {
      await page.locator('#big-package').click();
    }
    
    // First building (15 cost) should be affordable
    await expect(buildings.first()).toHaveClass(/affordable/);
    
    // Second building (100 cost) should be affordable
    await expect(buildings.nth(1)).toHaveClass(/affordable/);
    
    // Higher cost buildings should not be affordable
    await expect(buildings.nth(2)).not.toHaveClass(/affordable/);
  });

  test('should persist game state in localStorage', async ({ page }) => {
    await page.goto('/');
    
    // Click package and buy building
    for (let i = 0; i < 20; i++) {
      await page.locator('#big-package').click();
    }
    await page.locator('.store-item').first().click();
    
    // Reload page and check state persisted
    await page.reload();
    
    // Should have remaining packages and building
    const packageCount = await page.locator('#package-count').textContent();
    expect(parseInt(packageCount || '0')).toBeGreaterThan(0);
    
    await expect(page.locator('.store-item').first().locator('.item-count')).toHaveText('1');
    await expect(page.locator('#pps')).toHaveText('1');
  });

  test('should display all required UI elements', async ({ page }) => {
    await page.goto('/');
    
    // Check main UI elements
    await expect(page.locator('h1')).toHaveText('Package Clicker');
    await expect(page.locator('#stats')).toBeVisible();
    await expect(page.locator('#package-counter')).toBeVisible();
    await expect(page.locator('#packages-per-second')).toBeVisible();
    await expect(page.locator('#main-game-area')).toBeVisible();
    await expect(page.locator('#package-container')).toBeVisible();
    await expect(page.locator('#right-panel')).toBeVisible();
    
    // Check store elements
    await expect(page.locator('#store h2')).toHaveText('Package Processing Upgrades');
    await expect(page.locator('#store-items')).toBeVisible();
    
    // Check that all store items have required elements
    const buildings = page.locator('.store-item');
    const buildingCount = await buildings.count();
    
    for (let i = 0; i < buildingCount; i++) {
      const building = buildings.nth(i);
      await expect(building.locator('.item-icon')).toBeVisible();
      await expect(building.locator('.item-info')).toBeVisible();
      await expect(building.locator('.item-name')).toBeVisible();
      await expect(building.locator('.item-description')).toBeVisible();
      await expect(building.locator('.item-stats')).toBeVisible();
      await expect(building.locator('.item-count')).toBeVisible();
      await expect(building.locator('.item-production')).toBeVisible();
      await expect(building.locator('.item-price')).toBeVisible();
    }
  });

  test('should handle rapid clicking without errors', async ({ page }) => {
    await page.goto('/');
    
    // Rapidly click the package many times
    for (let i = 0; i < 100; i++) {
      await page.locator('#big-package').click({ delay: 10 });
    }
    
    // Check that count updated correctly
    await expect(page.locator('#package-count')).toHaveText('100');
  });

  test('should work on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that main elements are still visible and functional
    await expect(page.locator('#big-package')).toBeVisible();
    await expect(page.locator('#package-count')).toBeVisible();
    await expect(page.locator('#store')).toBeVisible();
    
    // Test clicking functionality on mobile
    await page.locator('#big-package').click();
    await expect(page.locator('#package-count')).toHaveText('1');
  });
});