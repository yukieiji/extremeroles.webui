import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// モックサーバーの状態をリセット
	await page.request.post("/mock/reset", { maxRetries: 5 });
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
	// getByTestId('main-content-section') を使用して、右フローティングパネルのボタンとの競合を避ける
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

	// 初期状態は オン (Selection 1) ※モックの初期値が1のため
	await expect(toggle).toHaveAttribute("aria-checked", "true");
	// 曖昧さを回避するため、特定のカテゴリ内を確認
	const categoryContainer = page.getByTestId("exr-category-1");
	await expect(
		categoryContainer.getByText("オン", { exact: true }),
	).toBeVisible();

	// クリックして オフ にする
	await toggle.click();

	// 状態が オフ (Selection 0) になったことを確認
	await expect(toggle).toHaveAttribute("aria-checked", "false");
	await expect(
		categoryContainer.getByText("オフ", { exact: true }),
	).toBeVisible();

	// 再度クリックして オン に戻す
	await toggle.click();
	await expect(toggle).toHaveAttribute("aria-checked", "true");
	await expect(
		categoryContainer.getByText("オン", { exact: true }),
	).toBeVisible();
});
