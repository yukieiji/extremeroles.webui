import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 0;
	});
	await page.goto("/");
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});

	await page.getByRole("button", { name: "ExR Options" }).click();
});

test("Options should not be duplicated in role categories", async ({
	page,
}) => {
	await page
		.getByRole("button", { name: "ゴーストニュートラル役職設定", exact: true })
		.click();

	const forasCategory = page.getByTestId("exr-category-521");
	await expect(forasCategory).toBeVisible();

	// Enable by setting rate to 10%
	const rateSlider = forasCategory
		.getByTestId("spawn-rate-control")
		.locator('input[type="range"]');
	await rateSlider.fill("1");

	// Open accordion
	await forasCategory.getByRole("button", { name: "フォラス" }).click();

	const content = forasCategory.locator(
		'[data-testid="exr-category-list-container"]',
	);
	await expect(content).toBeVisible();

	// Check for "アサインウェイト" duplication
	const assignWeightLocators = content.getByText("アサインウェイト");
	const count = await assignWeightLocators.count();

	// If duplicated, count will be > 1
	expect(count).toBe(1);
});
