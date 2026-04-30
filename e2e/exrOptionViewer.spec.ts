import { expect, test } from "@playwright/test";

test.describe("ExR Tab 0 Navigation from Right Panel", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		// Wait for loading to finish
		await expect(page.getByText("Loading data...")).not.toBeVisible({
			timeout: 30000,
		});
	});

	test("renders ExR viewer and navigates on double-click", async ({ page }) => {
		// 1. Open right panel
		const rightPanelToggle = page.getByRole("button", { name: "パネルを開く" });
		await rightPanelToggle.click();
		await expect(page.getByLabel("右フローティングパネル")).toBeVisible();

		// 2. Expand "ExRの設定" accordion
		const exrSettingsAccordion = page.getByRole("button", {
			name: "ExRの設定",
		});
		await expect(exrSettingsAccordion).toBeVisible();

		if (
			(await exrSettingsAccordion.getAttribute("aria-expanded")) === "false"
		) {
			await exrSettingsAccordion.click();
		}

		// 3. Verify Preset is visible
		const presetDisplay = page
			.getByLabel("右フローティングパネル")
			.getByText("Preset");
		await expect(presetDisplay).toBeVisible();

		await page
			.getByLabel("右フローティングパネル")
			.screenshot({ path: "exr_viewer_screenshot.png" });

		// 4. Expand a category (e.g., "一般")
		// Based on mock data in the real app, "一般" should be a category in GeneralTab
		const generalCategory = page
			.getByLabel("右フローティングパネル")
			.getByRole("button", {
				name: /^(開|閉)じる (一般|General)$/,
			});

		if (await generalCategory.isVisible()) {
			if ((await generalCategory.getAttribute("aria-expanded")) === "false") {
				await generalCategory.click();
			}

			// 5. Find an option and double-click
			const optionRow = page
				.getByLabel("右フローティングパネル")
				.getByTitle("ダブルクリックで設定場所へ移動")
				.first();

			await optionRow.scrollIntoViewIfNeeded();
			await expect(optionRow).toBeVisible();

			// Switch main view to Au Options first to verify it switches back
			await page.getByRole("button", { name: "閉じる", exact: true }).click();
			await page.getByRole("button", { name: "Au Options" }).click();
			await expect(
				page.getByRole("heading", { name: "Au Options" }),
			).toBeVisible();

			// Open right panel again and double-click
			await page.getByRole("button", { name: "パネルを開く" }).click();
			await optionRow.dblclick({ force: true });

			// 6. Verify it switched back to ExR Options
			await expect(
				page.getByRole("heading", { name: "ExR Options" }),
			).toBeVisible({ timeout: 10000 });
		}
	});
});
