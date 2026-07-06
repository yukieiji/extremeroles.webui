import { expect, test } from "@playwright/test";
import { resetMock } from "./conftest";

test.beforeEach(async ({ page, browserName }) => {
	await resetMock(page);
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
	const exportButton = page.getByRole("button", { name: "エクスポート" });
	await expect(exportButton).toBeVisible();

	// ボタンをクリックしてダウンロードを待機
	const downloadPromise = page.waitForEvent("download");
	await exportButton.click();
	const download = await downloadPromise;

	// ファイル名を確認 (export_... .csv)
	expect(download.suggestedFilename()).toMatch(/^export_.*\.csv$/);
});
