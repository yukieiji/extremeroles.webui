import { expect, test } from "@playwright/test";
import { accessMainPage, getLeftSidebarButton } from "./conftest";

test.describe("Role Filter Shift Selection", () => {
	test.beforeEach(async ({ page }) => {
		await accessMainPage(page);

		// サイドバーが操作可能な状態になるのを待つ（webkit対策）
		await expect(page.locator('[data-slot="sidebar"]')).toBeVisible({
			timeout: 30000,
		});
	});

	test("should select multiple roles using shift-click", async ({ page }) => {
		// Switch to Role Filter tab
		await getLeftSidebarButton(page, "役職フィルター").click();

		// Open the role selection dialog
		await page.getByRole("button", { name: "フィルターを追加" }).click();

		// Wait for dialog
		await expect(page.getByText("フィルター追加: 役職の選択")).toBeVisible();

		// Get labels
		const labels = page.locator("[data-slot='field-label']");

		// Ensure at least 3 labels are present
		await expect(labels.nth(4)).toBeVisible();

		// Click the first label (Leader)
		await labels.nth(0).click();

		// Shift-click the fifth label (Militant)
		// 0: Leader, 1: Leader, 2: Dove, 3: Dove, 4: Militant
		await labels.nth(4).click({ modifiers: ["Shift"] });

		// Verify that 3 items are selected (indicated by the Confirm button text)
		// The Confirm button text is "追加 (3)" where 3 is the number of selected items
		await expect(
			page.getByRole("button", { name: /追加 \(3\)/ }),
		).toBeVisible();

		// Checkbox status check (checked items should have data-checked attribute)
		const checkedCheckboxes = page.locator(
			"[data-slot='checkbox'][data-checked]",
		);
		await expect(checkedCheckboxes).toHaveCount(3);
	});
});
