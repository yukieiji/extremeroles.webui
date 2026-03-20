import { test, expect } from '@playwright/test';

test('has sidebar and json viewer', async ({ page }) => {
  await page.goto('/');

  // サイドバーが表示されていることを確認
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByText('ExR Options')).toBeVisible();
  await expect(page.getByText('Au Options')).toBeVisible();

  // 初期状態で ExR Options JSON が表示されていることを確認
  await expect(page.getByRole('heading', { name: 'ExR Options JSON' })).toBeVisible();
  await expect(page.locator('pre')).toContainText('"Id": 0');

  // Au Options に切り替え
  await page.getByRole('button', { name: 'Au Options' }).click();
  await expect(page.getByRole('heading', { name: 'Au Options JSON' })).toBeVisible();
  await expect(page.locator('pre')).toContainText('"TranslatedTitle": "ゲーム設定"');

  // サイドバーの開閉
  await page.getByRole('button', { name: 'サイドバーを閉じる' }).click();
  await expect(page.getByRole('navigation')).not.toBeVisible();
  await page.getByRole('button', { name: 'サイドバーを開く' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
});
