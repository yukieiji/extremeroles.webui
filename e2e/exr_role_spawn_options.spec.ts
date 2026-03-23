import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // API遅延を最小限にしてテストを高速化
  await page.addInitScript(() => {
    // @ts-expect-error - window has no __API_DELAY__ property
    window.__API_DELAY__ = 0;
  });
  await page.goto('/');
  // ローディング画面が消えるのを待つ
  await expect(page.getByText('Loading data...')).not.toBeVisible({ timeout: 30000 });

  // ExR Options タブに切り替え
  await page.getByRole('button', { name: 'ExR Options' }).click();
  await page.waitForSelector('[data-testid="exr-category-list"]');
});

test.describe('ExR Role Spawn Options in Header', () => {
  test('should display spawn rate in category header of role tabs', async ({ page }) => {
    // 役職タブ（クルーメイト）に切り替え
    await page.getByRole('button', { name: 'クルーメイト役職設定', exact: true }).click();

    // カテゴリ（例：シェリフ）のヘッダーに「レート」が表示されていることを確認
    const sheriffCategory = page.locator('.border-gray-700.rounded-lg').filter({ hasText: 'シェリフ' }).first();
    await expect(sheriffCategory.getByText('レート')).toBeVisible();
  });

  test('should show spawn count only when spawn rate is 1 or more', async ({ page }) => {
    await page.getByRole('button', { name: 'クルーメイト役職設定', exact: true }).click();

    const sheriffCategory = page.locator('.border-gray-700.rounded-lg').filter({ hasText: 'シェリフ' }).first();

    // 初期状態（レート 0）では「数」は表示されていないはず
    await expect(sheriffCategory.getByText('数')).not.toBeVisible();

    // レートのスライダーを操作して 1 以上にする
    const rateSlider = sheriffCategory.locator('input[type="range"]').first();
    await rateSlider.fill('10');

    // 「数」が表示されることを確認
    await expect(sheriffCategory.getByText('数')).toBeVisible();

    // レートを 0 に戻すと「数」が消えることを確認
    await rateSlider.fill('0');
    await expect(sheriffCategory.getByText('数')).not.toBeVisible();
  });

  test('interacting with header controls should not toggle accordion', async ({ page }) => {
    await page.getByRole('button', { name: 'クルーメイト役職設定', exact: true }).click();

    const sheriffCategory = page.locator('.border-gray-700.rounded-lg').filter({ hasText: 'シェリフ' }).first();
    const content = sheriffCategory.locator('.bg-gray-900'); // RoleCategoryItem の中身

    // 最初は閉じている
    await expect(content).not.toBeVisible();

    // レートのスライダーを操作
    const rateSlider = sheriffCategory.locator('input[type="range"]').first();
    await rateSlider.fill('10');

    // まだ閉じているはず（stopPropagationが効いている）
    await expect(content).not.toBeVisible();

    // 数が表示されたのでそちらも操作してみる
    const countSlider = sheriffCategory.locator('input[type="range"]').nth(1);
    await countSlider.fill('2');

    // まだ閉じているはず
    await expect(content).not.toBeVisible();

    // ヘッダー名をクリックすれば開く
    await sheriffCategory.getByRole('button', { name: 'シェリフ' }).click();
    await expect(content).toBeVisible();
  });

  test('spawn rate and count should be filtered out from accordion body', async ({ page }) => {
    await page.getByRole('button', { name: 'クルーメイト役職設定', exact: true }).click();

    const sheriffCategory = page.locator('.border-gray-700.rounded-lg').filter({ hasText: 'シェリフ' }).first();

    // アコーディオンを開く
    await sheriffCategory.getByRole('button', { name: 'シェリフ' }).click();
    const content = sheriffCategory.locator('.bg-gray-900');
    await expect(content).toBeVisible();

    // 中身に「スポーンレート」や「スポーン数」というテキストが無いことを確認
    await expect(content.getByText('スポーンレート')).not.toBeVisible();
    await expect(content.getByText('スポーン数')).not.toBeVisible();
  });
});
