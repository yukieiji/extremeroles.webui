import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.request.post("/mock/reset", { maxRetries: 5 });
	await page.goto("/");
	// wait for main content instead of just "Loading data..." absence
	await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible({
		timeout: 15000,
	});
});

test("synchronization updates data and preserves UI state", async ({
	page,
}) => {
	// 1. Initial state check
	await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible();

	// 2. Change tab to ExR and open a category
	await page.getByRole("button", { name: "Extreme Roles" }).click();
	await expect(
		page.getByRole("heading", { name: "Extreme Roles" }),
	).toBeVisible();

	// Use test-id which seems more stable
	const category = page.getByTestId("exr-category-1");
	await expect(category).toBeVisible();
	await category.click();

	// Check if category content is visible
	// Let's use a more robust check for content inside accordion
	await expect(page.getByTestId("category-list")).toContainText(
		"乱数に関する設定",
	);

	// 3. Perform synchronization
	// Set artificial delay for sync to see the loading overlay
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 1000;
	});

	const syncButton = page.getByLabel("データを同期");
	await expect(syncButton).toBeVisible();
	await syncButton.click();

	// 4. Verify loading overlay
	await expect(page.getByText("Synchronizing...")).toBeVisible();
	await expect(page.getByText("Synchronizing...")).not.toBeVisible({
		timeout: 10000,
	});

	// 5. Verify UI state is preserved
	// Tab should still be ExR
	await expect(
		page.getByRole("heading", { name: "Extreme Roles" }),
	).toBeVisible();

	// Sidebar state check (open by default, let's close it and sync)
	await page.getByRole("button", { name: "サイドバーを閉じる" }).click();
	await expect(page.locator('[data-slot="sidebar"]')).toHaveAttribute(
		"data-state",
		"collapsed",
	);

	await syncButton.click();
	await expect(page.getByText("Synchronizing...")).not.toBeVisible();

	// Sidebar should still be closed
	await expect(page.locator('[data-slot="sidebar"]')).toHaveAttribute(
		"data-state",
		"collapsed",
	);
});
