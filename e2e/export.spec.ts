import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page, browserName }) => {
	await page.request.post("/mock/reset", { maxRetries: 5 });
	if (browserName === "chromium") {
		// showSaveFilePicker を無効化してフォールバックをテストする
		// (showSaveFilePicker は Playwright の download イベントを発生させないため)
		await page.addInitScript(() => {
			// biome-ignore lint/suspicious/noExplicitAny: mock
			delete (window as any).showSaveFilePicker;
		});
	}
	await page.goto("/");
	await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible({
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
