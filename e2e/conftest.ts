import type { Browser, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const LEFT_SIDEBAR = '[data-slot="sidebar"]';
export const RIGHT_SIDEBAR_TEST_ID = '[data-testid="right-side-panel"]';

export function getSideber(page: Page) {
	return page.locator(LEFT_SIDEBAR);
}

export function getSidebarButton(page: Page, name: string) {
	return getSideber(page).getByRole("button", { name: name });
}

export function getDialog(page: Page) {
	return page.locator('[data-slot="dialog-portal"]');
}

export async function accessMainPage(page: Page) {
	await page.goto("/");
	// Wait for loading screen to disappear
	await expect(page.locator("body")).not.toContainText("Loading data...", {
		timeout: 60000,
	});
}

export async function reload(page: Page, browser: Browser) {
	const context = page.context();
	const storage = await context.storageState();

	const newContext = await browser.newContext({ storageState: storage });
	const newPage = await newContext.newPage();
	await newPage.goto(page.url(), { waitUntil: "domcontentloaded" });
	await newPage.waitForSelector(LEFT_SIDEBAR);

	return { newPage, newContext };
}
