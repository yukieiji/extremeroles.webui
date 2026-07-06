import { expect, test } from "@playwright/test";
import { prepare } from "./conftest";

test.describe("Category Search", () => {
	test.beforeEach(async ({ page }) => {
		await prepare(page, 0);
	});

	test("should navigate to and highlight category when selected from search (Au)", async ({
		page,
	}) => {
		const searchInput = page.getByPlaceholder("オプションを検索...");
		await searchInput.click();
		await searchInput.fill("会議");

		// Wait for suggestions in popover
		const popover = page.locator('[role="dialog"]'); // Popover standard role

		// Find a button that has both "会議" and "0" (Au tab number)
		const suggestion = popover
			.getByRole("button")
			.filter({ hasText: "会議" })
			.filter({ hasText: "ゲーム設定" })
			.first();
		await expect(suggestion).toBeVisible({ timeout: 10000 });
		await suggestion.click();

		// The title should change to Among Us
		await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible();

		// Check if it's highlighted.
		const highlighted = page.locator('[data-highlighted="true"]').first();
		await expect(highlighted).toBeVisible({ timeout: 5000 });
		await expect(highlighted).toContainText("会議");
	});

	test("should navigate to and highlight map option when selected from search (Au Map)", async ({
		page,
	}) => {
		const searchInput = page.getByPlaceholder("オプションを検索...");
		await searchInput.click();
		await searchInput.fill("マップ");

		// Wait for suggestions in popover
		const popover = page.locator('[role="dialog"]');

		// Map should now be an option (term "マップ")
		const suggestion = popover
			.getByRole("button")
			.filter({ hasText: "マップ" })
			.filter({ hasText: "ゲーム設定" })
			.first();
		await expect(suggestion).toBeVisible({ timeout: 10000 });
		await suggestion.click();

		// The title should change to Among Us
		await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible();

		// Check if it's highlighted.
		const highlighted = page.locator('[data-highlighted="true"]').first();
		await expect(highlighted).toBeVisible({ timeout: 5000 });
		// In MapDropDown.tsx, the title comes from optionMeta.title which might be "map" in mock data
		// but the highlight wrapper should be there.
	});

	test("should navigate to and highlight category when selected from search (ExR)", async ({
		page,
	}) => {
		const searchInput = page.getByPlaceholder("オプションを検索...");
		await searchInput.click();
		await searchInput.fill("シェリフ");

		const popover = page.locator('[role="dialog"]');

		// "シェリフ" is a category in ExR tab (implied by missing tab number or "クルーメイト役職設定")
		const suggestion = popover
			.getByRole("button")
			.filter({ hasText: "シェリフ" })
			.first();
		await expect(suggestion).toBeVisible({ timeout: 10000 });
		await suggestion.click();

		// Check if it's highlighted
		const highlighted = page.locator('[data-highlighted="true"]').first();
		await expect(highlighted).toBeVisible({ timeout: 5000 });
		await expect(highlighted).toContainText("シェリフ");
	});
});
