import { expect, test } from "@playwright/test";
import { getLeftSideber, prepare, reload } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);

	// サイドバーが表示されるまで待機
	await expect(getLeftSideber(page)).toBeVisible({
		timeout: 30000,
	});
});

test("テーマの切り替えラジオボタンが機能し、リロード後も永続化されること", async ({
	page,
	browser,
}) => {
	// 設定ボタンをクリックしてダイアログを開く
	const settingsButton = page.getByTestId("sidebar-settings-button");
	await settingsButton.click();

	// ダイアログが開くのを確認
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();

	// テーマ設定セクションが表示されていることを確認
	await expect(page.getByText("テーマ設定")).toBeVisible();

	// 「ライト」ラジオボタンをクリック
	const lightRadio = page.getByRole("radio", { name: "ライト" });
	await lightRadio.click();

	// documentElementに「dark」クラスが含まれていないことを確認
	const isDarkAfterLight = await page.evaluate(() =>
		document.documentElement.classList.contains("dark"),
	);
	expect(isDarkAfterLight).toBe(false);

	// 「ダーク」ラジオボタンをクリック
	const darkRadio = page.getByRole("radio", { name: "ダーク" });
	await darkRadio.click();

	// documentElementに「dark」クラスが含まれていることを確認
	const isDarkAfterDark = await page.evaluate(() =>
		document.documentElement.classList.contains("dark"),
	);
	expect(isDarkAfterDark).toBe(true);

	// ページをリロードして永続化（LocalStorageへの保存）を検証
	const { newPage, newContext } = await reload(page, browser);

	const isDarkAfterReload = await newPage.evaluate(() =>
		document.documentElement.classList.contains("dark"),
	);
	expect(isDarkAfterReload).toBe(true);

	// 設定を開き「ライト」に戻す
	const newSettingsButton = newPage.getByTestId("sidebar-settings-button");
	await newSettingsButton.click();
	const newLightRadio = newPage.getByRole("radio", { name: "ライト" });
	await newLightRadio.click();

	const isDarkAfterRestore = await newPage.evaluate(() =>
		document.documentElement.classList.contains("dark"),
	);
	expect(isDarkAfterRestore).toBe(false);

	await newContext.close();
});
