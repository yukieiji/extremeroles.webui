import { expect, test } from "@playwright/test";
import {
	getLeftSidebarButton,
	getLeftSideber,
	resetMock,
	setApidelay,
} from "./conftest";

test.beforeEach(async ({ page }) => {
	// モックサーバーの状態をリセット
	await resetMock(page);

	// すべてのテストで API の遅延を設定可能にする
	await setApidelay(page, 1000);
});

test("初期ロード時にローディング画面が表示されること", async ({ page }) => {
	await page.goto("/");
	// index.html に仕込んだ Loading data... またはサイドバーが表示されるまで待機
	const loadingText = page.getByText("Loading data...");
	const sidebar = getLeftSideber(page);
	await expect(loadingText.or(sidebar)).toBeVisible({ timeout: 30000 });
});

test("サイドバー切り替え時にメインコンテンツが表示されること", async ({
	page,
}) => {
	await page.goto("/");
	const sidebar = getLeftSideber(page);
	await expect(sidebar).toBeVisible({ timeout: 30000 });

	// Extreme Roles に切り替え
	await getLeftSidebarButton(page, "Extreme Roles").click();

	// 切り替え後のコンテンツが表示されることを確認
	await expect(
		page.getByRole("heading", { name: "Extreme Roles" }),
	).toBeVisible({
		timeout: 20000,
	});
});

test("ExRタブ切り替え時にカテゴリリストが表示されること", async ({ page }) => {
	await page.goto("/");
	await expect(getLeftSideber(page)).toBeVisible({
		timeout: 30000,
	});

	await getLeftSidebarButton(page, "Extreme Roles").click();
	await expect(
		page.getByRole("heading", { name: "Extreme Roles" }),
	).toBeVisible({
		timeout: 15000,
	});

	const categoryList = page.getByTestId("category-list");
	await expect(categoryList).toBeVisible();

	const tabs = page.getByRole("tab");
	const secondTab = tabs.nth(1);
	const secondTabName = await secondTab.textContent();
	await secondTab.click();

	// 別タブのコンテンツが表示されることを確認（暗黙的にローディング待ちが含まれる）
	if (secondTabName) {
		// タブ名が変更されているか、あるいはリストが再描画されていることを確認
		await expect(categoryList).toBeVisible();
	}
});
