import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading data...')).not.toBeVisible({ timeout: 45000 });
});

test('Preset input should lose focus when interacting with dropdown', async ({ page }) => {
  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(sidebar).toBeVisible({ timeout: 30000 });

  const exrButton = sidebar.getByRole('button', { name: 'ExR Options' });
  await expect(exrButton).toBeVisible({ timeout: 30000 });
  await exrButton.click();

  const presetInput = page.getByPlaceholder('プリセット名を入力...');
  await expect(presetInput).toBeVisible();

  // 1. フォーカスを当てる
  await presetInput.click();
  await expect(presetInput).toBeFocused();

  // 2. ドロップダウンボタンをクリックして開く
  const selectButton = page.getByRole('button', { name: 'プリセットを選択' });
  await selectButton.click();

  // ドロップダウンが開いていることを確認
  await expect(page.getByRole('button', { name: '2', exact: true })).toBeVisible();

  // フォーカスが外れていることを期待
  await expect(presetInput).not.toBeFocused();

  // 3. 同じ項目を選択する
  // 初期状態は 1 (index 0) なので、ボタン "1" をクリック
  const preset1Button = page.getByRole('button', { name: '1', exact: true });
  await preset1Button.click();

  // 項目選択後、少し待機してフォーカスを確認
  await page.waitForTimeout(500);
  await expect(presetInput).not.toBeFocused();

  // 4. 再び開いて別の項目を選択
  await selectButton.click();
  const preset2Button = page.getByRole('button', { name: '2', exact: true });
  await preset2Button.click();

  // 別の項目選択後
  await page.waitForTimeout(500);
  const newPresetInput = page.getByPlaceholder('プリセット名を入力...');
  await expect(newPresetInput).toHaveValue('2');
  await expect(newPresetInput).not.toBeFocused();
});
