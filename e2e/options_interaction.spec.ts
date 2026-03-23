import { test, expect } from '@playwright/test';

test('Options interaction behavior', async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error - window has no __API_DELAY__ property
    window.__API_DELAY__ = 100;
  });

  await page.goto('/');

  // ローディング画面が消えるのを待つ
  await expect(page.getByText('Loading data...')).not.toBeVisible({ timeout: 30000 });

  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(sidebar.getByRole('navigation')).toBeVisible({ timeout: 10000 });
  await sidebar.getByRole('button', { name: 'ExR Options' }).click();

  // ヘッダーのプリセットセレクターを確認
  const presetInput = page.getByPlaceholder('プリセット名を入力...');
  await expect(presetInput).toBeVisible();

  // 初期値 (1)
  await expect(presetInput).toHaveValue('1');

  // 名前を変更
  await presetInput.fill('Test Preset');
  await presetInput.press('Enter');

  // ドロップダウンを開いて名前が反映されているか確認
  await page.getByRole('button', { name: 'プリセットを選択' }).click();
  await expect(page.getByText('Test Preset')).toBeVisible();

  // 別のカテゴリの操作を確認
  const shuffleCategory = page.getByRole('button', { name: '乱数に関する設定' });
  await shuffleCategory.click();

  const shuffleOption = page.getByText('強力なシャッフルを使用する');
  await expect(shuffleOption).toBeVisible();

  const dropdown = page.getByRole('combobox');
  await expect(dropdown).toHaveValue('0'); // オフ

  // ドロップダウンを変更
  await dropdown.selectOption({ index: 1 });
  await expect(dropdown).toHaveValue('1');
});
