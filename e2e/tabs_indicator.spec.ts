import { expect, test } from "@playwright/test";
import { getSidebarButton } from "./conftest";

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
		// Switch to Among Us（サイドバー内のボタンに限定）
		await getSidebarButton(page, "Among Us").click();

		// Select Tab 1 (Crewmate)
		const tab1 = page.getByRole("tab", { name: "クルー", exact: true });
		await tab1.click();

		// Check if the tab has the correct CSS variable for color
		// Note: The indicator is a ::before pseudo-element, which is hard to check directly for all properties,
		// but we can check the CSS variable on the element itself.
		const colorVar = await tab1.evaluate((el) =>
			(el as HTMLElement).style.getPropertyValue("--tab-color").trim(),
		);
		// playwright can receive hex or rgb depending on browser/how it was set
		expect(colorVar.toLowerCase()).toMatch(/^(rgb\(140, 255, 255\)|#8cffff)$/);

		// Select Tab 2 (Impostor - Red)
		const tab2 = page.getByRole("tab", { name: "インポスター", exact: true });
		await tab2.click();
		const colorVar2 = await tab2.evaluate((el) =>
			(el as HTMLElement).style.getPropertyValue("--tab-color").trim(),
		);
		expect(colorVar2.toLowerCase()).toMatch(/^(rgb\(255, 25, 25\)|#ff1919)$/);
	});

	test("ExR Tab active indicator should support gradients", async ({
		page,
	}) => {
		// Extreme Roles is default（サイドバー内のボタンに限定）
		await page
			.locator('[data-slot="sidebar"]')
			.getByRole("button", { name: "Extreme Roles" })
			.click();

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
