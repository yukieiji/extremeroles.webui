import { test, expect } from '@playwright/test';

test('ExR Option Accordion behavior', async ({ page }) => {
  await page.goto('/');

  const sidebar = page.getByLabel('オプションサイドバー');
  await sidebar.getByRole('button', { name: 'ExR Options' }).click();

  // カテゴリ「プリセット」のアコーディオンがあることを確認
  const accordionButton = page.getByRole('button', { name: 'プリセット' });
  await expect(accordionButton).toBeVisible();

  // 初期状態では閉じている（JSONが表示されていない）
  const jsonPre = page.getByTestId('category-json-0');
  // アコーディオンのコンテンツ部分は DOM にはあるが、高さ 0 で隠されている。
  // grid-rows-[0fr] かつ overflow-hidden の場合、Playwright では visibility をどう判断するかによる。
  // 以前のテスト結果では visible と判定されていたため、属性やスタイルを直接確認するか、
  // あるいはコンテンツの高さが 0 であることを確認する。
  const container = jsonPre.locator('xpath=./../../../..');
  await expect(container).toHaveClass(/grid-rows-\[0fr\]/);

  // アコーディオンを開く
  await accordionButton.click();
  await expect(jsonPre).toBeVisible();
  await expect(jsonPre).toContainText('"TranslatedName": "使用するプリセット"');

  // タブを切り替えてもアコーディオンの状態が維持されることを確認
  // ゴーストニュートラルタブに切り替え
  // ColoredText を使用しているため、厳密な一致ではなく部分一致で検索する
  await page.getByRole('button', { name: 'ゴーストニュートラル役職設定', exact: false }).click();
  await expect(page.getByRole('button', { name: 'フォラス' })).toBeVisible();

  // グローバル設定タブに戻る
  await page.getByRole('button', { name: 'グローバル設定', exact: false }).click();
  // ゲーム設定アコーディオンがまだ開いていることを確認
  await expect(jsonPre).toBeVisible();

  // サイドバーを切り替えて戻ってきても維持されることを確認
  await sidebar.getByRole('button', { name: 'Au Options' }).click();
  await expect(page.getByRole('heading', { name: 'Au Options JSON' })).toBeVisible();

  await sidebar.getByRole('button', { name: 'ExR Options' }).click();
  await expect(jsonPre).toBeVisible();

  // アコーディオンを閉じる
  await accordionButton.click();
  await expect(container).toHaveClass(/grid-rows-\[0fr\]/);
});
