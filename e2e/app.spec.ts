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

	// サイドバーが表示されるまで待機（アプリケーションがインタラクティブになったことの確認）
	await expect(page.getByLabel("オプションサイドバー")).toBeVisible({
		timeout: 30000,
	});
});

test("has sidebar and au option editor", async ({ page }) => {
	const sidebar = page.getByLabel("オプションサイドバー");

	// サイドバー内のボタンを明示的に指定
	await expect(
		sidebar.getByRole("button", { name: "Au Options" }),
	).toBeVisible();
	await expect(
		sidebar.getByRole("button", { name: "ExR Options" }),
	).toBeVisible();

	// Au Options が初期で表示されることを確認する
	await expect(page.getByRole("heading", { name: "Au Options" })).toBeVisible();

	// アコーディオンが表示されていることを確認 (JSON preはなくなった)
	await expect(page.getByTestId("category-list")).toBeVisible();

	// ExR Options に切り替え
	await sidebar.getByRole("button", { name: "ExR Options" }).click();
	await expect(
		page.getByRole("heading", { name: "ExR Options" }),
	).toBeVisible();
	// JSON pre はなくなったので、アコーディオンが表示されていることを確認
	await expect(
		page
			.locator('[data-testid="main-content-section"]')
			.getByRole("button", { name: "グローバル設定", exact: false }),
	).toBeVisible();

	// サイドバーの開閉
	await page.getByRole("button", { name: "サイドバーを閉じる" }).click();
	await expect(sidebar.getByRole("navigation")).not.toBeAttached({
		timeout: 10000,
	});

	await page.getByRole("button", { name: "サイドバーを開く" }).click();
	await expect(sidebar.getByRole("navigation")).toBeVisible({ timeout: 10000 });
});
