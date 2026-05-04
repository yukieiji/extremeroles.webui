import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.request.post("/mock/reset", { maxRetries: 5 });
	await page.goto("/");
	await expect(page.getByRole("heading", { name: "Au Options" })).toBeVisible({
		timeout: 15000,
	});
});

test("export button triggers download", async ({ page }) => {
	// エクスポートボタンが表示されていることを確認
	const exportButton = page.getByLabel("CSVとしてエクスポート");
	await expect(exportButton).toBeVisible();

	// ボタンをクリックしてダウンロードを待機
	const downloadPromise = page.waitForEvent("download");
	await exportButton.click();
	const download = await downloadPromise;

	// ファイル名を確認 (export_... .csv)
	expect(download.suggestedFilename()).toMatch(/^export_.*\.csv$/);
});
