import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// モックサーバーの状態をリセット
	await page.request.post("/mock/reset", { maxRetries: 5 });
});

test("初期ロード時にフェッチが失敗した場合、エラー画面が表示されること", async ({
	page,
}) => {
	// APIリクエストを失敗させる
	await page.route("**/au/translation/batch/**", (route) => {
		return route.abort("failed");
	});

	await page.goto("/");

	// エラー画面が表示されることを確認
	const errorTitle = page.getByText("エラーが発生しました");
	await expect(errorTitle).toBeVisible({ timeout: 15000 });

	const retryButton = page.getByRole("button", { name: "再試行" });
	await expect(retryButton).toBeVisible();

	// 再試行で成功するようにルートを解除
	await page.unroute("**/au/translation/batch/**");
	await page.unroute("**/exr/option/");
	await page.unroute("**/au/option/");
	await page.unroute("**/exr/role/filter/");

	await retryButton.click();

	// エラー画面が消えることを確認
	await expect(errorTitle).not.toBeVisible();
});

test("再試行してもフェッチが失敗し続ける場合、エラー画面が再度表示されること", async ({
	page,
}) => {
	// APIリクエストを永続的に失敗させる
	await page.route("**/au/translation/batch/**", (route) => {
		return route.abort("failed");
	});

	await page.goto("/");

	// エラー画面が表示されることを確認
	const errorTitle = page.getByText("エラーが発生しました");
	await expect(errorTitle).toBeVisible({ timeout: 15000 });

	const retryButton = page.getByRole("button", { name: "再試行" });

	// 2回再試行を試みる
	for (let i = 0; i < 2; i++) {
		await retryButton.click();
		// 再度エラー画面が表示されることを確認
		await expect(errorTitle).toBeVisible({ timeout: 15000 });
	}
});
