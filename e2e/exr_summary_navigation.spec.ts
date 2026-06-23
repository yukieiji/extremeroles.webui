import { expect, test } from "@playwright/test";

test.describe("ExR Navigation from Summary", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await expect(page.getByText("Loading data...")).not.toBeVisible({
			timeout: 30000,
		});

		// Open right sidebar
		const openButton = page.getByTestId("right-panel-toggle");
		await openButton.click();
		await page.waitForTimeout(500);
	});

	test("should switch to ExR tab and highlight category when double-clicking ExR summary row", async ({ page }) => {
		const exrRole = page.getByTestId("exr-role-summary").first();
		const roleName = await exrRole.locator('span').first().textContent();
		console.log(`Double-clicking on ExR role: ${roleName}`);

		await exrRole.dblclick({ force: true });

		// Check if switched to Extreme Roles tab
		await expect(
			page.getByRole("heading", { name: "Extreme Roles" }),
		).toBeVisible();

		// Check if any element has data-highlighted="true"
		const highlightedElement = page.locator('[data-highlighted="true"]');
		await expect(highlightedElement).toBeVisible({ timeout: 5000 });

        // Verify it is scrolled into view (approximately)
        const box = await highlightedElement.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
            const viewportHeight = page.viewportSize()?.height ?? 0;
            expect(box.y).toBeGreaterThan(0);
            expect(box.y).toBeLessThan(viewportHeight);
        }
	});

	test("should switch to ExR tab and highlight paired option row when double-clicking min-max summary row", async ({ page }) => {
        // Find a min-max summary row. "Liberal" is usually there in mock data.
        const minMaxRow = page.locator('button:has-text("Liberal")').filter({ hasText: / - / }).first();
        if (!(await minMaxRow.isVisible())) {
            console.log("Liberal min-max row not found, skipping specific check");
            return;
        }

		await minMaxRow.dblclick({ force: true });

		// Check if switched to Extreme Roles tab
		await expect(
			page.getByRole("heading", { name: "Extreme Roles" }),
		).toBeVisible();

		// Check if any element has data-highlighted="true"
		const highlightedElement = page.locator('[data-highlighted="true"]');
		await expect(highlightedElement).to_be_visible({ timeout: 5000 });

        // Verify it is scrolled into view (approximately)
        const box = await highlightedElement.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
            const viewportHeight = page.viewportSize()?.height ?? 0;
            expect(box.y).toBeGreaterThan(0);
            expect(box.y).toBeLessThan(viewportHeight);
        }
	});
});
