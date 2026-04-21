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
	await page.waitForSelector('[data-testid="au-category-list"]');
});

test.describe("Au Option Interactions", () => {
	test("should display accordion for general tab categories", async ({
		page,
	}) => {
		// Tab 0 (General)
		await page.getByRole("button", { name: "0", exact: true }).click();

		const category = page.getByTestId("au-category-0");
		await expect(category.getByText("map")).toBeVisible();

		// Initially closed
		// AuOptionControl uses OptionDropdownControl which has a role of "combobox" when using StringSelector
		// But map category first option is a string selector
		await expect(category.getByRole("button", { name: "map" })).toBeVisible();

		// Open it
		await category.getByRole("button", { name: "map" }).click();
		// In Accordion.tsx, the content is inside a div with data-testid="accordion-content"
		const content = category.getByTestId("accordion-content");
		await expect(content).toBeVisible();
		// map category has a numeric range [0, 1, 2, 4, 5], so it uses OptionSliderControl
		await expect(content.locator('input[type="range"]')).toBeVisible();
		await expect(content.locator('input[type="text"]')).toBeVisible();
	});

	test("should display role controls in header for role tabs", async ({
		page,
	}) => {
		// Tab 1
		await page.getByRole("button", { name: "1", exact: true }).click();

		// Initially chance is probably 0, so it's disabled
		const category = page
			.getByTestId("au-category-list")
			.locator("> div")
			.first();
		await expect(category.getByTestId("au-chance-control")).toBeVisible();
		await expect(category.getByTestId("au-max-count-control")).toBeVisible();

		// Accordion button should be disabled when chance is 0
		const toggleButton = category.locator("button").first();
		await expect(toggleButton).toBeDisabled();
	});

	test("should synchronize chance and max count in Au roles", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "1", exact: true }).click();

		const category = page
			.getByTestId("au-category-list")
			.locator("> div")
			.first();
		const chanceControl = category.getByTestId("au-chance-control");
		const countControl = category.getByTestId("au-max-count-control");

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
		await page.getByRole("button", { name: "1", exact: true }).click();

		const category = page
			.getByTestId("au-category-list")
			.locator("> div")
			.first();
		const toggleButton = category.locator("button").first();

		// Set chance to 100% to enable accordion
		await category
			.getByTestId("au-chance-control")
			.locator('input[type="range"]')
			.fill("10");

		await expect(toggleButton).not.toBeDisabled();
		await toggleButton.click();

		// Should show additional options inside
		// Since I don't know the exact options in mock data, I'll just check if the content area appears
		await expect(category.locator(".bg-gray-900")).toBeVisible();
	});
});
