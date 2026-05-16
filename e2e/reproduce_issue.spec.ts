import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	// Ensure the app is loaded and data is fetched
	await expect(page.getByRole("heading", { name: "Au Options" })).toBeVisible({
		timeout: 45000,
	});
});

test("right sidebar expansion should not cause horizontal overflow", async ({
	page,
}) => {
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	await rightPanel.waitFor({ state: "attached", timeout: 20000 });
	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

	// Open the panel
	await toggleButton.click();
	await page.waitForTimeout(1000); // Wait for open transition

	const handle = page.getByTestId("resize-handle");
	await expect(handle).toBeVisible();

	const handleBox = await handle.boundingBox();
	if (!handleBox) {
		throw new Error("Handle box not found");
	}

	// Attempt to drag to the far left (beyond maximum)
	// Dispatch events for maximum reliability on thin handles
	await handle.dispatchEvent("mousedown", { button: 0 });

	// Move mouse to the far left
	await page.evaluate(() => {
		window.dispatchEvent(
			new MouseEvent("mousemove", {
				bubbles: true,
				clientX: 0,
				clientY: 300,
			}),
		);
	});
	// Release
	await page.evaluate(() => {
		window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
	});

	// Wait for any transitions
	await page.waitForTimeout(1000);

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

	// This is the core of the fix verification
	expect(overflow.hasOverflow, "Horizontal overflow detected!").toBe(false);

	// Also check if the panel itself is within the viewport
	const panelBox = await rightPanel.boundingBox();
	if (panelBox) {
		const viewport = page.viewportSize();
		if (viewport) {
			expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(viewport.width);
		}
	}
});
