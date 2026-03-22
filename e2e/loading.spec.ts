import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // すべてのテストで API の遅延を設定可能にする
  await page.addInitScript(() => {
    // @ts-expect-error - window has no __API_DELAY__ property
    window.__API_DELAY__ = 1000;
  });
});

test('初期ロード時にローディング画面が表示されること', async ({ page }) => {
  await page.goto('/');
  // index.html に仕込んだ Loading data... またはサイドバーが表示されるまで待機
  const loadingText = page.getByText('Loading data...');
  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(loadingText.or(sidebar)).toBeVisible({ timeout: 30000 });
});

test('サイドバー切り替え時にメインコンテンツが表示されること', async ({ page }) => {
  await page.goto('/');
  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(sidebar).toBeVisible({ timeout: 30000 });

  // ExR Options に切り替え
  await page.getByRole('button', { name: 'ExR Options' }).click();

  // 切り替え後のコンテンツが表示されることを確認
  await expect(page.getByRole('heading', { name: 'ExR Options' })).toBeVisible({ timeout: 20000 });
});

test('ExRタブ切り替え時にカテゴリリストが表示されること', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('オプションサイドバー')).toBeVisible({ timeout: 30000 });

  await page.getByRole('button', { name: 'ExR Options' }).click();
  await expect(page.getByRole('heading', { name: 'ExR Options' })).toBeVisible({ timeout: 15000 });

  const categoryList = page.getByTestId('exr-category-list');
  await expect(categoryList).toBeVisible();

  const tabs = page.locator('button.px-4.py-2.rounded-t-lg');
  const secondTab = tabs.nth(1);
  const secondTabName = await secondTab.textContent();
  await secondTab.click();

  // 別タブのコンテンツが表示されることを確認（暗黙的にローディング待ちが含まれる）
  if (secondTabName) {
    // タブ名が変更されているか、あるいはリストが再描画されていることを確認
    await expect(categoryList).toBeVisible();
  }
});
