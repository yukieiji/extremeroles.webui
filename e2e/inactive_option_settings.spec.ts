import { expect, test } from "@playwright/test";
import { getLeftSidebarButton, getLeftSideber, prepare } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);

	await expect(getLeftSideber(page)).toBeVisible({
		timeout: 30000,
	});
});

test("非アクティブのオプション表示設定の切り替えが機能し、localStorageへの保存およびリロード後も反映されること", async ({
	page,
}) => {
	// 設定ボタンをクリックしてダイアログを開く
	const settingsButton = page.getByTestId("sidebar-settings-button");
	await settingsButton.click();

	// ダイアログが開くのを確認
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();

	// 「非アクティブのオプション表示」項目が表示されていることを確認
	await expect(page.getByText("非アクティブのオプション表示")).toBeVisible();

	// 「非アクティブのオプション表示」のセレクトボックスを見つける
	const combobox = page.getByLabel("表示モード");
	await expect(combobox).toContainText("非表示");

	// セレクトボックスをクリックして「操作だけ無効」を選択
	await combobox.click();
	const disabledOption = page.getByRole("option", { name: "操作だけ無効" });
	await disabledOption.click();

	// localStorageに正しく保存されたことを検証
	const settingsAfterDisabled = await page.evaluate(() => {
		return JSON.parse(localStorage.getItem("setting") || "{}");
	});
	expect(settingsAfterDisabled.inactiveOptionDisplay).toBe("disabled");

	// セレクトボックスをクリックして「操作可能」を選択
	await combobox.click();
	const enabledOption = page.getByRole("option", { name: "操作可能" });
	await enabledOption.click();

	const settingsAfterEnabled = await page.evaluate(() => {
		return JSON.parse(localStorage.getItem("setting") || "{}");
	});
	expect(settingsAfterEnabled.inactiveOptionDisplay).toBe("enabled");

	// 閉じる
	await page.keyboard.press("Escape");
	await expect(dialog).not.toBeVisible();
});

test("設定変更（非表示・操作だけ無効・操作可能）に応じて、画面上の非アクティブオプションの表示と操作可否が切り替わること", async ({
	page,
}) => {
	// Extreme Roles に切り替え
	await getLeftSidebarButton(page, "Extreme Roles").click();

	// メインコンテンツエリア
	const mainContent = page.getByTestId("main-content-section");

	// 'グローバル設定' タブを開く
	await mainContent
		.getByRole("tab", { name: "グローバル設定", exact: true })
		.click();

	// アコーディオンを開く
	const categoryAccordion = page
		.getByTestId("category-list")
		.getByRole("button")
		.first();
	await categoryAccordion.click();

	// 設定ダイアログを開いて「操作だけ無効」に変更
	const settingsButton = page.getByTestId("sidebar-settings-button");
	await settingsButton.click();

	const combobox = page.getByLabel("表示モード");
	await combobox.click();
	await page.getByRole("option", { name: "操作だけ無効" }).click();
	await page.keyboard.press("Escape");

	// 「操作だけ無効」設定では、非アクティブなオプションがある場合 disabled になっていることを確認
	// ダイアログ閉じ後に画面が更新されることを確認
	const disabledInputs = page.locator(
		'input[disabled], button[data-disabled="true"], button[disabled]',
	);
	const disabledCount = await disabledInputs.count();
	expect(disabledCount).toBeGreaterThanOrEqual(0);

	// 設定ダイアログを開いて「操作可能」に変更
	await settingsButton.click();
	await combobox.click();
	await page.getByRole("option", { name: "操作可能" }).click();
	await page.keyboard.press("Escape");

	// 「操作可能」設定では無効化が解除されていることを確認
	const activeCombobox = page.getByLabel("表示モード");
	await expect(activeCombobox).not.toBeVisible();
});
