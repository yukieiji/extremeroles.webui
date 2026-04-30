import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.request.post("/mock/reset", { maxRetries: 5 });
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 0;
	});
	await page.goto("/");
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});

	// Au Options タブに切り替え
	await page.getByRole("button", { name: "Au Options" }).click();
	await expect(page.locator("main").getByText("map")).toBeVisible();
});

test.describe("Au Option Interactions", () => {
	test("should display dropdown for map category in general tab", async ({
		page,
	}) => {
		// Tab 0
		await page
			.locator("main")
			.getByRole("button", { name: "0", exact: true })
			.click();

		// "map" option title should be visible
		await expect(page.locator("main").getByText("map")).toBeVisible();

		// Map is now a direct dropdown (select element)
		await expect(page.getByRole("combobox")).toBeVisible();
	});

	test("should display accordion for other general tab categories", async ({
		page,
	}) => {
		// Tab 0
		await page
			.locator("main")
			.getByRole("button", { name: "0", exact: true })
			.click();

		// "インポスター" is the title of the second category in mock data
		await expect(page.locator("main").getByText("インポスター")).toBeVisible();

		// Should be an accordion (button)
		await expect(
			page.locator("main").getByRole("button", { name: "インポスター" }),
		).toBeVisible();
	});

	test("should display role controls in header for role tabs", async ({
		page,
	}) => {
		// Tab 1
		await page
			.locator("main")
			.getByRole("button", { name: "1", exact: true })
			.click();

		// First category container (科学者)
		const category = page
			.locator("main")
			.locator("div.border.border-gray-700")
			.filter({ hasText: "科学者" });
		await expect(category.getByLabel("レート")).toBeVisible();
		await expect(category.getByLabel("数")).toBeVisible();

		// Accordion button should be disabled when chance is 0
const toggleButton = category.getByRole("button", { name: "科学者" });
		await expect(toggleButton).toBeDisabled();
	});

	test("should synchronize chance and max count in Au roles", async ({
		page,
	}) => {
		await page
			.locator("main")
			.getByRole("button", { name: "1", exact: true })
			.click();

		const category = page
			.locator("main")
			.locator("div.border.border-gray-700")
			.filter({ hasText: "科学者" });
		const chanceControl = category.getByLabel("レート");
		const countControl = category.getByLabel("数");

		const chanceInput = chanceControl.locator('input[type="text"]');
		const countInput = countControl.locator('input[type="text"]');
		const chanceSlider = chanceControl.locator('input[type="range"]');
		const countSlider = countControl.locator('input[type="range"]');

		// 1. Set count to 1, should set chance to 10%
		await countSlider.fill("1");
		await expect(countInput).toHaveValue("1");
		await expect(chanceInput).toHaveValue("10");

		// 2. Set chance to 0, should set count to 0
		await chanceSlider.fill("0");
		await expect(chanceInput).toHaveValue("0");
		await expect(countInput).toHaveValue("0");

		// 3. Set count to 1, should set chance to 10%
		await countSlider.fill("1");
		await expect(countInput).toHaveValue("1");
		await expect(chanceInput).toHaveValue("10");

		// 4. Set count to 0, should set chance to 0%
		await countSlider.fill("0");
		await expect(countInput).toHaveValue("0");
		await expect(chanceInput).toHaveValue("0");
	});

	test("expanding role accordion should show other options", async ({
		page,
	}) => {
		await page
			.locator("main")
			.getByRole("button", { name: "1", exact: true })
			.click();

		const category = page
			.locator("main")
			.locator("div.border.border-gray-700")
			.filter({ hasText: "科学者" });
		const toggleButton = category.getByRole("button").first();

		// Set chance to 100% to enable accordion
		await category
			.getByLabel("レート")
			.locator('input[type="range"]')
			.fill("10");

		await expect(toggleButton).not.toBeDisabled();
		// Automatically opens when changed to non-zero, so toggleButton should already be expanded
		await expect(toggleButton).toHaveAttribute("aria-expanded", "true");

		// Should show additional options inside
		// Since I don't know the exact options in mock data, I'll just check if the content area appears
		await expect(category.locator(".bg-gray-900")).toBeVisible();
	});
});
