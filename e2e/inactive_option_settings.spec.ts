import { expect, test } from "@playwright/test";
import { getLeftSideber, prepare, reload } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);

	await expect(getLeftSideber(page)).toBeVisible({
		timeout: 30000,
	});
});

test("非アクティブのオプション表示設定の切り替えが機能し、localStorageへの保存およびリロード後も反映されること", async ({
	page,
	browser,
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

	// ページリロード後も設定が永続化されていることを検証
	const { newPage, newContext } = await reload(page, browser);

	const storedSettings = await newPage.evaluate(() => {
		return JSON.parse(localStorage.getItem("setting") || "{}");
	});
	expect(storedSettings.inactiveOptionDisplay).toBe("enabled");

	await newContext.close();
});
