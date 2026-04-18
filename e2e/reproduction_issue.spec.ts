import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 0;
	});
	await page.goto("/");
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});

	// サイドバーが表示されるまで待機（アプリケーションがインタラクティブになったことの確認）
	await expect(page.getByLabel("オプションサイドバー")).toBeVisible({
		timeout: 15000,
	});

	await page.getByRole("button", { name: "ExR Options" }).click();
});