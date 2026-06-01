import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.request.post("/mock/reset", { maxRetries: 5 });
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 0;
	});
	await page.goto("/");
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});
});

test.describe("Tabs Indicator Styling", () => {
	test("Au Tab active indicator should have correct color", async ({
		page,
	}) => {
		// Switch to Au Options
		await page.getByRole("button", { name: "Au Options" }).click();

		// Select Tab 1 (Crewmate - Lime Green)
		const tab1 = page.getByRole("tab", { name: "1", exact: true });
		await tab1.click();

		// Check if the tab has the correct CSS variable for color
		// Note: The indicator is a ::before pseudo-element, which is hard to check directly for all properties,
		// but we can check the CSS variable on the element itself.
		const colorVar = await tab1.evaluate((el) =>
			(el as HTMLElement).style.getPropertyValue("--tab-color").trim(),
		);
		// playwright can receive hex or rgb depending on browser/how it was set
		expect(colorVar.toLowerCase()).toMatch(/^(rgb\(140, 255, 0\)|#8cff00)$/);

		// Select Tab 2 (Impostor - Red)
		const tab2 = page.getByRole("tab", { name: "2", exact: true });
		await tab2.click();
		const colorVar2 = await tab2.evaluate((el) =>
			(el as HTMLElement).style.getPropertyValue("--tab-color").trim(),
		);
		expect(colorVar2.toLowerCase()).toMatch(/^(rgb\(255, 0, 0\)|#ff0000)$/);
	});

	test("ExR Tab active indicator should support gradients", async ({
		page,
	}) => {
		// ExR Options is default
		await page.getByRole("button", { name: "ExR Options" }).click();

		// General Tab
		const generalTab = page.getByRole("tab").first();
		const colorVar = await generalTab.evaluate((el) =>
			(el as HTMLElement).style.getPropertyValue("--tab-color").trim(),
		);
		expect(colorVar).toBeTruthy();

		// Find a tab that likely has multiple colors if possible,
		const tabs = page.getByRole("tab");
		const count = await tabs.count();
		for (let i = 0; i < count; i++) {
			const tab = tabs.nth(i);
			const color = await tab.evaluate((el) =>
				(el as HTMLElement).style.getPropertyValue("--tab-color").trim(),
			);
			if (color) {
				// If color is set, check if it's a gradient or a solid color
				expect(color).toMatch(/^(rgb|rgba|linear-gradient|#)/i);
			}
		}
	});
});
