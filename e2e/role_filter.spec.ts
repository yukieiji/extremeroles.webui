import { expect, test } from "@playwright/test";
import {
	accessMainPage,
	getLeftSidebarButton,
	getLeftSideber,
} from "./conftest";

test.describe("Role Filter Tab", () => {
	test.beforeEach(async ({ page }) => {
		await accessMainPage(page);

		// サイドバーが表示されるまで待機（アプリケーションがインタラクティブになったことの確認）
		await expect(getLeftSideber(page)).toBeVisible({
			timeout: 30000,
		});
	});

	test("should display Role Filter data when the tab is selected", async ({
		page,
	}) => {
		// Role Filter タブをクリック (ショートカット 'R')
		// サイドバーが開いている場合(button)と閉じている場合(titleのみ)の両方に対応
		await getLeftSidebarButton(page, "役職フィルター").click();

		// Role Filter のタイトルが表示されていることを確認
		await expect(
			page.getByRole("heading", { name: "役職フィルター", exact: true }),
		).toBeVisible();

		// フィルターカードが表示されていることを確認
		const cardElement = page.getByTestId("role-filter-card");
		await expect(cardElement.first()).toBeVisible();

		// AssignNumが表示されていることを確認
		await expect(page.getByText("AssignNum:").first()).toBeVisible();

		// 役職ピンが表示されていることを確認
		// RolePinはテキストを表示するdivとして実装されている
		await expect(page.getByText("パン屋").first()).toBeVisible();
	});
});
