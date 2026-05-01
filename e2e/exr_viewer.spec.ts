import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	// Wait for loading to complete
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});
});

test("ExR options are displayed in the right sidebar", async ({ page }) => {
	// Open right sidebar
	await page.getByRole("button", { name: "パネルを開く" }).click();

	// Check if ExR Setting exists
	const exrSettings = page.getByRole("button", { name: "ExRの設定" });
	await expect(exrSettings).toBeVisible();

	// Initially Preset should be visible
	await expect(page.getByText("使用するプリセット")).toBeVisible();

	// "乱数に関する設定" is active by default in the mock data
	await expect(page.getByText("乱数に関する設定")).toBeVisible();
});

test("ExR category can be toggled in the right sidebar", async ({ page }) => {
	await page.getByRole("button", { name: "パネルを開く" }).click();

	const categoryAccordion = page.getByRole("button", {
		name: "乱数に関する設定",
	});
	await expect(categoryAccordion).toBeVisible();

	// Click to open
	await categoryAccordion.click();
	await expect(categoryAccordion).toHaveAttribute("aria-expanded", "true");

	// Check if option inside is visible
	await expect(page.getByText("強力なシャッフルを使用する")).toBeVisible();
});

test("ExR option double-click navigates to main settings", async ({ page }) => {
	await page.getByRole("button", { name: "パネルを開く" }).click();

	// Double click "使用するプリセット" (the Preset option)
	const presetRow = page.getByText("使用するプリセット");
	await presetRow.dblclick();

	// Navigation should happen. The right sidebar should be closed.
	// Since the sidebar uses translate-x-full to hide, we check for that class.
	await expect(page.getByLabel("右フローティングパネル")).toHaveClass(
		/translate-x-full/,
	);

	// In the main view, the ExR option should be visible.
	// PRESET_OPTION_UNIQUE_ID is 0.
	const mainOption = page.locator("#exr-option-0");
	await expect(mainOption).toBeVisible();

	// Check if it's highlighted (has ring-blue-500 class)
	await expect(mainOption).toHaveClass(/ring-blue-500/);
});
