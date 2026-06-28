import type { Page } from "@playwright/test";

export function getSideber(page: Page) {
	return page.locator('[data-slot="sidebar"]');
}

export function getSidebarButton(page: Page, name: string) {
	return getSideber(page).getByRole("button", { name: name });
}

export function getDialog(page: Page) {
	return page.locator('[data-slot="dialog-portal"]');
}
