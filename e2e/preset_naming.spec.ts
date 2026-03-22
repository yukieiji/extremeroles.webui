import { test, expect } from '@playwright/test';

test('Preset naming and persistence behavior', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const sidebar = page.getByLabel('オプションサイドバー');
  await sidebar.getByRole('button', { name: 'ExR Options' }).click();

  // ヘッダーのプリセットセレクターを確認
  const presetInput = page.getByPlaceholder('プリセット名を入力...');
  await expect(presetInput).toBeVisible();

  // プリセット 1 (index 0) に名前を付ける
  await presetInput.fill('Hardcore Rules');
  await presetInput.press('Enter');

  // ドロップダウンを開く
  await page.getByRole('button', { name: 'プリセットを選択' }).click();
  // プリセット 2 (index 1) に切り替える
  await page.getByRole('button', { name: '2', exact: true }).click();
  // 入力欄が index 1 のデフォルト値 "2" になっていることを確認
  await expect(presetInput).toHaveValue('2');

  // プリセット 2 (index 1) に名前を付ける
  await presetInput.fill('Casual Fun');
  await presetInput.blur(); // onBlur での保存をテスト

  // ページをリロードして Cookie から復元されるか確認
  await page.reload({ waitUntil: 'networkidle' });

  // ExR Options を再度開く
  await sidebar.getByRole('button', { name: 'ExR Options' }).click();

  // 初期状態では index 0 (プリセット 1) が選択されるはずなので、名前が Hardcore Rules であることを確認
  await expect(presetInput).toHaveValue('Hardcore Rules');

  // ドロップダウンを開いて index 1 の名前が保持されていることを確認
  await page.getByRole('button', { name: 'プリセットを選択' }).click();
  await expect(page.getByText('Casual Fun')).toBeVisible();

  // index 1 (Casual Fun) に切り替える
  await page.getByRole('button', { name: 'Casual Fun' }).click();
  await expect(presetInput).toHaveValue('Casual Fun');
});
