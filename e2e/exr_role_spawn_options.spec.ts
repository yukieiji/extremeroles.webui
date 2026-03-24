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
  const SHERIFF_ID = '270';

  test('should display both spawn rate and count in category header of role tabs', async ({ page }) => {
    // 役職タブ（クルーメイト）に切り替え
    await page.getByRole('button', { name: 'クルーメイト役職設定', exact: true }).click();

    // カテゴリ（シェリフ）のヘッダーに「レート」と「数」が表示されていることを確認
    const sheriffCategory = page.getByTestId(`exr-category-${SHERIFF_ID}`);
    await expect(sheriffCategory.getByTestId('spawn-rate-control')).toBeVisible();
    await expect(sheriffCategory.getByTestId('spawn-count-control')).toBeVisible();
  });

  test('should synchronize spawn rate and count', async ({ page }) => {
    await page.getByRole('button', { name: 'クルーメイト役職設定', exact: true }).click();

    const sheriffCategory = page.getByTestId(`exr-category-${SHERIFF_ID}`);
    const rateControl = sheriffCategory.getByTestId('spawn-rate-control');
    const countControl = sheriffCategory.getByTestId('spawn-count-control');

    const rateInput = rateControl.locator('input[type="text"]');
    const countInput = countControl.locator('input[type="text"]');
    const rateSlider = rateControl.locator('input[type="range"]');
    const countSlider = countControl.locator('input[type="range"]');

    // 初期状態が 0, 0 であることを確認（モックデータ依存だが、このテストスイートではそう仮定）
    // もしモックが違うなら、まず 0 にする
    await rateSlider.fill('0');
    await expect(rateInput).toHaveValue('0');
    await expect(countInput).toHaveValue('0');

    // 1. スポーン数を変更するとスポーンレートを10％へ
    await countSlider.fill('1'); // インデックス1 = 値1 (0番目は0)
    await expect(countInput).toHaveValue('1');
    await expect(rateInput).toHaveValue('10');

    // 2. スポーンレートを0％にするとスポーン数を0
    await rateSlider.fill('0');
    await expect(rateInput).toHaveValue('0');
    await expect(countInput).toHaveValue('0');

    // 3. スポーン数を0へ変更するとスポーンレートが0％へ
    // まず 10%, 1 に戻す
    await countSlider.fill('1');
    await expect(rateInput).toHaveValue('10');
    await expect(countInput).toHaveValue('1');
    // 0へ変更
    await countSlider.fill('0');
    await expect(countInput).toHaveValue('0');
    await expect(rateInput).toHaveValue('0');
  });

  test('interacting with header controls should not toggle accordion', async ({ page }) => {
    await page.getByRole('button', { name: 'クルーメイト役職設定', exact: true }).click();

    const sheriffCategory = page.getByTestId(`exr-category-${SHERIFF_ID}`);
    const content = sheriffCategory.locator('.bg-gray-900'); // Body area

    // 最初は閉じている
    await expect(content).not.toBeVisible();

    // レートのスライダーを操作
    const rateSlider = sheriffCategory.getByTestId('spawn-rate-control').locator('input[type="range"]');
    await rateSlider.fill('10');

    // まだ閉じているはず（stopPropagationが効いている）
    await expect(content).not.toBeVisible();

    // 数も操作してみる
    const countSlider = sheriffCategory.getByTestId('spawn-count-control').locator('input[type="range"]');
    await countSlider.fill('2');

    // まだ閉じているはず
    await expect(content).not.toBeVisible();

    // ヘッダー名をクリックすれば開く
    await sheriffCategory.getByRole('button', { name: 'シェリフ' }).click();
    await expect(content).toBeVisible();
  });

  test('spawn rate and count should be filtered out from accordion body', async ({ page }) => {
    await page.getByRole('button', { name: 'クルーメイト役職設定', exact: true }).click();

    const sheriffCategory = page.getByTestId(`exr-category-${SHERIFF_ID}`);

    // アコーディオンを開く
    await sheriffCategory.getByRole('button', { name: 'シェリフ' }).click();
    const content = sheriffCategory.locator('.bg-gray-900');
    await expect(content).toBeVisible();

    // 中身に「スポーンレート」や「スポーン数」というテキストが無いことを確認
    await expect(content.getByText('スポーンレート')).not.toBeVisible();
    await expect(content.getByText('スポーン数')).not.toBeVisible();
  });
});
