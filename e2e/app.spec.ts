import { test, expect } from '@playwright/test';

test('has sidebar and json viewer', async ({ page }) => {
  await page.goto('/');

  // サイドバーが表示されていることを確認
  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(sidebar).toBeVisible();

  // サイドバー内のボタンを明示的に指定
  await expect(sidebar.getByRole('button', { name: 'Au Options' })).toBeVisible();
  await expect(sidebar.getByRole('button', { name: 'ExR Options' })).toBeVisible();

  // Au Options が初期で表示されることを確認する
  await expect(page.getByRole('heading', { name: 'Au Options JSON' })).toBeVisible();
  await expect(page.getByTestId('au-json-pre')).toContainText('"TranslatedTitle": "ゲーム設定"');
  
  // ExR Options に切り替え
  await sidebar.getByRole('button', { name: 'ExR Options' }).click();
  await expect(page.getByRole('heading', { name: 'ExR Options JSON' })).toBeVisible();
  await expect(page.getByTestId('exr-json-pre')).toContainText('"Id": 0');

  // サイドバーの開閉
  await page.getByRole('button', { name: 'サイドバーを閉じる' }).click();
  await expect(sidebar.getByRole('navigation')).not.toBeVisible();

  await page.getByRole('button', { name: 'サイドバーを開く' }).click();
  await expect(sidebar.getByRole('navigation')).toBeVisible();
});
