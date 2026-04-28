import { expect, test } from "@playwright/test";

test.describe("Au Role Viewer in Right Panel", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		// ローディング画面が消えるのを待つ
		await expect(page.getByText("Loading data...")).not.toBeVisible({
			timeout: 30000,
		});
	});

	test("displays active roles from Tab 1 and 2 and navigates on double-click", async ({
		page,
	}) => {
		// 1. 右パネルを開く
		const rightPanelToggle = page.getByRole("button", { name: "パネルを開く" });
		await rightPanelToggle.click();
		await expect(page.getByLabel("右フローティングパネル")).toBeVisible();

		// 2. 「インポスター役職」セクションが表示されていることを確認
		// モックデータでは「シェイプシフター」が有効なはず
		const imposterRolesSection = page.getByText("インポスター役職");
		await expect(imposterRolesSection).toBeVisible();

		// 3. 役職の内容を確認
		const roleRow = page.getByTestId(/^right-panel-role-/).first();
		await expect(roleRow).toContainText("シェイプシフター");
		// 50% / 15 のような表示形式
		await expect(roleRow).toContainText("50%");
		await expect(roleRow).toContainText("15");

		// 4. ダブルクリックしてメインビューのタブが切り替わるか確認
		// 現在は Au Tab 0 が選択されているはず
		await expect(page.getByRole("heading", { name: "Au Options" })).toBeVisible();

		// メインビューのタブが 0 であることを確認（タブボタンのスタイルなどで判定できるかもしれないが、
		// ここではダブルクリック後の遷移を重視）

		await roleRow.dblclick();

		// 5. 自動的に該当タブ（インポスター役職は Tab 2）に切り替わり、ハイライトされるか確認
		// 実際の実装では setSelectedAuTabId(tabId) が呼ばれる
		// インポスター役職設定が表示されていることを確認
		await expect(page.getByText("シェイプシフター")).toBeVisible();

		// ハイライトの確認
		const highlightedRow = page.locator('[id^="au-option-"]').first();
		await expect(highlightedRow).toHaveClass(/ring-2/);
	});

	test("toggles role sections in the right panel", async ({ page }) => {
		await page.getByRole("button", { name: "パネルを開く" }).click();

		const imposterRolesSection = page.getByText("インポスター役職");
		const accordionButton = imposterRolesSection.closest("button");

		// 最初は開いている（初期値 true）
		await expect(accordionButton).toHaveAttribute("aria-expanded", "true");

		// クリックして閉じる
		await imposterRolesSection.click();
		await expect(accordionButton).toHaveAttribute("aria-expanded", "false");

		// 役職リストが見えなくなったことを確認
		await expect(page.getByText("シェイプシフター")).not.toBeVisible();
	});
});
