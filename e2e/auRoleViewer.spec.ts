import { expect, test } from "@playwright/test";
import { prepare } from "./conftest";

test.describe("Au Role Viewer in Right Panel", () => {
	test.beforeEach(async ({ page }) => {
		await prepare(page, 0);
	});

	test("displays active roles and navigates on double-click", async ({
		page,
	}) => {
		// 1. 右パネルを開く
		const rightPanelToggle = page.getByTestId("right-panel-toggle");
		await rightPanelToggle.click();
		const rightPanel = page.getByTestId("right-side-panel");
		await expect(rightPanel).toBeVisible({ timeout: 15000 });

		// 2. 役職の内容を確認 (バニラ役職はSummaryに移動した)
		// モックデータでは「シェイプシフター」が有効なはず
		const roleRow = rightPanel
			.getByTestId("right-panel-summary")
			.getByRole("button", {
				name: /シェイプシフター/,
			});
		await expect(roleRow).toBeVisible({ timeout: 10000 });
		await expect(roleRow).toContainText("シェイプシフター");
		// Summaryでは "Count - Chance%" 形式
		await expect(roleRow).toContainText("50%");
		await expect(roleRow).toContainText("15");

		// 3. ダブルクリックしてメインビューのタブが切り替わるか確認
		await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible();

		await roleRow.dblclick();

		// 4. 自動的に該当タブに切り替わり、ハイライトされるか確認
		const mainEditor = page.locator("main");
		await expect(
			mainEditor.getByRole("button", { name: /シェイプシフター/ }),
		).toBeVisible();

		const highlightedRow = mainEditor
			.locator('[data-highlighted="true"]')
			.filter({ hasText: "シェイプシフター" })
			.first();
		await expect(highlightedRow).toBeVisible({ timeout: 10000 });
	});

	test("does not display inactive roles in the right panel", async ({
		page,
	}) => {
		// Among Us の 役職タブ（タブ 1）に移動
		await page
			.getByRole("tab", { name: "クルー", exact: true })
			.first()
			.click();

		// 科学者を無効にしてチェック
		const category = page
			.getByTestId("role-category")
			.filter({ hasText: "科学者" });
		const chanceSlider = category
			.getByTestId("spawn-rate-control")
			.locator('input[type="range"]');
		const countSlider = category
			.getByTestId("spawn-count-control")
			.locator('input[type="range"]');

		await page.getByTestId("right-panel-toggle").click();
		const rightPanel = page.getByTestId("right-side-panel");

		await chanceSlider.fill("0");
		await countSlider.fill("0");

		// サマリーからも消えるはず
		await expect(rightPanel.getByText("科学者")).not.toBeVisible();
	});
});
