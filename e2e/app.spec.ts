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
	await expect(page.locator('[data-slot="sidebar"]')).toBeVisible({
		timeout: 30000,
	});
});

test("has sidebar and au option editor", async ({ page }) => {
	const sidebar = page.locator('[data-slot="sidebar"]');

	// サイドバー内のボタンを明示的に指定
	await expect(sidebar.getByRole("button", { name: "Among Us" })).toBeVisible();
	await expect(
		sidebar.getByRole("button", { name: "Extreme Roles" }),
	).toBeVisible();

	// Among Us が初期で表示されることを確認する
	await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible();

	// アコーディオンが表示されていることを確認 (JSON preはなくなった)
	await expect(page.getByTestId("category-list")).toBeVisible();

	// Extreme Roles に切り替え
	await sidebar.getByRole("button", { name: "Extreme Roles" }).click();
	await expect(
		page.getByRole("heading", { name: "Extreme Roles" }),
	).toBeVisible();
	// JSON pre はなくなったので、アコーディオンが表示されていることを確認
	await expect(
		page
			.getByTestId("main-content-section")
			.getByRole("tab", { name: "グローバル設定", exact: false }),
	).toBeVisible();

	// サイドバーの開閉
	// 閉じる
	await page.getByTitle("Close Sidebar").click();
	// shadcn sidebar collapsible="icon" doesn't remove elements from DOM,
	// it just hides or shrinks them.
	// We check the data-state attribute on the sidebar element.
	await expect(page.locator('[data-slot="sidebar"]')).toHaveAttribute(
		"data-state",
		"collapsed",
	);

	// 開く
	await page.getByTitle("Open Sidebar").click();
	await expect(page.locator('[data-slot="sidebar"]')).toHaveAttribute(
		"data-state",
		"expanded",
	);
});
