import { expect, test } from "@playwright/test";
import { getLeftSideber, prepare } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);

	// サイドバーが表示されるまで待機
	await expect(getLeftSideber(page)).toBeVisible({
		timeout: 30000,
	});
});

test("テーマの切り替えラジオボタンが機能し、ページにクラスが正しく付与および保存されること", async ({
	page,
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

	// LocalStorageにthemeが「light」として保存されていることを検証
	const localStorageThemeAfterLight = await page.evaluate(() => {
		const setting = localStorage.getItem("setting");
		return setting ? JSON.parse(setting).theme : null;
	});
	expect(localStorageThemeAfterLight).toBe("light");

	// 「ダーク」ラジオボタンをクリック
	const darkRadio = page.getByRole("radio", { name: "ダーク" });
	await darkRadio.click();

	// documentElementに「dark」クラスが含まれていることを確認
	const isDarkAfterDark = await page.evaluate(() =>
		document.documentElement.classList.contains("dark"),
	);
	expect(isDarkAfterDark).toBe(true);

	// LocalStorageにthemeが「dark」として保存されていることを検証
	const localStorageThemeAfterDark = await page.evaluate(() => {
		const setting = localStorage.getItem("setting");
		return setting ? JSON.parse(setting).theme : null;
	});
	expect(localStorageThemeAfterDark).toBe("dark");
});
