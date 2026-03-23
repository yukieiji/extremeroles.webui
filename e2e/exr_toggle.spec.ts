import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 100;
	});

	await page.goto("/");

	// Wait for initial load
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});
});

test("ExR toggle switch should be visible and functional", async ({ page }) => {
	const sidebar = page.getByLabel("オプションサイドバー");

	// ExR Options に切り替え
	await sidebar.getByRole("button", { name: "ExR Options" }).click();

	// 'グローバル設定' タブをクリック (デフォルトで選択されているはずだが念のため)
	await page
		.getByRole("button", { name: "グローバル設定", exact: true })
		.click();

	// '乱数に関する設定' アコーディオンを開く
	const categoryAccordion = page.getByText("乱数に関する設定");
	await categoryAccordion.click();

	// '強力なシャッフルを使用する' オプションの横にあるトグルを確認
	const toggle = page.getByTestId("option-toggle").first(); // 最初のトグルを取得
	await expect(toggle).toBeVisible();

	// 初期状態は オフ (Selection 0)
	await expect(toggle).toHaveAttribute("aria-checked", "false");
	await expect(page.getByText("オフ")).toBeVisible();

	// クリックして オン にする
	await toggle.click();

	// 状態が オン (Selection 1) になったことを確認
	await expect(toggle).toHaveAttribute("aria-checked", "true");
	await expect(page.getByText("オン", { exact: true })).toBeVisible();

	// 再度クリックして オフ に戻す
	await toggle.click();
	await expect(toggle).toHaveAttribute("aria-checked", "false");
	await expect(page.getByText("オフ")).toBeVisible();
});
