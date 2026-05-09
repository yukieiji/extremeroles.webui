import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// モックサーバーの状態をリセット
	await page.request.post("/mock/reset", { maxRetries: 5 });
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
	await expect(page.getByTestId("category-list")).toBeVisible();
});

test.describe("ExR Role Accordion Disabled State", () => {
	test("should disable accordion when spawn rate is 0", async ({ page }) => {
		await page
			.getByRole("button", { name: "クルーメイト役職設定", exact: true })
			.click();

		const sheriffCategory = page
			.getByTestId("role-category")
			.filter({ hasText: "シェリフ" });
		const toggleButton = sheriffCategory.getByRole("button", {
			name: "シェリフ",
		});
		const rateSlider = sheriffCategory
			.getByTestId("spawn-rate-control")
			.locator('input[type="range"]');

		// 1. まずレートを 10% にすると、自動的に開くことを確認
		await rateSlider.fill("1"); // 10%
		const content = sheriffCategory.getByTestId("accordion-content");
		await expect(content).toBeVisible();
		await expect(content).toHaveClass(/grid-rows-\[1fr\]/);

		// 2. レートを 0% にするとアコーディオンが閉じ、無効化されることを確認
		await rateSlider.fill("0"); // 0%
		await expect(content).not.toBeVisible();
		await expect(toggleButton).toBeDisabled();

		// 3. アイコンがドット「・」になっていることを確認
		// LucideのDotコンポーネントが描画される
		await expect(toggleButton.locator("svg.lucide-dot")).toBeVisible();

		// 4. レートを 10% に戻すと再度有効化され、自動的に開くことを確認
		await rateSlider.fill("1"); // 10%
		await expect(toggleButton).toBeEnabled();
		await expect(toggleButton.locator("svg")).toBeVisible();
		await expect(toggleButton.locator("svg.lucide-dot")).not.toBeVisible();
		await expect(toggleButton).toHaveAttribute("aria-expanded", "true");
		await expect(content).toBeVisible();
		await expect(content).toHaveClass(/grid-rows-\[1fr\]/);

		// 5. 一旦閉じてから数を変更しても自動的に開くことを確認
		await toggleButton.click();
		await expect(toggleButton).toHaveAttribute("aria-expanded", "false");

		const countSlider = sheriffCategory
			.getByTestId("spawn-count-control")
			.locator('input[type="range"]');

		// 既にレートが10%なので、数を変更しても自動では開かないはず（今回の要件は「0から有効になった時」）
		// 念の為0にしてから動かす
		await rateSlider.fill("0");
		await expect(toggleButton).toBeDisabled();

		await countSlider.fill("2"); // 数を2にする（0から0以外へ）
		await expect(toggleButton).toBeEnabled();
		await expect(toggleButton).toHaveAttribute("aria-expanded", "true");
		await expect(content).toBeVisible();
		await expect(content).toHaveClass(/grid-rows-\[1fr\]/);
	});
});
