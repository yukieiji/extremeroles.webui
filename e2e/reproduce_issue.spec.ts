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

	// Wait for panel to open (width becomes significant)
	await expect
		.poll(async () => {
			const box = await rightPanel.boundingBox();
			return box ? box.width : 0;
		})
		.toBeGreaterThan(100);

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

	// Check for horizontal overflow using poll to avoid hard timeouts
	await expect
		.poll(async () => {
			return await page.evaluate(() => {
				return (
					document.documentElement.scrollWidth >
					document.documentElement.clientWidth
				);
			});
		})
		.toBe(false);

	// Also check if the panel itself is within the viewport
	const viewport = page.viewportSize();
	if (viewport) {
		await expect
			.poll(async () => {
				const box = await rightPanel.boundingBox();
				return box ? box.x + box.width : Number.MAX_VALUE;
			})
			.toBeLessThanOrEqual(viewport.width);
	}
});
