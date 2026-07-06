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

test.describe("Au Tab Outline Colors", () => {
	test("Tab 0 (General) should have white outline", async ({ page }) => {
		await page.getByRole("tab", { name: "ゲーム設定", exact: true }).click();
		const categoryList = page.getByTestId("category-list");
		await expect(categoryList).toHaveCSS(
			"border-top-color",
			"rgb(255, 255, 255)",
		);
	});

	test("Tab 1 (Crewmate) should have lime green outline", async ({ page }) => {
		await page.getByRole("tab", { name: "クルー", exact: true }).click();
		const categoryList = page.getByTestId("category-list");
		await expect(categoryList).toHaveCSS(
			"border-top-color",
			"rgb(140, 255, 255)",
		);
	});

	test("Tab 2 (Impostor) should have red outline", async ({ page }) => {
		await page.getByRole("tab", { name: "インポスター", exact: true }).click();
		const categoryList = page.getByTestId("category-list");
		await expect(categoryList).toHaveCSS(
			"border-top-color",
			"rgb(255, 25, 25)",
		);
	});
});
