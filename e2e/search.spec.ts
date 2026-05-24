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

test("Option search bar navigates to option", async ({ page }) => {
	const searchBar = page.getByPlaceholder("オプションを検索...");
	await expect(searchBar).toBeVisible();

	// Search for an option (using a known option from mocks)
	await searchBar.fill("map");

	// Wait a bit for results to populate in the store
	await page.waitForTimeout(1000);

	const selectTrigger = page.locator(
		'button[role="combobox"]:has-text("検索結果から選択")',
	);
	await expect(selectTrigger).toBeVisible({ timeout: 10000 });
	await selectTrigger.click();

	// Wait for the popup and select an item
	const popup = page.locator('[data-slot="select-content"]');
	await expect(popup).toBeVisible();

	const optionItem = popup.getByRole("option", { name: "map" }).first();
	await expect(optionItem).toBeVisible();
	await optionItem.click();

	// Verify navigation (check if correct tab is selected)
	await expect(page.getByRole("heading", { name: "Au Options" })).toBeVisible();
});

test("Option search bar navigates to ExR option", async ({ page }) => {
	const searchBar = page.getByPlaceholder("オプションを検索...");
	await searchBar.fill("プリセット");

	await page.waitForTimeout(1000);

	const selectTrigger = page.locator(
		'button[role="combobox"]:has-text("検索結果から選択")',
	);
	await expect(selectTrigger).toBeVisible({ timeout: 10000 });
	await selectTrigger.click();

	const popup = page.locator('[data-slot="select-content"]');
	await expect(popup).toBeVisible();

	const optionItem = popup.getByRole("option", { name: /プリセット/ }).first();
	await expect(optionItem).toBeVisible();
	await optionItem.click();

	// Verify navigation to ExR tab
	await expect(
		page.getByRole("heading", { name: "ExR Options" }),
	).toBeVisible();
});
