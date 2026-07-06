import { expect, test } from "@playwright/test";
import { reloadWithPersistence } from "./conftest";

async function getSidebarState(p: Page) {
	return await p.getAttribute('[data-slot="sidebar"]', "data-state");
}

async function getLocalStorageValue(p: Page) {
	return await p.evaluate(() => localStorage.getItem("sidebar_state"));
}

async function check(page: Page, isOpen: boolean | null) {
	const state = isOpen === null || isOpen ? "expanded" : "collapsed";

	// Wait for transition or state change
	await expect(page.locator('[data-slot="sidebar"]')).toHaveAttribute(
		"data-state",
		state,
	);
	expect(await getSidebarState(page)).toBe(state);

	if (isOpen === null) {
		return;
	}

	const storageValue = isOpen ? "true" : "false";
	expect(await getLocalStorageValue(page)).toBe(storageValue);
}

async function toggle(page: Page) {
	const trigger = page.locator('[data-slot="sidebar-trigger"]');
	await trigger.click();
}

test("sidebar state is persisted in localStorage", async ({
	page,
	browser,
}) => {
	await page.goto("/");

	// Wait for the application to load
	await page.waitForSelector('[data-slot="sidebar"]');

	await check(page, null);

	// 2. Toggle to collapsed
	await toggle(page);

	// Wait for transition or state change
	await check(page, false);

	// 3. Reload and check if it's still collapsed
	const { newPage, newContext } = await reloadWithPersistence(page, browser);
    await newPage.waitForSelector('[data-slot="sidebar"]');

	await check(newPage, false);

	// 4. Toggle back to expanded
	await toggle(newPage);
	await check(newPage, true);

	const { newPage: newPage2, newContext: newContext2 } = await reloadWithPersistence(
		newPage,
		browser,
	);
    await newPage2.waitForSelector('[data-slot="sidebar"]');

	// 5. Reload and check if it's still expanded
	await check(newPage2, true);

	await newContext.close();
	await newContext2.close();
});
