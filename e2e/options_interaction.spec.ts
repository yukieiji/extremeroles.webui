import { test, expect } from '@playwright/test';

test('Options interaction behavior', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(sidebar).toBeVisible({ timeout: 10000 });
  await sidebar.getByRole('button', { name: 'ExR Options' }).click();

  // カテゴリ「ゲーム設定」を開く（モックデータの初期状態によって適宜変更）
  const categoryButton = page.getByRole('button', { name: 'ゲーム設定' });
  await expect(categoryButton).toBeVisible();
  await categoryButton.click();

  // 移動速度オプション（Single/Slider）を確認
  const optionName = page.getByText('移動速度');
  await expect(optionName).toBeVisible();

  // 初期値を確認 (1.0x)
  const speedInput = page.locator('input[type="text"]').first();
  await expect(speedInput).toHaveValue('1');
  await expect(page.getByText('(1x)')).toBeVisible();

  // スライダーを操作（または直接入力を変更してストアの更新を確認）
  await speedInput.fill('2.5');
  // スナップされて 2.5 になるはず
  await expect(speedInput).toHaveValue('2.5');
  await expect(page.getByText('(2.5x)')).toBeVisible();

  // クルーメイトタブに切り替えてドロップダウンをテスト
  await page.getByRole('button', { name: 'クルーメイト', exact: false }).click();
  const roleCategoryButton = page.getByRole('button', { name: '役職設定' });
  await roleCategoryButton.click();

  // シェリフ（String/Dropdown）を確認
  await expect(page.getByText('シェリフ')).toBeVisible();
  const dropdown = page.getByRole('combobox');
  await expect(dropdown).toHaveValue('0'); // 無効

  // ドロップダウンを変更
  await dropdown.selectOption({ label: '有効' });
  await expect(dropdown).toHaveValue('1');
});
