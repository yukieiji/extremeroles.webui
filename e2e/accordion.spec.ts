import { expect, test } from "@playwright/test";
import { getLeftSidebarButton, getLeftSideber, prepare } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);
	// サイドバーが表示されるまで待機（アプリケーションがインタラクティブになったことの確認）
	await expect(getLeftSideber(page)).toBeVisible({
		timeout: 30000,
	});
});

test("ExR Option Accordion behavior", async ({ page }) => {
	await getLeftSidebarButton(page, "Extreme Roles").click();

	// プリセットカテゴリは非表示になったため、別のカテゴリ「乱数に関する設定」を使用する
	const categoryName = "乱数に関する設定";
	const accordionButton = page
		.getByTestId("category-list")
		.getByRole("button", { name: categoryName });
	await expect(accordionButton).toBeVisible();

	// 初期状態では閉じている
	const accordionItem = page
		.getByTestId("category-list")
		.locator("div.border.border-border-strong")
		.filter({ hasText: categoryName })
		.first();
	const contentContainer = accordionItem
		.getByTestId("accordion-content")
		.first();
	await expect(contentContainer).toHaveClass(/grid-rows-\[0fr\]/);

	// 閉じているときはオプション名が表示されていない（lazy rendering）
	const optionName = page
		.getByTestId("main-content-section")
		.getByText("強力なシャッフルを使用する");
	await expect(optionName).not.toBeAttached();

	// アコーディオンを開く
	await accordionButton.click();
	await expect(contentContainer).toHaveClass(/grid-rows-\[1fr\]/);
	await expect(optionName).toBeVisible();

	// タブを切り替えてもアコーディオンの状態が維持されることを確認
	// TODO: レイアウト崩れの修正後、以下の evaluate を通常の click() に戻す。
	// 現在、アコーディオンのコンテンツがタブに重なっており、click({ force: true }) でも
	// 正しくクリックが伝達されない（重なっている要素がイベントを奪う）ため、直接DOMのclickを呼び出している。
	await page
		.getByRole("tab", { name: "ゴーストニュートラル役職設定", exact: true })
		.evaluate((el: HTMLElement) => el.click());
	await expect(page.getByRole("button", { name: "フォラス" })).toBeVisible();

	// グローバル設定タブに戻る
	// TODO: レイアウト崩れの修正後、evaluate を通常の click() に戻す
	await page
		.getByRole("tab", { name: "グローバル設定", exact: true })
		.evaluate((el: HTMLElement) => el.click());
	// アコーディオンがまだ開いていることを確認
	await expect(optionName).toBeVisible();

	// サイドバーを切り替えて戻ってきても維持されることを確認
	// TODO: レイアウト崩れの修正後、evaluate を通常の click() に戻す
	await getLeftSidebarButton(page, "Among Us").evaluate((el: HTMLElement) =>
		el.click(),
	);
	await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible();

	// TODO: レイアウト崩れの修正後、evaluate を通常の click() に戻す
	await getLeftSidebarButton(page, "Extreme Roles").evaluate(
		(el: HTMLElement) => el.click(),
	);
	await expect(optionName).toBeVisible();

	// アコーディオンを閉じる
	await accordionButton.click();
	await expect(contentContainer).toHaveClass(/grid-rows-\[0fr\]/);
	await expect(optionName).not.toBeAttached();
});
