import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// すべてのテストで API の遅延を設定可能にする
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 100;
	});

	await page.goto("/");

	// ローディング画面が消えるのを待つ
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});
});

test("ExR Option Accordion behavior", async ({ page }) => {
	const sidebar = page.getByLabel("オプションサイドバー");
	await sidebar.getByRole("button", { name: "ExR Options" }).click();

	// プリセットカテゴリは非表示になったため、別のカテゴリ「乱数に関する設定」を使用する
	const categoryName = "乱数に関する設定";
	const accordionButton = page.getByRole("button", { name: categoryName });
	await expect(accordionButton).toBeVisible();

	// 初期状態では閉じている
	const accordionItem = page
		.locator("div.border.border-gray-700")
		.filter({ hasText: categoryName });
	const contentContainer = accordionItem.getByTestId("accordion-content");
	await expect(contentContainer).toHaveClass(/grid-rows-\[0fr\]/);

	// 閉じているときはオプション名が表示されていない（lazy rendering）
	const optionName = page.getByText("強力なシャッフルを使用する");
	await expect(optionName).not.toBeAttached();

	// アコーディオンを開く
	await accordionButton.click();
	await expect(contentContainer).toHaveClass(/grid-rows-\[1fr\]/);
	await expect(optionName).toBeVisible();

	// タブを切り替えてもアコーディオンの状態が維持されることを確認
	await page
		.getByRole("button", { name: "ゴーストニュートラル役職設定", exact: false })
		.click();
	await expect(page.getByRole("button", { name: "フォラス" })).toBeVisible();

	// グローバル設定タブに戻る
	await page
		.getByRole("button", { name: "グローバル設定", exact: false })
		.click();
	// アコーディオンがまだ開いていることを確認
	await expect(optionName).toBeVisible();

	// サイドバーを切り替えて戻ってきても維持されることを確認
	await sidebar.getByRole("button", { name: "Au Options" }).click();
	await expect(page.getByRole("heading", { name: "Au Options" })).toBeVisible();

	await sidebar.getByRole("button", { name: "ExR Options" }).click();
	await expect(optionName).toBeVisible();

	// アコーディオンを閉じる
	await accordionButton.click();
	await expect(contentContainer).toHaveClass(/grid-rows-\[0fr\]/);
	await expect(optionName).not.toBeAttached();
});
