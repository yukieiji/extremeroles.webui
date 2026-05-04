import { expect, test } from "@playwright/test";

test.describe("Role Filter Tab", () => {
	test.beforeEach(async ({ page }) => {
		// モックを使用する設定でページを開く
		await page.goto("/");

		// ローディング画面が消えるのを待つ
		await expect(page.getByText("Loading data...")).not.toBeVisible({
			timeout: 30000,
		});

		// サイドバーが表示されるまで待機（アプリケーションがインタラクティブになったことの確認）
		await expect(page.getByLabel("オプションサイドバー")).toBeVisible({
			timeout: 30000,
		});
	});

	test("should display Role Filter data when the tab is selected", async ({
		page,
	}) => {
		// Role Filter タブをクリック (ショートカット 'R')
		// サイドバーが開いている場合(button)と閉じている場合(titleのみ)の両方に対応
		await page
			.getByRole("button", { name: "Role Filter" })
			.or(page.getByTitle("Role Filter"))
			.click();

		// Role Filter のタイトルが表示されていることを確認
		await expect(
			page.getByRole("heading", { name: "Role Filter" }),
		).toBeVisible();

		// JSONデータが表示されていることを確認 (PREタグ内)
		const preElement = page.locator("pre");
		await expect(preElement).toBeVisible();

		const content = await preElement.textContent();
		expect(content).not.toContain("FilterSet");
	});
});
