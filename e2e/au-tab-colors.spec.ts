import { expect, test } from "@playwright/test";

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

	// Among Us タブに切り替え
	await page.getByRole("button", { name: "Among Us" }).click();
	await expect(page.getByTestId("category-list")).toBeVisible({
		timeout: 10000,
	});
});

test.describe("Au Tab Outline Colors", () => {
	test("Tab 0 (General) should have white outline", async ({ page }) => {
		await page.getByRole("tab", { name: "0", exact: true }).click();
		const categoryList = page.getByTestId("category-list");
		await expect(categoryList).toHaveCSS(
			"border-top-color",
			"rgb(255, 255, 255)",
		);
	});

	test("Tab 1 (Crewmate) should have lime green outline", async ({ page }) => {
		await page.getByRole("tab", { name: "1", exact: true }).click();
		const categoryList = page.getByTestId("category-list");
		await expect(categoryList).toHaveCSS(
			"border-top-color",
			"rgb(140, 255, 0)",
		);
	});

	test("Tab 2 (Impostor) should have red outline", async ({ page }) => {
		await page.getByRole("tab", { name: "2", exact: true }).click();
		const categoryList = page.getByTestId("category-list");
		await expect(categoryList).toHaveCSS("border-top-color", "rgb(255, 0, 0)");
	});
});
