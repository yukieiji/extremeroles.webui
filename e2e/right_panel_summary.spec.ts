import { expect, test } from "@playwright/test";

test.describe("Right Panel Summary Roles", () => {
	test.beforeEach(async ({ page }) => {
		// モックデータを使用してページを開く
		await page.goto("/");

		// ローディング待機
		await expect(page.getByText("Loading data...")).not.toBeVisible({
			timeout: 30000,
		});

		// サイドパネルが開いていない場合は開く
		const openButton = page.getByTestId("right-panel-toggle");
		await openButton.click();

		// アニメーションを待つ
		await page.waitForTimeout(1000);
	});

	test("should display vanilla roles in summary", async ({ page }) => {
		const vanillaRoles = page.getByTestId("vanilla-role-summary");
		await expect(vanillaRoles.first()).toBeVisible();
	});

	test("should display ExR roles in summary", async ({ page }) => {
		const exrRoles = page.getByTestId("exr-role-summary");
		await expect(exrRoles.first()).toBeVisible();
	});

	test("should navigate to correct option on double click", async ({
		page,
	}) => {
		const exrRole = page.getByTestId("exr-role-summary").first();
		await exrRole.dblclick({ force: true });

		// タブが切り替わるまで待機
		await page.waitForTimeout(1000);

		// app.spec.ts を参考に
		await expect(
			page.getByRole("heading", { name: "ExR Options" }),
		).toBeVisible();
	});
});
