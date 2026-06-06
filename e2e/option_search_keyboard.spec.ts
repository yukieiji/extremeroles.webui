import { expect, test } from "@playwright/test";

test.describe("Option Search Keyboard Navigation", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		// Wait for the main content to be visible (meaning the app has loaded)
		await page.waitForSelector("input[type='search']");
	});

	test("should navigate suggestions with arrow keys", async ({ page }) => {
		const searchInput = page.getByPlaceholder("オプションを検索...");
		await searchInput.focus();
		await searchInput.fill("a"); // Type something to get suggestions in mock

		// Wait for the popover to appear
		const popover = page.getByRole("dialog");
		await expect(popover).toBeVisible();

		// Get all suggestion buttons
		const suggestions = popover.getByRole("button");
		const count = await suggestions.count();
		expect(count).toBeGreaterThan(0);

		// First item should be highlighted by default (bg-secondary class)
		await expect(suggestions.nth(0)).toHaveClass(/bg-secondary/);

		// Press ArrowDown
		await searchInput.press("ArrowDown");
		await expect(suggestions.nth(1 % count)).toHaveClass(/bg-secondary/);
		await expect(suggestions.nth(0)).not.toHaveClass(/bg-secondary/);

		// Press ArrowUp (should wrap back to the first item if count is 2 or more)
		await searchInput.press("ArrowUp");
		await expect(suggestions.nth(0)).toHaveClass(/bg-secondary/);

		// Press ArrowUp again (should wrap to the last item)
		await searchInput.press("ArrowUp");
		await expect(suggestions.nth(count - 1)).toHaveClass(/bg-secondary/);
	});

	test("should select suggestion with Enter", async ({ page }) => {
		const searchInput = page.getByPlaceholder("オプションを検索...");
		await searchInput.focus();
		await searchInput.fill("map");

		const popover = page.getByRole("dialog");
		await expect(popover).toBeVisible();

		const suggestions = popover.getByRole("button");

		// Navigate to the second suggestion if exists
		if (await suggestions.count() > 1) {
			await searchInput.press("ArrowDown");
		}

		// Press Enter
		await searchInput.press("Enter");

		// Popover should close
		await expect(popover).not.toBeVisible();
	});
});
