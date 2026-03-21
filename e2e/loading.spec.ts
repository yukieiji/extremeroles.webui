import { test, expect } from '@playwright/test';

test('初期ロード時にローディング画面が表示され、Hello worldが表示されないこと', async ({ page }) => {
  // ページにアクセス
  await page.goto('/');

  // "Hello world!" というテキストが存在しないことを確認
  await expect(page.getByText('Hello world!')).not.toBeVisible();

  // データ取得完了後、メインコンテンツが表示されることを確認
  // サイドバーが表示されるまで待機
  await expect(page.getByLabel('オプションサイドバー')).toBeVisible({ timeout: 15000 });

  // 少なくともデータ取得が完了すれば "Loading data..." は消えているはず
  await expect(page.getByText('Loading data...')).not.toBeVisible();
});
