import { test, expect } from '@playwright/test';

test('verify role colors page', async ({ page }) => {
  await page.goto('http://localhost:5173/color/role');
  // Wait for the page to load
  await page.waitForSelector('h2:has-text("役職カラーパレット")');

  // Take a screenshot
  await page.screenshot({ path: 'design/role_colors_dark.png', fullPage: true });
});
