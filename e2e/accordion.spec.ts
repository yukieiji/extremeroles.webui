import { test, expect } from '@playwright/test';

test('ExR Option Accordion behavior', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(sidebar).toBeVisible({ timeout: 10000 });
  await sidebar.getByRole('button', { name: 'ExR Options' }).click();

  // カテゴリ「プリセット」のアコーディオンがあることを確認
  const accordionButton = page.getByRole('button', { name: 'プリセット' });
  await expect(accordionButton).toBeVisible();

  // 初期状態では閉じている
  // アコーディオンの開閉状態を管理するコンテナ（button の次の要素）を取得
  const accordionItem = page.locator('div.border.border-gray-700').filter({ hasText: 'プリセット' });
  const contentContainer = accordionItem.locator('div.grid');
  await expect(contentContainer).toHaveClass(/grid-rows-\[0fr\]/);

  // 閉じているときはオプション名が表示されていない（lazy rendering）
  const optionName = page.getByText('使用するプリセット');
  await expect(optionName).not.toBeAttached();

  // アコーディオンを開く
  await accordionButton.click();
  await expect(contentContainer).toHaveClass(/grid-rows-\[1fr\]/);
  await expect(optionName).toBeVisible();

  // タブを切り替えてもアコーディオンの状態が維持されることを確認
  // ゴーストニュートラルタブに切り替え
  // ColoredText を使用しているため、厳密な一致ではなく部分一致で検索する
  await page.getByRole('button', { name: 'ゴーストニュートラル役職設定', exact: false }).click();
  await expect(page.getByRole('button', { name: 'フォラス' })).toBeVisible();

  // グローバル設定タブに戻る
  await page.getByRole('button', { name: 'グローバル設定', exact: false }).click();
  // ゲーム設定アコーディオンがまだ開いていることを確認
  await expect(optionName).toBeVisible();

  // サイドバーを切り替えて戻ってきても維持されることを確認
  await sidebar.getByRole('button', { name: 'Au Options' }).click();
  await expect(page.getByRole('heading', { name: 'Au Options JSON' })).toBeVisible();

  // 再び ExR Options に切り替え
  await sidebar.getByRole('button', { name: 'ExR Options' }).click();
  // transition を考慮して少し待つか、見出しの変更を待つ
  await expect(page.getByRole('heading', { name: 'ExR Options JSON' })).toBeVisible();
  await expect(optionName).toBeVisible();

  // アコーディオンを閉じる
  await accordionButton.click();
  await expect(contentContainer).toHaveClass(/grid-rows-\[0fr\]/);
  await expect(optionName).not.toBeAttached();
});
