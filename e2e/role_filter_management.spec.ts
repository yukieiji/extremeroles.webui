import { expect, test } from "@playwright/test";

test.describe("Role Filter Management", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");

		// Wait for loading to finish
		await expect(page.getByText("Loading data...")).not.toBeVisible({
			timeout: 30000,
		});

		// Open Role Filter tab
		await page
			.getByRole("button", { name: "Role Filter" })
			.or(page.getByTitle("Role Filter"))
			.click();

		// Verify we are in Role Filter view
		await expect(
			page.getByRole("heading", { name: "Role Filter", exact: true }),
		).toBeVisible();
	});

	test("should add and delete a role filter", async ({ page }) => {
		// Initial count of filters
		const initialFilters = await page.locator("[data-guid]").count();

		// Add a new filter (triggers role selection)
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		await expect(page.getByText("役職の選択")).toBeVisible();
		await page.getByRole("button", { name: "Bakary" }).first().click();

		// Verify new filter is added
		await expect(page.locator("[data-guid]")).toHaveCount(initialFilters + 1);
		await expect(page.getByText("AssignNum: 1").last()).toBeVisible();

		// Delete the filter
		const lastFilter = page.locator("[data-guid]").last();
		await lastFilter.getByLabel("Delete filter").click();

		// Confirmation dialog
		await expect(page.getByText("フィルターの削除")).toBeVisible();
		await page.getByRole("button", { name: "OK" }).click();

		// Verify filter is removed
		await expect(page.locator("[data-guid]")).toHaveCount(initialFilters);
	});

	test("should add a role to filter using search", async ({ page }) => {
		// Add a new filter first (triggers role selection)
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		await page.getByRole("button", { name: "Bakary" }).first().click();

		const lastFilter = page
			.locator("[data-guid]")
			.filter({ hasText: "AssignNum: 1" })
			.last();

		// Open role select dialog to add another role
		await lastFilter.getByRole("button", { name: "役職を追加" }).click();
		await expect(page.getByText("役職の選択")).toBeVisible();

		// Search for a role (using mock data role names: Opener)
		const searchInput = page.getByPlaceholder("役職を検索...");
		await searchInput.fill("Opener");

		// Select a role from the grid
		const roleButton = page.getByRole("button", { name: "Opener" }).first();
		await roleButton.click();

		// Verify role is added to the filter
		// 要素の出現を待つ
		await expect(lastFilter.locator('[data-role-name="Opener"]')).toBeVisible({
			timeout: 10000,
		});
	});

	test("should remove a role from filter", async ({ page }) => {
		// Add a new filter (triggers role selection)
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		await page.getByRole("button", { name: "Bakary" }).first().click();

		const lastFilter = page
			.locator("[data-guid]")
			.filter({ hasText: "AssignNum: 1" })
			.last();

		await expect(lastFilter.locator('[data-role-name="Bakary"]')).toBeVisible();

		// Remove the role
		const rolePin = lastFilter.locator('[data-role-name="Bakary"]');
		await rolePin.getByLabel("Remove Bakary").click();

		// Confirmation dialog
		await expect(page.getByText("役職の削除")).toBeVisible();
		await page.getByRole("button", { name: "OK" }).click();

		// Verify role is removed
		await expect(lastFilter.getByText("No roles selected")).toBeVisible();
	});
});
