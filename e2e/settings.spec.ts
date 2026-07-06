import { expect, test } from "@playwright/test";
import { getLeftSideber, prepare } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);

	// サイドバーが表示されるまで待機
	await expect(getLeftSideber(page)).toBeVisible({
		timeout: 30000,
	});
});

test("設定ダイアログが開くこと", async ({ page }) => {
	// サイドバーの下部にある設定ボタンを探す
	const settingsButton = page.getByTestId("sidebar-settings-button");
	await expect(settingsButton).toBeVisible();

	// 設定ボタンをクリック
	await settingsButton.click();

	// ダイアログが表示されることを確認
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();

	// ダイアログ内に「設定」というタイトルがあることを確認
	const title = dialog.getByText("設定", { exact: true });
	await expect(title).toBeVisible();

	// 準備中のテキストがあることを確認
	await expect(page.getByText("設定項目は現在準備中です。")).toBeVisible();
});

test("サイドバーの開閉に合わせて設定ボタンの表示が切り替わること", async ({
	page,
}) => {
	const settingsButton = page.getByTestId("sidebar-settings-button");

	// 初期状態（サイドバーが開いている想定）
	await expect(settingsButton.getByText("設定")).toBeVisible();

	// サイドバーを閉じるボタンをクリック
	// サイドバーのトグルボタンを取得
	const toggleButton = page.locator('[data-sidebar="trigger"]');
	await toggleButton.click();

	// サイドバーが閉じた状態ではテキストが表示されないことを確認
	await expect(settingsButton.getByText("設定")).not.toBeVisible();

	// 再度開く
	await toggleButton.click();
	await expect(settingsButton.getByText("設定")).toBeVisible();
});
