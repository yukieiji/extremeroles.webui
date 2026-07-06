import type { Browser, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export function getSideber(page: Page) {
	return page.locator('[data-slot="sidebar"]');
}

export function getSidebarButton(page: Page, name: string) {
	return getSideber(page).getByRole("button", { name: name });
}

export function getDialog(page: Page) {
	return page.locator('[data-slot="dialog-portal"]');
}

/**
 * 永続化テストのために、現在のストレージ状態を引き継いで新しいブラウザコンテキストでページを開き直す
 */
export async function reloadWithPersistence(page: Page, browser: Browser) {
	const context = page.context();
	const storage = await context.storageState();

	const newContext = await browser.newContext({ storageState: storage });
	const newPage = await newContext.newPage();
	await newPage.goto(page.url());

	// データ読み込み待ち
	await expect(newPage.locator("body")).not.toContainText("Loading data...", {
		timeout: 60000,
	});

	return { newPage, newContext };
}
