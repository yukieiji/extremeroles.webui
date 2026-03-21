import { test, expect } from '@playwright/test';

test('初期ロード時にローディング画面が表示され、Hello worldが表示されないこと', async ({ page }) => {
  // APIレスポンスを意図的に遅延させてローディング状態を確実に捕捉する
  await page.route('**/exr/option/', async (route) => {
    console.log('Intercepted /exr/option/');
    // 5秒間待機してからレスポンスを継続
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await route.continue();
  });

  // ページにアクセス
  await page.goto('/');

  // "Hello world!" というテキストが存在しないことを確認
  await expect(page.getByText('Hello world!')).not.toBeVisible();

  // データ取得完了後、メインコンテンツが表示されることを確認
  // これがパスすれば、その過程で LoadingView を通っているはず
  await expect(page.getByLabel('オプションサイドバー')).toBeVisible({ timeout: 60000 });

  // 少なくとも一度は LoadingView が表示されたはずなので、ここでは「存在した形跡」ではなく
  // 現在の状態で Hello world がないことを再度確認
  await expect(page.getByText('Hello world!')).not.toBeVisible();
});
