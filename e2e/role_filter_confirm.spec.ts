import { expect, test } from "@playwright/test";

test.describe("Role Filter Confirm Button Response", () => {
	test.setTimeout(60000);

	test.beforeEach(async ({ page }) => {
		await page.goto("/");

		// Wait for loading to finish
		await expect(page.getByText("Loading data...")).not.toBeVisible({
			timeout: 30000,
		});

		// Open Role Filter tab
		await page.getByRole("button", { name: "Role Filter" }).click();

		// Verify we are in Role Filter view
		await expect(
			page.getByRole("heading", { name: "Role Filter", exact: true }),
		).toBeVisible();
	});

	test("Confirm button should be enabled immediately and after 1s when adding new filter (click label)", async ({
		page,
	}) => {
		// Add a new filter (triggers role selection)
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		// Use a more flexible selector for the title and increase timeout
		await expect(
			page.getByText(/フィルター追加|役職の選択/).first(),
		).toBeVisible({ timeout: 15000 });

		// Target the label which should be clickable
		const bakaryLabel = page
			.locator("label")
			.filter({ hasText: "パン屋" })
			.first();
		const confirmButton = page.getByRole("button", { name: /確定/ });

		// Initially disabled
		await expect(confirmButton).toBeDisabled();

		// Select a role by clicking the label
		await bakaryLabel.click();

		// Check immediately
		await expect(confirmButton).toBeEnabled();

		// Wait 1 second
		await page.waitForTimeout(1000);

		// Check after 1 second
		await expect(confirmButton).toBeEnabled();

		// Should be able to click
		await confirmButton.click();

		// Verify dialog closed
		await expect(page.getByText(/フィルター追加|役職の選択/)).not.toBeVisible({
			timeout: 10000,
		});
	});

	test("Confirm button should be enabled immediately and after 1s when adding role to existing filter", async ({
		page,
	}) => {
		// First add a filter so we can add roles to it
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		await expect(page.getByRole("button", { name: /確定/ })).toBeVisible({
			timeout: 15000,
		});
		await page.locator("label").filter({ hasText: "パン屋" }).first().click();
		await page.getByRole("button", { name: /確定/ }).click();
		await expect(
			page.getByText("フィルター追加: 役職の選択"),
		).not.toBeVisible();

		const lastFilter = page.getByTestId("role-filter-card").last();
		await lastFilter.getByRole("button", { name: "役職の追加" }).click();
		await expect(page.getByText("役職の追加")).toBeVisible();

		const openerCheckbox = page.getByRole("checkbox", {
			name: "オープナー",
			exact: true,
		});
		const confirmButton = page.getByRole("button", { name: /確定/ });

		// Initially disabled
		await expect(confirmButton).toBeDisabled();

		// Select a role
		await openerCheckbox.click();

		// Check immediately
		await expect(confirmButton).toBeEnabled();

		// Wait 1 second
		await page.waitForTimeout(1000);

		// Check after 1 second
		await expect(confirmButton).toBeEnabled();

		// Should be able to click
		await confirmButton.click();

		// Verify dialog closed
		await expect(page.getByText("役職の追加")).not.toBeVisible();
	});
});
