import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// モックサーバーの状態をリセット
	await page.request.post("/mock/reset", { maxRetries: 5 });
	// すべてのテストで API の遅延を設定可能にする
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 100;
	});

	await page.goto("/");

	// ローディング画面が消えるのを待つ
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});

	// サイドバーが表示されるまで待機
	await expect(page.getByLabel("オプションサイドバー")).toBeVisible({
		timeout: 30000,
	});
});

test("設定ダイアログが開くこと", async ({ page }) => {
	// サイドバーの下部にある設定ボタンを探す
	const settingsButton = page.getByTestId("sidebar-settings-button");
	await expect(settingsButton).toBeVisible();

	// 設定ボタンをクリック
	await settingsButton.click();

	// ダイアログが表示されることを確認
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();

	// ダイアログ内に「設定」というタイトルがあることを確認
	const title = dialog.getByText("設定", { exact: true });
	await expect(title).toBeVisible();

	// 設定項目が表示されていることを確認
	await expect(page.getByText("デフォルト選択のタブ")).toBeVisible();
	await expect(page.getByText("カテゴリのデフォルト開閉")).toBeVisible();
});

test("サイドバーの開閉に合わせて設定ボタンの表示が切り替わること", async ({
	page,
}) => {
	const settingsButton = page.getByTestId("sidebar-settings-button");

	// 初期状態（サイドバーが開いている想定）
	await expect(settingsButton).toContainText("設定");

	// サイドバーを閉じるボタンをクリック
	// サイドバーのトグルボタンを取得
	const toggleButton = page.getByRole("button", {
		name: /サイドバーを(閉じる|開く)/,
	});
	await toggleButton.click();

	// サイドバーが閉じた状態ではテキストが表示されないことを確認
	await expect(settingsButton).not.toContainText("設定");

	// 再度開く
	await toggleButton.click();
	await expect(settingsButton).toContainText("設定");
});
