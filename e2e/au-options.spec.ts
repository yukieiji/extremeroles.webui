import { expect, test } from "@playwright/test";
import { getLeftSidebarButton, prepare } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 0);

	// Among Us タブに切り替え
	await getLeftSidebarButton(page, "Among Us").click();
	await expect(page.getByTestId("category-list")).toBeVisible({
		timeout: 10000,
	});
});

test.describe("Au Option Interactions", () => {
	test("should display dropdown for map category in general tab", async ({
		page,
	}) => {
		// Tab ゲーム設定 (General)
		await page.getByRole("tab", { name: "ゲーム設定", exact: true }).click();

		// Map is now a direct dropdown (select element)
		// モックデータでは「マップ」
		// 「マップ」というテキストと combobox の両方を含む行要素を特定する
		const mapCategoryRow = page
			.locator("main")
			.locator("div")
			.filter({ hasText: "マップ" })
			.filter({ has: page.getByRole("combobox") })
			.first();
		await expect(mapCategoryRow).toBeVisible();
		await expect(mapCategoryRow.getByRole("combobox")).toBeVisible();
	});

	test("should display accordion for other general tab categories", async ({
		page,
	}) => {
		// Tab 0 (General)
		await page.getByRole("tab", { name: "ゲーム設定", exact: true }).click();

		// index 1 category should still be an accordion
		// メインコンテンツエリアのアコーディオンボタンを探す
		// 名称が変更されている可能性（アイコンがSVG化されたことによるアクセシブルネームの変化）を考慮し、部分一致で検索
		const category = page
			.locator("main")
			.getByRole("button", { name: /インポスター/ });

		// タイムアウトを長めに設定し、要素の出現を待つ
		await expect(category).toBeVisible({ timeout: 15000 });
	});

	test("should display role controls in header for role tabs", async ({
		page,
	}) => {
		// Tab 1
		await page.getByRole("tab", { name: "クルー", exact: true }).click();

		// Initially chance is probably 0, so it's disabled
		const category = page.getByTestId("role-category").first();
		const spawn = category.getByTestId("spawn-rate-control");
		await expect(spawn).toBeVisible();
		await expect(category.getByTestId("spawn-count-control")).toBeVisible();

		const inputs = spawn.locator('input[type="range"]');

		// Accordion button should be disabled when chance is 0
		const toggleButton = category.locator("button").first();

		if (Number(await inputs.inputValue()) > 0) {
			await expect(toggleButton).toBeVisible();
		} else {
			await expect(toggleButton).toBeDisabled();
		}
	});

	test("should synchronize chance and max count in Au roles", async ({
		page,
	}) => {
		await page.getByRole("tab", { name: "クルー", exact: true }).click();

		// Find a non-vanilla role that is not hidden (index 6 onwards in Tab 1 should be safe if mock data follows usual pattern)
		// Or just find the first visible category in the list
		const category = page
			.getByTestId("role-category")
			.filter({ has: page.getByTestId("spawn-rate-control") })
			.first();
		const chanceControl = category.getByTestId("spawn-rate-control");
		const countControl = category.getByTestId("spawn-count-control");

		const chanceInput = chanceControl.locator('input[type="number"]');
		const countInput = countControl.locator('input[type="number"]');
		const chanceSlider = chanceControl.locator('input[type="range"]');
		const countSlider = countControl.locator('input[type="range"]');

		// 初期化
		await countInput.fill("0");
		await chanceInput.fill("0");

		// 1. Set count to 1, should set chance to 10%
		await countSlider.fill("1");
		await expect(countInput).toHaveValue("1");
		await expect(chanceInput).toHaveValue("10");

		// 2. Set chance to 0, should set count to 0
		await chanceSlider.fill("0");
		await expect(chanceInput).toHaveValue("0");
		await expect(countInput).toHaveValue("0");

		// 3. Set count to 1, should set chance to 10%
		await countSlider.fill("1");
		await expect(countInput).toHaveValue("1");
		await expect(chanceInput).toHaveValue("10");

		// 4. Set count to 0, should set chance to 0%
		await countSlider.fill("0");
		await expect(countInput).toHaveValue("0");
		await expect(chanceInput).toHaveValue("0");
	});

	test("expanding role accordion should show other options", async ({
		page,
	}) => {
		await page.getByRole("tab", { name: "クルー", exact: true }).click();

		const category = page.getByTestId("role-category").first();
		const toggleButton = category.locator("button").first();

		// Set chance to 100% to enable accordion
		await category
			.getByTestId("spawn-rate-control")
			.locator('input[type="range"]')
			.fill("10");

		await expect(toggleButton).not.toBeDisabled();
		// Automatically opens when changed to non-zero, so toggleButton should already be expanded
		await expect(toggleButton).toHaveAttribute("aria-expanded", "true");

		// Should show additional options inside
		// Since I don't know the exact options in mock data, I'll just check if the content area appears
		await expect(
			category.getByTestId("accordion-content").first(),
		).toBeVisible();
	});
});
