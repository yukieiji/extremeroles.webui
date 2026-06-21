import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// Ensure localStorage is clean for tests before page load
	await page.addInitScript(() => {
		window.localStorage.clear();
	});
	await page.goto("/");

	await expect(page.locator("body")).not.toContainText("Loading data...", {
		timeout: 60000,
	});
	// Ensure main content is loaded
	await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible({
		timeout: 45000,
	});
});

test("isResizing state is correctly managed", async ({ page }) => {
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	await rightPanel.waitFor({ state: "attached", timeout: 20000 });
	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

	await toggleButton.click();
	// Wait for panel to open fully and transition to finish
	// Initial width 320 + Toggle width 24 = 344
	await expect(rightPanel).toHaveCSS("width", "344px");

	const handle = page.getByTestId("resize-handle");
	await expect(handle).toBeVisible();
	const handleBox = await handle.boundingBox();
	if (!handleBox) {
		throw new Error("Handle box not found");
	}

	// Use page.mouse for more realistic interaction
	const x = handleBox.x + handleBox.width / 2;
	const y = handleBox.y + handleBox.height / 2;
	await page.mouse.move(x, y);
	await page.mouse.down();

	// Move a bit to ensure resize state is active
	await page.mouse.move(x - 50, y);

	// transition should be removed during resizing
	await expect(rightPanel).not.toHaveCSS("transition-property", "width");

	await expect(page.locator("body")).toHaveCSS("cursor", "ew-resize", {
		timeout: 5000,
	});
	await page.mouse.up();
});

test("right sidebar can be resized", async ({ page }) => {
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	await rightPanel.waitFor({ state: "attached", timeout: 20000 });
	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

	await toggleButton.click();
	// Wait for panel to open fully and transition to finish
	await expect(rightPanel).toHaveCSS("width", "344px");

	const viewport = page.viewportSize();
	if (!viewport) {
		throw new Error("Viewport not found");
	}

	// Wait for panel to be fully open
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				if (!box) {
					return -1;
				}
				return Math.round(box.x + box.width);
			},
			{ timeout: 15000 },
		)
		.toBe(viewport.width);

	const initialBox = await rightPanel.boundingBox();
	if (!initialBox) {
		throw new Error("Initial box not found");
	}

	const handle = page.getByTestId("resize-handle");
	await expect(handle).toBeVisible();
	const handleBox = await handle.boundingBox();
	if (!handleBox) {
		throw new Error("Handle box not found");
	}

	const startX = handleBox.x + handleBox.width / 2;
	const startY = handleBox.y + 100;

	// Drag left (increase width)
	await page.mouse.move(startX, startY);
	await page.mouse.down();
	await page.mouse.move(startX - 200, startY);
	await page.mouse.up();

	// Verify increased width
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box ? box.width : 0;
			},
			{ timeout: 15000 },
		)
		.toBeGreaterThan(initialBox.width + 150);

	const resizedBox = await rightPanel.boundingBox();
	if (!resizedBox) {
		throw new Error("Resized box not found");
	}

	// Drag right (decrease width)
	const newHandleBox = await handle.boundingBox();
	if (!newHandleBox) {
		throw new Error("New handle box not found");
	}
	const nextX = newHandleBox.x + newHandleBox.width / 2;
	await page.mouse.move(nextX, startY);
	await page.mouse.down();
	await page.mouse.move(nextX + 150, startY);
	await page.mouse.up();

	// Verify decreased width
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box ? box.width : 9999;
			},
			{ timeout: 15000 },
		)
		.toBeLessThan(resizedBox.width - 100);
});

test("right sidebar width is clamped and does not cause overflow", async ({
	page,
}) => {
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	await rightPanel.waitFor({ state: "attached", timeout: 20000 });
	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

	await toggleButton.click();
	await expect(rightPanel).toHaveCSS("width", "344px");

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

	const startX = handleBox.x + handleBox.width / 2;
	const startY = handleBox.y + 100;

	// Attempt to drag to the far left (beyond 80% width)
	await page.mouse.move(startX, startY);
	await page.mouse.down();
	await page.mouse.move(0, startY);
	await page.mouse.up();

	// Verify that the width is clamped (e.g., should not be 100% of viewport)
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box ? box.width : 0;
			},
			{ timeout: 15000 },
		)
		.toBeLessThan(viewport.width * 0.85);

	// Verify no horizontal scrollbar
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
});
