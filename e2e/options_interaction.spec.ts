import { expect, test } from "@playwright/test";
import { getLeftSidebarButton, prepare } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);
});

test("Options interaction behavior", async ({ page }) => {
	await getLeftSidebarButton(page, "Extreme Roles").click();

	// ヘッダーのプリセットセレクターを確認
	const presetInput = page.getByPlaceholder("プリセット名を入力...");
	await expect(presetInput).toBeVisible();

	// 初期値 (1)
	await expect(presetInput).toHaveValue("1");

	// 名前を変更
	await presetInput.fill("Test Preset");
	await presetInput.press("Enter");

	// ドロップダウンを開いて名前が反映されているか確認
	await page
		.getByRole("combobox")
		.filter({ has: page.locator(".lucide-chevron-down") })
		.click({ force: true });
	// ドロップダウン内の項目を特定するため、より具体的なロケータを使用（サイドバーにも同じテキストが表示されるため）
	await expect(
		page.getByRole("option", { name: "Test Preset" }).first(),
	).toBeVisible();

	await page.keyboard.press("Escape");
	// 別のカテゴリの操作を確認
	const shuffleCategory = page
		.getByTestId("category-list")
		.getByRole("button", {
			name: "乱数に関する設定",
		});
	await shuffleCategory.click();

	const shuffleOption = page
		.getByTestId("category-list")
		.getByText("強力なシャッフルを使用する");
	await expect(shuffleOption).toBeVisible({ timeout: 3000 });

	// トグルスイッチに変更されたので、トグルを操作する
	const toggle = page
		.getByTestId("category-list")
		.getByTestId("option-toggle")
		.first();
	// モックの初期値がオフ(false)のため
	await expect(toggle).toHaveAttribute("aria-checked", "false");
	await expect(page.getByText("オフ", { exact: true }).first()).toBeVisible();

	// トグルを切り替え (オフ -> オン)
	await toggle.click();
	await expect(toggle).toHaveAttribute("aria-checked", "true");
	await expect(page.getByText("オン").first()).toBeVisible();
});
