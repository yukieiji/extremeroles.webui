import { expect, test } from "@playwright/test";

test.describe("Role Filter Management", () => {
	test.setTimeout(60000);

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
		const initialFilters = await page.getByTestId("role-filter-card").count();

		// Add a new filter (triggers role selection)
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		await expect(page.getByText("フィルター追加: 役職の選択")).toBeVisible();
		await page
			.getByRole("checkbox", { name: "Bakary", exact: true })
			.first()
			.click();
		await page.getByRole("button", { name: /確定/ }).click();

		// Verify new filter is added
		await expect(page.getByTestId("role-filter-card")).toHaveCount(
			initialFilters + 1,
			{
				timeout: 15000,
			},
		);
		await expect(page.getByText("AssignNum: 1").last()).toBeVisible();

		// Delete the filter
		const lastFilter = page.getByTestId("role-filter-card").last();
		await lastFilter.getByLabel("Delete filter").click();

		// Confirmation dialog
		await expect(page.getByText("フィルターの削除")).toBeVisible();
		await page.getByRole("button", { name: "OK" }).click();

		// Verify filter is removed
		await expect(page.getByTestId("role-filter-card")).toHaveCount(
			initialFilters,
			{
				timeout: 15000,
			},
		);
	});

	test("should add a role to filter using search", async ({ page }) => {
		const initialFilters = await page.getByTestId("role-filter-card").count();

		// Add a new filter first (triggers role selection)
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		await page
			.getByRole("checkbox", { name: "Bakary", exact: true })
			.first()
			.click();
		await page.getByRole("button", { name: /確定/ }).click();

		// ダイアログが閉じるのを待つ
		await expect(page.getByText("フィルター追加: 役職の選択")).not.toBeVisible({
			timeout: 10000,
		});

		// Verify new filter is added
		await expect(page.getByTestId("role-filter-card")).toHaveCount(
			initialFilters + 1,
			{
				timeout: 15000,
			},
		);

		const lastFilter = page.getByTestId("role-filter-card").last();

		// Open role select dialog to add another role
		await lastFilter.getByRole("button", { name: "役職を追加" }).click();
		await expect(page.getByText("役職の追加")).toBeVisible();

		// Search for a role (using mock data role names: Opener)
		const searchInput = page.getByPlaceholder("役職を検索...");
		await searchInput.click();
		await searchInput.fill("Opener");

		// Select a role from the grid
		// 検索結果が表示されるのを待つ
		const roleCheckbox = page.getByRole("checkbox", {
			name: "Opener",
			exact: true,
		});
		await expect(roleCheckbox).toBeVisible({ timeout: 10000 });
		await roleCheckbox.click();
		await page.getByRole("button", { name: /確定/ }).click();

		// ダイアログが閉じるのを待つ
		await expect(page.getByText("役職の追加")).not.toBeVisible({
			timeout: 10000,
		});

		// Verify role is added to the filter
		// 要素の出現を待つ
		await expect(lastFilter.getByText("Opener", { exact: true })).toBeVisible({
			timeout: 20000,
		});
	});

	test("should remove a role from filter", async ({ page }) => {
		// Add a new filter (triggers role selection)
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		await page
			.getByRole("checkbox", { name: "Bakary", exact: true })
			.first()
			.click();
		await page.getByRole("button", { name: /確定/ }).click();

		const lastFilter = page.getByTestId("role-filter-card").last();

		await expect(lastFilter.getByText("Bakary", { exact: true })).toBeVisible({
			timeout: 15000,
		});

		// Remove the role
		await lastFilter.getByLabel("Remove Bakary").click();

		// Confirmation dialog
		await expect(page.getByText("役職の削除")).toBeVisible();
		await page.getByRole("button", { name: "OK" }).click();

		// Verify role is removed
		await expect(lastFilter.getByText("No roles selected")).toBeVisible({
			timeout: 15000,
		});
	});
});
