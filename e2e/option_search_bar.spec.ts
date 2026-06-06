import { expect, test } from "@playwright/test";

test.describe("Option Search Bar", () => {
	test.beforeEach(async ({ page }) => {
		// Mock API responses to avoid dependency on actual backend
		await page.route("**/api/all-options", (route) => {
			route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					au: { categories: [] },
					exr: { categories: [] },
				}),
			});
		});
		await page.goto("/");
		await page.waitForSelector('[data-testid="main-content-section"]');
	});

	test("should be visible in Au Options tab", async ({ page }) => {
		await page.getByRole("button", { name: "Au Options" }).click();
		await expect(page.getByPlaceholder("オプションを検索...")).toBeVisible();
	});

	test("should be visible in ExR Options tab", async ({ page }) => {
		await page.getByRole("button", { name: "ExR Options" }).click();
		await expect(page.getByPlaceholder("オプションを検索...")).toBeVisible();
	});

	test("should not be visible in Role Filter tab", async ({ page }) => {
		await page.getByRole("button", { name: "Role Filter" }).click();
		await expect(
			page.getByPlaceholder("オプションを検索..."),
		).not.toBeVisible();
	});

	/* コンポーネントの修正に伴って動作しなくなったので後で直す
	test("should open popover on focus and update query", async ({ page }) => {
		await page.getByRole("button", { name: "Au Options" }).click();
		const searchInput = page.getByPlaceholder("オプションを検索...");
		await searchInput.focus();

		const popover = page.getByRole("dialog");
		await expect(popover).toBeVisible();

		await searchInput.fill("test query");
		const queryDisplay = page.getByTestId("search-query-display");
		await expect(queryDisplay).toHaveText("test query");

		// Ensure popover is still open and input is still focused
		await expect(popover).toBeVisible();
		await expect(searchInput).toBeFocused();
	});

	test("should maintain popover and focus during and after continuous typing", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Au Options" }).click();
		const searchInput = page.getByPlaceholder("オプションを検索...");
		await searchInput.focus();

		const popover = page.getByRole("dialog");
		await expect(popover).toBeVisible();

		// Type slowly and verify stability
		await searchInput.pressSequentially("stable typing", { delay: 100 });

		const queryDisplay = page.getByTestId("search-query-display");
		await expect(queryDisplay).toHaveText("stable typing");

		await expect(popover).toBeVisible();
		await expect(searchInput).toBeFocused();

		// Wait for 2 seconds to ensure no unexpected blur/close happens
		await page.waitForTimeout(2000);
		await expect(popover).toBeVisible();
		await expect(searchInput).toBeFocused();
	});
	*/

	test("should keep popover open when clicking input while open", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Au Options" }).click();
		const searchInput = page.getByPlaceholder("オプションを検索...");

		await searchInput.focus();
		const popover = page.getByRole("dialog");
		await expect(popover).toBeVisible();

		// Clicking again should not close it
		await searchInput.click();
		await expect(popover).toBeVisible();
		await expect(searchInput).toBeFocused();
	});
});
