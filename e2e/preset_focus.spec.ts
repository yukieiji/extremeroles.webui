import { test, expect } from '@playwright/test';

test('Preset input should blur when selecting from dropdown', async ({ page }) => {
  // タイムアウトを延長
  test.setTimeout(60000);

  // すべてのテストで API の遅延を設定可能にする（CI 向けに最短に）
  await page.addInitScript(() => {
    // @ts-expect-error - window has no __API_DELAY__ property
    window.__API_DELAY__ = 100;
  });

  await page.goto('/');

  // ローディング画面が消えるのを待つ
  await expect(page.getByText('Loading data...')).not.toBeVisible({ timeout: 45000 });

  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(sidebar).toBeVisible({ timeout: 30000 });

  const exrButton = sidebar.getByRole('button', { name: 'ExR Options' });
  await expect(exrButton).toBeVisible({ timeout: 30000 });
  await exrButton.click();

  // ヘッダーのプリセットセレクターを確認
  const presetInput = page.getByPlaceholder('プリセット名を入力...');
  await expect(presetInput).toBeVisible({ timeout: 15000 });

  // 1. 入力欄にフォーカスを当てて、テキストを入力中にする
  await presetInput.focus();
  await presetInput.fill('Editing Preset');
  await expect(presetInput).toBeFocused();

  // 2. ドロップダウンを開く
  const selectButton = page.getByRole('button', { name: 'プリセットを選択' });
  await expect(selectButton).toBeVisible();
  await selectButton.click();

  // 3. 別のプリセットを選択する
  // 現在は「1」が選択されているはずなので、「2」を選択
  const dropdown = page.locator('div.absolute.top-full');
  await expect(dropdown).toBeVisible();
  const preset2Button = dropdown.getByRole('button', { name: '2', exact: true });
  await expect(preset2Button).toBeVisible();

  await preset2Button.click();

  // 4. 入力欄のフォーカスが外れていることを確認する
  // バグが発生している場合は、ここでフォーカスが残ったままになり、テストが失敗することを期待する
  await expect(presetInput).not.toBeFocused();

  // ついでに、値が切り替わっていることも確認
  await expect(presetInput).toHaveValue('2');
});
