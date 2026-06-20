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

	test("separator between Vanilla and ExR roles should be 50% width and centered", async ({
		page,
	}) => {
		const summary = page.getByTestId("right-panel-summary");
		await expect(summary).toBeVisible();

		const separators = summary.locator('[data-slot="separator"]');
		// The separator we want is the one with w-1/2 (the 3rd one)
		const targetSeparator = separators.nth(2);
		await expect(targetSeparator).toBeAttached();

		const box = await targetSeparator.boundingBox();
		const containerBox = await summary.boundingBox();

		if (box && containerBox) {
			// Width should be approximately 50% of container width
			expect(box.width).toBeGreaterThan(containerBox.width * 0.4);
			expect(box.width).toBeLessThan(containerBox.width * 0.6);

			// Centering
			const leftMargin = box.x - containerBox.x;
			const rightMargin =
				containerBox.x + containerBox.width - (box.x + box.width);
			expect(Math.abs(leftMargin - rightMargin)).toBeLessThan(5);
		} else {
			throw new Error("Could not get bounding boxes");
		}
	});
});
