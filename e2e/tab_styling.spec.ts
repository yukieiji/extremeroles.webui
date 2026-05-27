import { expect, test } from "@playwright/test";

test("Tab selection indicators and colors are applied correctly", async ({
	page,
}) => {
	await page.goto("/");

	// Navigate to ExR Options
	await page.click("text=ExR Options");

	// Find the tabs trigger for Crewmate (TabId 1)
	const crewmateTab = page.locator('[data-slot="tabs-trigger"]').nth(1);
	await expect(crewmateTab).toBeVisible();

	// Check if it has the data-indicator-color attribute (Crewmate should have a color)
	const color = await crewmateTab.getAttribute("data-indicator-color");
	expect(color).not.toBeNull();
	expect(color).not.toBe("var(--foreground)");

	// Select the tab
	await crewmateTab.click();

	// The indicator is an 'after' pseudo-element, which is hard to check directly with Playwright,
	// but we can check if the tab is active and has the correct variant in TabsList
	await expect(crewmateTab).toHaveAttribute("data-active", "");

	const tabsList = page.locator('[data-slot="tabs-list"]');
	await expect(tabsList).toHaveAttribute("data-variant", "line");

	// Check Ghost Crewmate tab (TabId 5)
	const ghostCrewmateTab = page.locator('[data-slot="tabs-trigger"]').nth(5);
	await expect(ghostCrewmateTab).toBeVisible();
	const ghostColor = await ghostCrewmateTab.getAttribute(
		"data-indicator-color",
	);
	expect(ghostColor).not.toBeNull();

	// Verify category container has a border when tab is selected
	await ghostCrewmateTab.click();
	const categoryList = page.locator('[data-testid="category-list"]');
	await expect(categoryList).toBeVisible();

	// The border is applied via inline style
	const style = await categoryList.getAttribute("style");
	expect(style).toContain("border");
});
