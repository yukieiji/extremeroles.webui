import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.request.post("/mock/reset", { maxRetries: 5 });
	await page.goto("/");
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 45000,
	});
});

test("Preset dropdown should not overlap trigger when wrapped", async ({
	page,
}) => {
	// Set a narrow viewport to force wrapping
	await page.setViewportSize({ width: 800, height: 600 });

	const sidebar = page.locator('[data-slot="sidebar"]');
	const exrButton = sidebar.getByRole("button", { name: "Extreme Roles" });
	await exrButton.click();

	// Wait for Preset Selector
	const presetInput = page.getByPlaceholder("プリセット名を入力...");
	await expect(presetInput).toBeVisible({ timeout: 15000 });

	// Open dropdown
	const selectTrigger = page.locator('button[data-slot="select-trigger"]');
	await selectTrigger.click();

	// Check if dropdown is visible
	const dropdown = page.locator('[data-slot="select-content"]');
	await expect(dropdown).toBeVisible();

	// Get bounding boxes
	const triggerBox = await selectTrigger.boundingBox();
	const dropdownBox = await dropdown.boundingBox();

	if (triggerBox && dropdownBox) {
		// If it overlaps, dropdownBox.y will be less than triggerBox.y + triggerBox.height
		// Standard behavior should be dropdownBox.y >= triggerBox.y + triggerBox.height
		expect(dropdownBox.y).toBeGreaterThanOrEqual(
			triggerBox.y + triggerBox.height - 1,
		); // allow 1px for subpixel/border
	}
});
