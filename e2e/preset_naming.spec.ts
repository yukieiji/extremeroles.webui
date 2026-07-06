import { expect, test } from "@playwright/test";
import { getLeftSidebarButton, getLeftSideber, prepare } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);
	// タイムアウトを延長
	test.setTimeout(60000);
});

test("Preset naming and persistence behavior", async ({ page }) => {
	const sidebar = getLeftSideber(page);
	const exrButton = getLeftSidebarButton(page, "Extreme Roles");
	await exrButton.click();

	// ヘッダーのプリセットセレクターを確認
	const presetInput = page.getByPlaceholder("プリセット名を入力...");
	await expect(presetInput).toBeVisible({ timeout: 15000 });

	// プリセット 1 (index 0) に名前を付ける
	await presetInput.fill("Hardcore Rules");
	await presetInput.press("Enter");

	// ドロップダウンを開く
	const selectButton = page
		.getByRole("combobox")
		.filter({ has: page.locator(".lucide-chevron-down") });
	await expect(selectButton).toBeVisible();
	await selectButton.click({ force: true });
	await page.waitForSelector('[data-slot="select-content"]');

	// プリセット 2 (index 1) に切り替える
	const preset2Button = page.getByRole("option", { name: "10", exact: true });
	await expect(preset2Button).toBeVisible();
	await preset2Button.click();

	// 確認ダイアログが表示されることを確認
	await expect(page.getByText("プリセットの切り替え")).toBeVisible();
	await page.getByRole("button", { name: "OK" }).click();

	// ローディングが表示され、消えるのを待つ
	// すぐに消える可能性があるので、toBeVisible は必須とせず、消えるのを待つ
	await expect(page.getByText("Synchronizing...")).not.toBeVisible({
		timeout: 15000,
	});

	// 入力欄が index 1 のデフォルト値 "2" になっていることを確認
	await expect(presetInput).toHaveValue("10");

	// プリセット 2 (index 1) に名前を付ける
	await presetInput.fill("Casual Fun");
	await presetInput.blur(); // onBlur での保存をテスト

	// ページをリロードして LocalStorage から復元されるか確認
	await page.goto("/");

	// ローディング画面が消えるのを待つ
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 45000,
	});

	// サイドバーの再表示を待つ
	await expect(sidebar).toBeVisible({ timeout: 30000 });
	await expect(exrButton).toBeVisible({ timeout: 30000 });
	await exrButton.click();

	// 初期状態では index 0 (プリセット 1) が選択されるはずなので、名前が Hardcore Rules であることを確認
	await expect(presetInput).toHaveValue("Hardcore Rules", { timeout: 15000 });

	// ドロップダウンを開いて index 1 の名前が保持されていることを確認
	await expect(selectButton).toBeVisible();
	await selectButton.click({ force: true });
	await page.waitForSelector('[data-slot="select-content"]');
	const casualFunButton = page.getByRole("option", { name: "Casual Fun" });
	await expect(casualFunButton).toBeVisible();

	// index 1 (Casual Fun) に切り替える
	await casualFunButton.click();
	// 確認ダイアログで OK
	await page.getByRole("button", { name: "OK" }).click();

	// ローディング待ち
	await expect(page.getByText("Synchronizing...")).not.toBeVisible({
		timeout: 10000,
	});

	await expect(presetInput).toHaveValue("Casual Fun");
});
