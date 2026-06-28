import { expect, test } from "@playwright/test";

test.describe("Summary Separator Visibility", () => {
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

		// Open right panel
		const openButton = page.getByTestId("right-panel-toggle");
		await openButton.click();
		await page.waitForTimeout(500);
	});

	test("should show separator when both Vanilla and ExR roles are present", async ({ page }) => {
		// By default mock data has both
		const summary = page.getByTestId("right-panel-summary");
		const separators = summary.locator('[data-slot="separator"]');
		const targetSeparator = separators.nth(2);
		await expect(targetSeparator).toBeVisible();
	});

	test("should hide separator when only Vanilla roles are present", async ({ page }) => {
		await page.evaluate(() => {
            // @ts-expect-error - test hook
			const store = (window as any).useStore;
            if (!store) return;
			const state = store.getState();
			const newExrValue = { ...state.exrValue };
			for (const key in newExrValue) {
				const val = newExrValue[key];
				if (val.values) {
					newExrValue[key] = { ...val, selection: 0 };
				}
			}
			state.setExROptions(newExrValue, state.isExROptionActive);
		});

		const summary = page.getByTestId("right-panel-summary");
		const separators = summary.locator('[data-slot="separator"]');
		const targetSeparator = separators.nth(2);
		await expect(targetSeparator).not.toBeVisible();
	});

	test("should hide separator when only ExR roles are present", async ({ page }) => {
		await page.evaluate(() => {
            // @ts-expect-error - test hook
			const store = (window as any).useStore;
            if (!store) return;
			const state = store.getState();
			const newAuValue = { ...state.auValue };
			for (const key in newAuValue) {
				newAuValue[key] = 0;
			}
			state.setAuValue(newAuValue);
		});

		const summary = page.getByTestId("right-panel-summary");
		const separators = summary.locator('[data-slot="separator"]');
		const targetSeparator = separators.nth(2);
		await expect(targetSeparator).not.toBeVisible();
	});

	test("should hide separator when neither roles are present", async ({ page }) => {
		await page.evaluate(() => {
            // @ts-expect-error - test hook
			const store = (window as any).useStore;
            if (!store) return;
			const state = store.getState();

			const newExrValue = { ...state.exrValue };
			for (const key in newExrValue) {
				const val = newExrValue[key];
				if (val.values) {
					newExrValue[key] = { ...val, selection: 0 };
				}
			}
			state.setExROptions(newExrValue, state.isExROptionActive);

			const newAuValue = { ...state.auValue };
			for (const key in newAuValue) {
				newAuValue[key] = 0;
			}
			state.setAuValue(newAuValue);
		});

		const summary = page.getByTestId("right-panel-summary");
		const separators = summary.locator('[data-slot="separator"]');
		const targetSeparator = separators.nth(2);
		await expect(targetSeparator).not.toBeVisible();
	});
});
