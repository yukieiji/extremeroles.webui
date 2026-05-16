import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("body")).not.toContainText("Loading data...", {
		timeout: 60000,
	});
});

test("right sidebar expansion should not cause horizontal overflow", async ({
	page,
}) => {
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	await rightPanel.waitFor({ state: "attached", timeout: 15000 });
	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

	// Open the panel
	await toggleButton.click();

	const viewport = page.viewportSize();
	if (!viewport) {
		throw new Error("Viewport not found");
	}

	const handle = page.getByTestId("resize-handle");
	await expect(handle).toBeVisible();

	const handleBox = await handle.boundingBox();
	if (!handleBox) {
		throw new Error("Handle box not found");
	}

	// Attempt to drag to the far left (beyond maximum)
	await handle.dispatchEvent("mousedown", { button: 0 });
	await page.evaluate(() => {
		window.dispatchEvent(
			new MouseEvent("mousemove", {
				bubbles: true,
				clientX: 0, // Far left
				clientY: 300,
			}),
		);
	});
	await page.evaluate(() => {
		window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
	});

	// Wait for any transitions
	await page.waitForTimeout(500);

	// Check for horizontal overflow
	const overflow = await page.evaluate(() => {
		return {
			scrollWidth: document.documentElement.scrollWidth,
			clientWidth: document.documentElement.clientWidth,
			hasOverflow:
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth,
		};
	});

	console.log(
		`ScrollWidth: ${overflow.scrollWidth}, ClientWidth: ${overflow.clientWidth}`,
	);

	// This is expected to fail if the bug exists
	expect(overflow.hasOverflow, "Horizontal overflow detected!").toBe(false);

	// Also check if the panel itself is within the viewport
	const panelBox = await rightPanel.boundingBox();
	if (panelBox) {
		expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(viewport.width);
	}
});
