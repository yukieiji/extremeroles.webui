import { expect, test } from "@playwright/test";
import { accessMainPage } from "./conftest";

test.describe("Search Suggestion Hover", () => {
	test.beforeEach(async ({ page }) => {
		await accessMainPage(page);
	});

	test("keyboard selection should have background color", async ({ page }) => {
		const searchInput = page.getByPlaceholder("オプションを検索...");
		await searchInput.fill("マップ");

		const popover = page.getByRole("dialog");
		await expect(popover).toBeVisible();

		const firstItem = popover.getByRole("button").first();
		await expect(firstItem).toBeVisible();

		// Check initial selection (first item is selected by default usually)
		await expect(async () => {
			const bgColor = await firstItem.evaluate(
				(el) => window.getComputedStyle(el).backgroundColor,
			);
			expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
			expect(bgColor).not.toBe("transparent");
		}).toPass();
	});

	test("mouse hover should change background color", async ({ page }) => {
		const searchInput = page.getByPlaceholder("オプションを検索...");
		await searchInput.fill("マップ");

		const popover = page.getByRole("dialog");
		await expect(popover).toBeVisible();

		// Find the second suggestion item to avoid overlap with default keyboard selection
		const secondItem = popover.getByRole("button").nth(1);
		await expect(secondItem).toBeVisible();

		const initialBgColor = await secondItem.evaluate(
			(el) => window.getComputedStyle(el).backgroundColor,
		);

		await secondItem.hover();

		await expect(async () => {
			const hoverBgColor = await secondItem.evaluate(
				(el) => window.getComputedStyle(el).backgroundColor,
			);
			expect(hoverBgColor).not.toBe(initialBgColor);
			expect(hoverBgColor).not.toBe("rgba(0, 0, 0, 0)");
		}).toPass();
	});
});
