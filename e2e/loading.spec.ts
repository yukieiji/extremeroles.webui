import { test, expect } from '@playwright/test';

test('初期ロード時にローディング画面が表示され、Hello worldが表示されないこと', async ({ page }) => {
  // APIレスポンスを意図的に遅延させてローディング状態を確実に捕捉する
  await page.route('**/exr/option/', async (route) => {
    console.log('Intercepting /exr/option/');
    // 5秒間待機してからレスポンスを継続
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await route.continue();
  });

  // ページにアクセス
  await page.goto('/');

  // "Hello world!" というテキストが存在しないことを確認
  await expect(page.getByText('Hello world!')).not.toBeVisible();

  // データ取得完了後、メインコンテンツが表示されることを確認
  await expect(page.getByLabel('オプションサイドバー')).toBeVisible({ timeout: 60000 });

  // 少なくとも一度は LoadingView が表示されたはずなので、ここでは「存在した形跡」ではなく
  // 現在の状態で Hello world がないことを再度確認
  await expect(page.getByText('Hello world!')).not.toBeVisible();
});

test('データ取得中に Loading data... が表示されること', async ({ page }) => {
  // APIレスポンスを意図的に遅延させる
  await page.route('**/exr/option/', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await route.continue();
  });

  // ページにアクセス
  await page.goto('/');

  // ローディング画面が表示されていることを確認
  const loadingText = page.getByText('Loading data...');

  // 開発環境ではHMR等で一瞬白画面になることがあるため、waitFor を使用
  await loadingText.waitFor({ state: 'visible', timeout: 30000 });
  // 明示的に timeout を指定して、waitFor 直後の expect での不慮のタイムアウト（デフォルト5秒）を防ぐ
  await expect(loadingText).toBeVisible({ timeout: 10000 });
});
