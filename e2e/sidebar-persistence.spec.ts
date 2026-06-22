import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

test("sidebar state is persisted in localStorage", async ({
	page,
	browser,
}) => {
	await page.goto("/");

	// Wait for the application to load
	await page.waitForSelector('[data-slot="sidebar"]');

	// Helper to get sidebar state
	const getSidebarState = async (p: Page) => {
		return await p.getAttribute('[data-slot="sidebar"]', "data-state");
	};

	// Helper to get localStorage value
	const getLocalStorageValue = async (p: Page) => {
		return await p.evaluate(() => localStorage.getItem("sidebar_state"));
	};

	// 1. Initial state (default should be expanded)
	expect(await getSidebarState(page)).toBe("expanded");

	// 2. Toggle to collapsed
	const trigger = page.locator('[data-slot="sidebar-trigger"]');
	await trigger.click();

	// Wait for transition or state change
	await expect(page.locator('[data-slot="sidebar"]')).toHaveAttribute(
		"data-state",
		"collapsed",
	);
	expect(await getLocalStorageValue(page)).toBe("false");

	// 3. Reload and check if it's still collapsed
	// new context with same storage
	const context = page.context();
	const storage = await context.storageState();

	const newContext = await browser.newContext({ storageState: storage });
	const newPage = await newContext.newPage();
	await newPage.goto(page.url(), { waitUntil: "domcontentloaded" });

	await newPage.waitForSelector('[data-slot="sidebar"]');
	expect(await getSidebarState(newPage)).toBe("collapsed");
	expect(await getLocalStorageValue(newPage)).toBe("false");

	// 4. Toggle back to expanded
	await trigger.click();
	await expect(page.locator('[data-slot="sidebar"]')).toHaveAttribute(
		"data-state",
		"expanded",
	);
	expect(await getLocalStorageValue(newPage)).toBe("true");

	// 5. Reload and check if it's still expanded
	await page.reload();
	await page.waitForSelector('[data-slot="sidebar"]');
	expect(await getSidebarState(newPage)).toBe("expanded");
	expect(await getLocalStorageValue(newPage)).toBe("true");
});
