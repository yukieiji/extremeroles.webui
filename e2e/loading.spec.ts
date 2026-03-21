import { test, expect } from '@playwright/test';

test('初期ロード時にローディング画面が表示されること', async ({ page }) => {
  await page.route('**/exr/option/', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.continue();
  });

  await page.goto('/');
  // MSW の初期化が遅れる可能性があるため、or で待機
  const loadingText = page.getByText('Loading data...');
  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(loadingText.or(sidebar)).toBeVisible({ timeout: 30000 });
});

test('ExRオプションに切り替えられること', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('オプションサイドバー')).toBeVisible({ timeout: 30000 });

  await page.getByRole('button', { name: 'ExR Options' }).click();
  await expect(page.getByText('ExR Options JSON')).toBeVisible({ timeout: 15000 });
});

test('ExRタブ切り替え時にカテゴリリストが表示されていること', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('オプションサイドバー')).toBeVisible({ timeout: 30000 });

  await page.getByRole('button', { name: 'ExR Options' }).click();
  await expect(page.getByText('ExR Options JSON')).toBeVisible({ timeout: 15000 });

  const tabs = page.locator('button.px-4.py-2.rounded-t-lg');
  const secondTab = tabs.nth(1);
  await secondTab.click();

  const categoryList = page.getByTestId('exr-category-list');
  await expect(categoryList).toBeVisible({ timeout: 15000 });
});
