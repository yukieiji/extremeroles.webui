import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	// Wait for loading screen to disappear
	await expect(page.locator("body")).not.toContainText("Loading data...", {
		timeout: 60000,
	});
});

test("right sidebar can be opened and accordions can be toggled", async ({
	page,
}) => {
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

	// Initially closed (width should be 24px)
	await expect(rightPanel).toBeVisible({ timeout: 20000 });
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box ? box.width : -1;
			},
			{ timeout: 15000 },
		)
		.toBeCloseTo(24, 0);

	// Open the panel
	await toggleButton.click();

	// Wait for panel content to appear
	await expect(page.getByText("Right Panel")).toBeVisible({ timeout: 15000 });

	// Wait for animation completion (width should be > 24px)
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box ? box.width : -1;
			},
			{ timeout: 10000 },
		)
		.toBeGreaterThan(30);

	// Verify "Setting Values" accordion is visible
	const settingsAccordion = page.getByRole("button", { name: "設定値" });
	await expect(settingsAccordion).toBeVisible();

	// Verify AmongUs and ExR settings accordions
	const auSettings = page.getByRole("button", { name: "AmongUsの設定" });
	const exrSettings = page.getByRole("button", { name: "ExRの設定" });
	await expect(auSettings).toBeVisible();
	await expect(exrSettings).toBeVisible();

	// Toggle AmongUs settings
	await auSettings.click();
	await expect(auSettings).toHaveAttribute("aria-expanded", "false");

	// Close the panel
	await toggleButton.click();
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box ? box.width : -1;
			},
			{ timeout: 15000 },
		)
		.toBeCloseTo(24, 0);
});
