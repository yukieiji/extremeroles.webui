import { test, expect } from '@playwright/test';

test('Options interaction behavior', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(sidebar).toBeVisible({ timeout: 10000 });
  await sidebar.getByRole('button', { name: 'ExR Options' }).click();

  // カテゴリ「プリセット」を開く
  const categoryButton = page.getByRole('button', { name: 'プリセット' });
  await expect(categoryButton).toBeVisible();
  await categoryButton.click();

  // 「使用するプリセット」オプション（Int32/Slider）を確認
  const optionName = page.getByText('使用するプリセット');
  await expect(optionName).toBeVisible();

  // 初期値を確認 (Selection 0 -> Value 1)
  const input = page.locator('input[type="text"]').first();
  await expect(input).toHaveValue('1');
  await expect(page.getByText('(Preset 1)')).toBeVisible({ timeout: 10000 });

  // スライダーを操作（直接入力を変更してストアの更新を確認）
  await input.fill('5');
  // スナップされて 5 になるはず
  await expect(input).toHaveValue('5');
  await expect(page.getByText('(Preset 5)')).toBeVisible({ timeout: 10000 });

  // クルーメイトタブに切り替えてドロップダウンをテスト（データ構造に基づく）
  // 実際には「基本設定」が「プリセット」カテゴリを持っている
  // 別の「乱数に関する設定」カテゴリの「強力なシャッフルを使用する」をテスト
  const shuffleCategory = page.getByRole('button', { name: '乱数に関する設定' });
  await shuffleCategory.click();

  const shuffleOption = page.getByText('強力なシャッフルを使用する');
  await expect(shuffleOption).toBeVisible();

  const dropdown = page.getByRole('combobox');
  await expect(dropdown).toHaveValue('0'); // オフ

  // ドロップダウンを変更 (インデックスで選択。ラベルにはカラータグが含まれているため)
  await dropdown.selectOption({ index: 1 });
  await expect(dropdown).toHaveValue('1');
});
