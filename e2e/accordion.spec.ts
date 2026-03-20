import { test, expect } from '@playwright/test';

test('ExR Option Accordion behavior', async ({ page }) => {
  await page.goto('/');

  const sidebar = page.getByLabel('オプションサイドバー');
  await sidebar.getByRole('button', { name: 'ExR Options' }).click();

  // カテゴリ「ゲーム設定」のアコーディオンがあることを確認
  const accordionButton = page.getByRole('button', { name: 'ゲーム設定' });
  await expect(accordionButton).toBeVisible();

  // 初期状態では閉じている（JSONが表示されていない）
  const jsonPre = page.getByTestId('category-json-1');
  // アコーディオンのコンテンツ部分は DOM にはあるが、高さ 0 で隠されている。
  // Playwright の expect(jsonPre).not.toBeVisible() はこれにマッチするはず。
  await expect(jsonPre).not.toBeVisible();

  // アコーディオンを開く
  await accordionButton.click();
  await expect(jsonPre).toBeVisible();
  await expect(jsonPre).toContainText('"TransedName": "移動速度"');

  // タブを切り替えてもアコーディオンの状態が維持されることを確認
  // クルーメイトタブに切り替え
  await page.getByRole('button', { name: 'クルーメイト' }).click();
  await expect(page.getByRole('button', { name: '役職設定' })).toBeVisible();

  // 基本設定タブに戻る
  await page.getByRole('button', { name: '基本設定' }).click();
  // ゲーム設定アコーディオンがまだ開いていることを確認
  await expect(jsonPre).toBeVisible();

  // サイドバーを切り替えて戻ってきても維持されることを確認
  await sidebar.getByRole('button', { name: 'Au Options' }).click();
  await expect(page.getByRole('heading', { name: 'Au Options JSON' })).toBeVisible();

  await sidebar.getByRole('button', { name: 'ExR Options' }).click();
  await expect(jsonPre).toBeVisible();

  // アコーディオンを閉じる
  await accordionButton.click();
  await expect(jsonPre).not.toBeVisible();
});
