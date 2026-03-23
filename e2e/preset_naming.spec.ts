import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // タイムアウトを延長
  test.setTimeout(60000);

  // すべてのテストで API の遅延を設定可能にする
  await page.addInitScript(() => {
    // @ts-expect-error - window has no __API_DELAY__ property
    window.__API_DELAY__ = 100;
  });

  await page.goto('/');

  // ローディング画面が消えるのを待つ
  await expect(page.getByText('Loading data...')).not.toBeVisible({ timeout: 45000 });
});

test('Preset naming and persistence behavior', async ({ page }) => {
  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(sidebar).toBeVisible({ timeout: 30000 });

  const exrButton = sidebar.getByRole('button', { name: 'ExR Options' });
  await expect(exrButton).toBeVisible({ timeout: 30000 });
  await exrButton.click();

  // ヘッダーのプリセットセレクターを確認
  const presetInput = page.getByPlaceholder('プリセット名を入力...');
  await expect(presetInput).toBeVisible({ timeout: 15000 });

  // プリセット 1 (index 0) に名前を付ける
  await presetInput.fill('Hardcore Rules');
  await presetInput.press('Enter');

  // ドロップダウンを開く
  const selectButton = page.getByRole('button', { name: 'プリセットを選択' });
  await expect(selectButton).toBeVisible();
  await selectButton.click();

  // プリセット 2 (index 1) に切り替える
  const preset2Button = page.getByRole('button', { name: '2', exact: true });
  await expect(preset2Button).toBeVisible();
  await preset2Button.click();

  // 入力欄が index 1 のデフォルト値 "2" になっていることを確認
  await expect(presetInput).toHaveValue('2');

  // プリセット 2 (index 1) に名前を付ける
  await presetInput.fill('Casual Fun');
  await presetInput.blur(); // onBlur での保存をテスト

  // ページをリロードして Cookie から復元されるか確認
  await page.goto('/');

  // ローディング画面が消えるのを待つ
  await expect(page.getByText('Loading data...')).not.toBeVisible({ timeout: 45000 });

  // サイドバーの再表示を待つ
  await expect(sidebar).toBeVisible({ timeout: 30000 });
  await expect(exrButton).toBeVisible({ timeout: 30000 });
  await exrButton.click();

  // 初期状態では index 0 (プリセット 1) が選択されるはずなので、名前が Hardcore Rules であることを確認
  await expect(presetInput).toHaveValue('Hardcore Rules', { timeout: 15000 });

  // ドロップダウンを開いて index 1 の名前が保持されていることを確認
  await expect(selectButton).toBeVisible();
  await selectButton.click();
  const casualFunButton = page.getByRole('button', { name: 'Casual Fun' });
  await expect(casualFunButton).toBeVisible();

  // index 1 (Casual Fun) に切り替える
  await casualFunButton.click();
  await expect(presetInput).toHaveValue('Casual Fun');
});
