import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { accessMainPage, RIGHT_SIDEBAR_TEST_ID, reload } from "./conftest";

async function getRightSidebarWidth(p: Page) {
	const box = await p.locator(RIGHT_SIDEBAR_TEST_ID).boundingBox();
	return box?.width ?? 0;
}

test.beforeEach(async ({ page }) => {
	await accessMainPage(page);
	// Ensure main content is loaded
	await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible({
		timeout: 30000,
	});
});

test("right sidebar state is persisted in localStorage", async ({
	page,
	browser,
}) => {
	// Wait for panel to be attached to the DOM
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	await rightPanel.waitFor({ state: "attached", timeout: 15000 });

	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

	// 1. Initial state (should be closed)
	await expect
		.poll(async () => await getRightSidebarWidth(page), { timeout: 15000 })
		.toBeCloseTo(24, 1);

	// 2. Toggle to open
	await toggleButton.click();
	await page.waitForTimeout(500);

	// Wait for transition
	await expect
		.poll(async () => await getRightSidebarWidth(page), { timeout: 10000 })
		.toBeGreaterThan(100);

	// 3. Reload and check if it's still open
	const { newPage, newContext } = await reload(page, browser);
	const reloadedRightPanel = newPage.locator(
		'[data-testid="right-side-panel"]',
	);
	await reloadedRightPanel.waitFor({ state: "attached", timeout: 15000 });

	const reloadedWidth = await getRightSidebarWidth(newPage);
	expect(reloadedWidth).toBeGreaterThan(100);

	// 4. Toggle back to closed
	const newToggleButton = newPage.locator("[data-testid='right-panel-toggle']");
	await newToggleButton.click();
	await page.waitForTimeout(500);

	await expect
		.poll(async () => await getRightSidebarWidth(newPage), { timeout: 10000 })
		.toBeCloseTo(24, 1);

	// 5. Reload and check if it's still closed
	const { newPage: newPage2, newContext: newContext2 } = await reload(
		newPage,
		browser,
	);
	const reloadedRightPanel2 = newPage2.locator(
		'[data-testid="right-side-panel"]',
	);
	await reloadedRightPanel2.waitFor({ state: "attached", timeout: 15000 });

	const finalWidth = await getRightSidebarWidth(newPage2);
	expect(finalWidth).toBeCloseTo(24, 1);

	await newContext.close();
	await newContext2.close();
});
