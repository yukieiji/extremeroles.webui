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
});

test.describe("Au Role Accordion Auto Open", () => {
	test("should open accordion when role is enabled by chance or max count", async ({
		page,
	}) => {
		// Au Options の 役職タブ（タブ 1）に移動
		await page.getByRole("button", { name: "1", exact: true }).first().click();

		// 科学者 (Scientist)
		const category = page
			.getByTestId("role-category")
			.filter({ hasText: "科学者" });
		const toggleButton = category.getByRole("button").first();
		const chanceSlider = category
			.getByTestId("spawn-rate-control")
			.locator('input[type="range"]');
		const countSlider = category
			.getByTestId("spawn-count-control")
			.locator('input[type="range"]');

		// 初期状態：閉じていて無効
		await expect(toggleButton).toBeDisabled();
		await expect(toggleButton).toHaveAttribute("aria-expanded", "false");

		// 1. レートを 10% に変更
		await chanceSlider.fill("1");
		await expect(toggleButton).toBeEnabled();
		await expect(toggleButton).toHaveAttribute("aria-expanded", "true");
		// 内容が表示されていることを確認（適当な子要素をチェック）
		await expect(category.getByText("バイタル画面クールダウン")).toBeVisible();

		// 2. 0% に戻して閉じることを確認
		await chanceSlider.fill("0");
		await expect(toggleButton).toBeDisabled();
		await expect(
			category.getByText("バイタル画面クールダウン"),
		).not.toBeVisible();

		// 3. 数を 1 に変更して有効化
		await countSlider.fill("1");
		await expect(toggleButton).toBeEnabled();
		await expect(toggleButton).toHaveAttribute("aria-expanded", "true");
		await expect(category.getByText("バイタル画面クールダウン")).toBeVisible();
	});
});
