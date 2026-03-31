import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// API遅延を最小限にしてテストを高速化
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 0;
	});
	await page.goto("/");
	// ローディング画面が消えるのを待つ
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});

	// ExR Options タブに切り替え
	await page.getByRole("button", { name: "ExR Options" }).click();
	await page.waitForSelector('[data-testid="exr-category-list"]');
});

test.describe("ExR Role Accordion Disabled State", () => {
	const SHERIFF_ID = "270";

	test("should disable accordion when spawn rate is 0", async ({ page }) => {
		// 役職タブ（クルーメイト）に切り替え
		await page
			.getByRole("button", { name: "クルーメイト役職設定", exact: true })
			.click();

		const sheriffCategory = page.getByTestId(`exr-category-${SHERIFF_ID}`);
		const toggleButton = sheriffCategory.getByRole("button", {
			name: "シェリフ",
		});
		const rateSlider = sheriffCategory
			.getByTestId("spawn-rate-control")
			.locator('input[type="range"]');

		// 1. まずレートを 10% にしてアコーディオンを開く
		await rateSlider.fill("1"); // 10%
		await toggleButton.click();
		const content = sheriffCategory.getByTestId("exr-category-list-container");
		await expect(content).toBeVisible();

		// 2. レートを 0% にするとアコーディオンが閉じ、無効化されることを確認
		await rateSlider.fill("0"); // 0%
		await expect(content).not.toBeVisible();
		await expect(toggleButton).toBeDisabled();

		// 3. アイコンがドット「・」になっていることを確認
		await expect(toggleButton.getByText("・")).toBeVisible();
		await expect(toggleButton.locator("svg")).not.toBeVisible();

		// 4. レートを 10% に戻すと再度有効化されることを確認
		await rateSlider.fill("1"); // 10%
		await expect(toggleButton).toBeEnabled();
		await expect(toggleButton.locator("svg")).toBeVisible();
		await expect(toggleButton.getByText("・")).not.toBeVisible();

		// 5. 再度開けることを確認
		// 少し待ってからクリック（状態遷移後の安定を待つ）
		await page.waitForTimeout(100);
		await toggleButton.click();
		await expect(toggleButton).toHaveAttribute("aria-expanded", "true");
	});
});
