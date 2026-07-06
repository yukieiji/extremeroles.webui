import { expect, test } from "@playwright/test";
import { getDialog, getRightSidebar, prepare, reload } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);
});

test("サイドバーの設定変更とlocalStorageへの保存が正しく行われること", async ({
	page,
}) => {
	// 設定ダイアログを開く
	const settingsButton = page.getByTestId("sidebar-settings-button");
	await settingsButton.click();

	// 初期状態では「保存する」がオンなので「初期状態」セレクトボックスは無効
	const leftInitialSelectByLabel = page.getByLabel("初期状態").first();
	await expect(leftInitialSelectByLabel).toBeDisabled();

	// 「保存する」をオフにする
	await page.getByText("状態をブラウザに保存する").first().click();

	// 「初期状態」セレクトボックスが有効になる
	await expect(leftInitialSelectByLabel).toBeEnabled();

	// 「初期状態」を「閉じる」に変更
	await leftInitialSelectByLabel.click();
	await page.getByRole("option", { name: "閉じる" }).click();

	// localStorageに正しく保存されているか確認
	const settings = await page.evaluate(() => {
		return JSON.parse(localStorage.getItem("setting") || "{}");
	});

	expect(settings.leftSidebar.saveState).toBe(false);
	expect(settings.leftSidebar.initialOpen).toBe(false);
});

test("保存設定が無効な場合、リロード後に初期状態の設定が適用されること", async ({
	page,
	browser,
}) => {
	// 1. 設定ダイアログを開く
	const settingsButton = page.getByTestId("sidebar-settings-button");
	await settingsButton.click();

	// 2. 左サイドバーの設定: 保存しない、初期状態=閉じ
	await page.getByText("状態をブラウザに保存する").first().click(); // オフにする
	const leftInitialSelect = page.getByLabel("初期状態").first();
	await leftInitialSelect.click();
	await page.getByRole("option", { name: "閉じる" }).click();

	// 3. 右サイドバーの設定: 保存しない、初期状態=閉じ
	await page.getByText("状態をブラウザに保存する").last().click(); // オフにする
	const rightInitialSelect = page.getByLabel("初期状態").last();
	await rightInitialSelect.click();
	await page.getByRole("option", { name: "閉じる" }).click();

	// 4. 設定を閉じる
	await page.keyboard.press("Escape");
	await expect(getDialog(page)).not.toBeVisible();

	// 5. リロード
	const { newPage, newContext } = await reload(page, browser);

	// 6. 保存設定が無効なので、localStorageの値ではなく初期状態の設定（閉じた状態）が適用されるはず
	const sidebar = newPage.locator('[data-slot="sidebar"][data-side="left"]');
	await expect(sidebar).toHaveAttribute("data-state", "collapsed", {
		timeout: 15000,
	});

	const rightSidebar = getRightSidebar(newPage);
	await expect(rightSidebar).toHaveAttribute("data-state", "closed", {
		timeout: 15000,
	});

	await newContext.close();
});
