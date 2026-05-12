import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	// Wait for loading screen to disappear
	await expect(page.locator("body")).not.toContainText("Loading data...", {
		timeout: 60000,
	});
	// Ensure main content is loaded
	await expect(page.getByRole("heading", { name: "Au Options" })).toBeVisible({
		timeout: 30000,
	});
});

test("right sidebar can be opened and accordions can be toggled", async ({
	page,
}) => {
	// Wait for panel to be attached to the DOM
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	await rightPanel.waitFor({ state: "attached", timeout: 15000 });

	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

	// Initially closed (width should be 0px)
	// We use attach state or presence because 0 width might be considered hidden by toBeVisible
	await expect(rightPanel).toBeAttached();
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box ? box.width : -1;
			},
			{ timeout: 15000 },
		)
		.toBeCloseTo(0, 0);

	// Open the panel
	await toggleButton.click();

	// Wait for panel content to appear
	await expect(page.getByText("Right Panel")).toBeVisible({ timeout: 15000 });

	// Wait for animation completion (width should be > 0px)
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
		.toBeCloseTo(0, 0);
});
