import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("body")).not.toContainText("Loading data...", {
		timeout: 60000,
	});
	// Ensure main content is loaded
	await expect(page.getByRole("heading", { name: "Au Options" })).toBeVisible({
		timeout: 45000,
	});
});

test("isResizing state is correctly managed", async ({ page }) => {
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	await rightPanel.waitFor({ state: "attached", timeout: 20000 });
	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

	await toggleButton.click();
	// Wait for panel to open
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box ? box.width : 0;
			},
			{
				timeout: 15000,
			},
		)
		.toBeGreaterThan(100);

	const handle = page.getByTestId("resize-handle");
	await expect(handle).toBeVisible();
	const handleBox = await handle.boundingBox();
	if (!handleBox) {
		throw new Error("Handle box not found");
	}

	// Dispatch event instead of mouse actions to avoid potential issues with thin handles
	await handle.dispatchEvent("mousedown", { button: 0 });

	// Move a bit to ensure resize state is active
	await page.evaluate((targetX) => {
		window.dispatchEvent(
			new MouseEvent("mousemove", {
				bubbles: true,
				clientX: targetX,
				clientY: 300,
			}),
		);
	}, handleBox.x - 20);

	await expect(page.locator("body")).toHaveCSS("cursor", "ew-resize", {
		timeout: 5000,
	});
	await page.evaluate(() => {
		window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
	});
});

test("right sidebar can be resized", async ({ page }) => {
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	await rightPanel.waitFor({ state: "attached", timeout: 20000 });
	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

	await toggleButton.click();

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

	// Drag left (increase width)
	const handleBox = await handle.boundingBox();
	if (!handleBox) {
		throw new Error("Handle box not found");
	}
	await handle.dispatchEvent("mousedown", { button: 0 });
	await page.evaluate((startX) => {
		window.dispatchEvent(
			new MouseEvent("mousemove", {
				bubbles: true,
				clientX: startX - 200,
				clientY: 300,
			}),
		);
	}, handleBox.x);
	await page.evaluate(() => {
		window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
	});

	// Verify increased width
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box ? box.width : 0;
			},
			{ timeout: 15000 },
		)
		.toBeGreaterThan(initialBox.width + 50);

	const resizedBox = await rightPanel.boundingBox();
	if (!resizedBox) {
		throw new Error("Resized box not found");
	}

	// Drag right (decrease width)
	const newHandle = page.getByTestId("resize-handle");
	const newHandleBox = await newHandle.boundingBox();
	if (!newHandleBox) {
		throw new Error("New handle box not found");
	}
	await newHandle.dispatchEvent("mousedown", { button: 0 });
	await page.evaluate((startX) => {
		window.dispatchEvent(
			new MouseEvent("mousemove", {
				bubbles: true,
				clientX: startX + 150,
				clientY: 300,
			}),
		);
	}, newHandleBox.x);
	await page.evaluate(() => {
		window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
	});

	// Verify decreased width
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				// Use a more lenient check for decreasing width, as high DPI or rounding might cause slight variations
				// but it should definitely be less than resizedBox.width.
				return box ? box.width : 9999;
			},
			{ timeout: 15000 },
		)
		.toBeLessThan(resizedBox.width - 10);
});

test("right sidebar width is clamped and does not cause overflow", async ({
	page,
}) => {
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	await rightPanel.waitFor({ state: "attached", timeout: 20000 });
	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

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

	// Attempt to drag to the far left (beyond 80% width)
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
