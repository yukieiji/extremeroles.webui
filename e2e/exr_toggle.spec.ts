import { expect, test } from "@playwright/test";
import { getLeftSidebarButton, prepare } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);
});

test("ExR toggle switch should be visible and functional", async ({ page }) => {
	// Extreme Roles に切り替え
	await getLeftSidebarButton(page, "Extreme Roles").click();

	// 'グローバル設定' タブをクリック (デフォルトで選択されているはずだが念のため)
	// getByTestId('main-content-section') を使用して、右サイドパネルのボタンとの競合を避ける
	await page
		.getByTestId("main-content-section")
		.getByRole("tab", { name: "グローバル設定", exact: true })
		.click();

	// '乱数に関する設定' アコーディオンを開く
	const categoryAccordion = page
		.getByTestId("category-list")
		.getByRole("button", { name: "乱数に関する設定" });
	await categoryAccordion.click();

	// '強力なシャッフルを使用する' オプションの横にあるトグルを確認
	const toggle = page
		.getByTestId("category-list")
		.getByTestId("option-toggle")
		.first(); // 最初のトグルを取得
	await expect(toggle).toBeVisible();

	// 初期状態は オフ (Selection 0) ※モックの初期値がのため
	await expect(toggle).toHaveAttribute("aria-checked", "false");
	// 曖昧さを回避するため、特定のカテゴリ内を確認
	const categoryContainer = page.getByTestId("exr-category-1");
	await expect(
		categoryContainer.getByText("オフ", { exact: true }),
	).toBeVisible();

	// クリックして オン にする
	await toggle.click();

	// 状態が オフ (Selection 0) になったことを確認
	await expect(toggle).toHaveAttribute("aria-checked", "true");
	await expect(
		categoryContainer.getByText("オン", { exact: true }),
	).toBeVisible();

	// 再度クリックして オフ に戻す
	await toggle.click();
	await expect(toggle).toHaveAttribute("aria-checked", "false");
	await expect(
		categoryContainer.getByText("オフ", { exact: true }),
	).toBeVisible();
});
