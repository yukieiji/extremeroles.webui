import { expect, test } from "@playwright/test";

test.describe("Scroll Behavior", () => {
	test("category list should scroll independently and body should not scroll", async ({
		page,
	}) => {
		await page.goto("/");

		// Wait for category list to be visible - using a more robust way if data-testid is tricky
		// It should be inside section[data-testid='main-content-section']
		const categoryList = page.locator("[data-testid='category-list']");
		await expect(categoryList).toBeVisible({ timeout: 15000 });

		// Switch to tab 1 which typically has more items
		await page.getByRole("tab", { name: "1", exact: true }).click();

		// Set a small viewport to ensure overflow
		await page.setViewportSize({ width: 1280, height: 400 });

		// The scrollable div inside CategoryContainer
		const scrollableDiv = categoryList.locator("div.overflow-y-scroll");
		await expect(scrollableDiv).toBeVisible();

		// Check that the category list is scrollable
		const isScrollable = await scrollableDiv.evaluate((el) => {
			return el.scrollHeight > el.clientHeight;
		});
		expect(isScrollable).toBe(true);

		// Check that the body is NOT scrollable
		const bodyIsScrollable = await page.evaluate(() => {
			return (
				document.documentElement.scrollHeight >
				document.documentElement.clientHeight
			);
		});
		expect(bodyIsScrollable).toBe(false);

		// Verify we can scroll the category list
		const initialScrollTop = await scrollableDiv.evaluate((el) => el.scrollTop);
		await scrollableDiv.evaluate((el) => (el.scrollTop = 50));
		const newScrollTop = await scrollableDiv.evaluate((el) => el.scrollTop);
		expect(newScrollTop).toBeGreaterThan(initialScrollTop);
	});
});
