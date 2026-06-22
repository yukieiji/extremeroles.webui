import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.request.post("/mock/reset", { maxRetries: 5 });
	await page.goto("/");
	// wait for main content instead of just "Loading data..." absence
	await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible({
		timeout: 15000,
	});
});

test("CSV import flow shows confirmation and triggers sync", async ({
	page,
}) => {
	// 1. Check if Import Button is visible
	const importButton = page.getByTitle("CSVインポート");
	await expect(importButton).toBeVisible();

	// 2. Mock file selection
	const fileChooserPromise = page.waitForEvent("filechooser");
	await importButton.click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles({
		name: "test.csv",
		mimeType: "text/csv",
		buffer: Buffer.from("test,csv,content"),
	});

	// 3. Check for confirmation dialog
	await expect(page.getByText("インポートの確認")).toBeVisible();
	await expect(
		page.getByText("CSVファイルをインポートして設定を上書きしますか？"),
	).toBeVisible();

	// 4. Confirm import
	await page.getByRole("button", { name: "OK" }).click();

	// 5. Verify sync overlay appears (it should because we use backendUpdater)
	await expect(page.getByText("Synchronizing...")).toBeVisible();
	await expect(page.getByText("Synchronizing...")).not.toBeVisible({
		timeout: 10000,
	});
});
