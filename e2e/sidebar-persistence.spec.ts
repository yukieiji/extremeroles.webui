import { test, expect } from '@playwright/test';

test('sidebar state is persisted in localStorage', async ({ page }) => {
  await page.goto('/');

  // Wait for the application to load
  await page.waitForSelector('[data-slot="sidebar"]');

  // Helper to get sidebar state
  const getSidebarState = async () => {
    return await page.getAttribute('[data-slot="sidebar"]', 'data-state');
  };

  // Helper to get localStorage value
  const getLocalStorageValue = async () => {
    return await page.evaluate(() => localStorage.getItem('sidebar_state'));
  };

  // 1. Initial state (default should be expanded)
  expect(await getSidebarState()).toBe('expanded');

  // 2. Toggle to collapsed
  const trigger = page.locator('[data-slot="sidebar-trigger"]');
  await trigger.click();

  // Wait for transition or state change
  await expect(page.locator('[data-slot="sidebar"]')).toHaveAttribute('data-state', 'collapsed');
  expect(await getLocalStorageValue()).toBe('false');

  // 3. Reload and check if it's still collapsed
  await page.reload();
  await page.waitForSelector('[data-slot="sidebar"]');
  expect(await getSidebarState()).toBe('collapsed');
  expect(await getLocalStorageValue()).toBe('false');

  // 4. Toggle back to expanded
  await trigger.click();
  await expect(page.locator('[data-slot="sidebar"]')).toHaveAttribute('data-state', 'expanded');
  expect(await getLocalStorageValue()).toBe('true');

  // 5. Reload and check if it's still expanded
  await page.reload();
  await page.waitForSelector('[data-slot="sidebar"]');
  expect(await getSidebarState()).toBe('expanded');
  expect(await getLocalStorageValue()).toBe('true');
});
