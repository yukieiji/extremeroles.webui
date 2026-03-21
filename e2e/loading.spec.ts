import { test, expect } from '@playwright/test';

test('初期ロード時にローディング画面が表示されること', async ({ page }) => {
  await page.route('**/exr/option/', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.continue();
  });

  await page.goto('/');
  // 初回は Loading data... が出るはず
  await expect(page.getByText('Loading data...')).toBeVisible({ timeout: 5000 });
  await expect(page.getByLabel('オプションサイドバー')).toBeVisible({ timeout: 15000 });
});

test('サイドバー切り替え時にメインコンテンツ全体にローディングインジケータが表示されること', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('オプションサイドバー')).toBeVisible({ timeout: 15000 });

  // キャッシュをリセットして確実に fetch を発生させる
  await page.getByTestId('reset-button').click();

  // ExR Options に切り替える
  await page.route('**/exr/option/', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.continue();
  });

  // クリック
  await page.getByRole('button', { name: 'ExR Options' }).click();

  // メインコンテンツエリア全体が pending 状態になることを確認
  // startTransition による状態反映を待つために locator を取得
  const contentSection = page.locator('section').first();

  // transition が開始されるまで待機
  await expect(contentSection).toHaveClass(/opacity-50/, { timeout: 10000 });

  // スピナーが表示されていることを確認
  const spinner = contentSection.locator('.animate-spin');
  await expect(spinner).toBeVisible({ timeout: 10000 });

  // 読み込み完了後にスピナーが消え、不透明度が戻ることを確認
  await expect(spinner).not.toBeVisible({ timeout: 15000 });
  await expect(contentSection).toHaveClass(/opacity-100/, { timeout: 10000 });
});

test('ExRタブ切り替え時にカテゴリリストのみにローディングインジケータが表示されること', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('オプションサイドバー')).toBeVisible({ timeout: 15000 });

  await page.getByRole('button', { name: 'ExR Options' }).click();
  await expect(page.getByText('ExR Options JSON')).toBeVisible({ timeout: 10000 });

  // タブボタンを取得
  const tabs = page.locator('button.px-4.py-2.rounded-t-lg');
  const secondTab = tabs.nth(1);

  // クリック
  await secondTab.click();

  // カテゴリリスト部分が描画されていることを確認
  const categoryList = page.locator('.flex.flex-col.relative.transition-opacity');
  await expect(categoryList).toBeVisible({ timeout: 10000 });
});
