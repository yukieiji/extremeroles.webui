import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 0;
	});
	await page.goto("/");
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});

	// サイドバーが表示されるまで待機（アプリケーションがインタラクティブになったことの確認）
	await expect(page.getByLabel("オプションサイドバー")).toBeVisible({
		timeout: 15000,
	});

	await page.getByRole("button", { name: "ExR Options" }).click();
});

test("Option ID 52 and higher should be visible in role categories when active", async ({
	page,
}) => {
	// 1. "ゴーストニュートラル役職設定" タブを選択
	await page
		.getByRole("button", { name: "ゴーストニュートラル役職設定", exact: true })
		.click();

	// 2. "フォラス" カテゴリ (ID: 521) を探す
	const forasCategory = page.getByTestId("exr-category-521");
	await expect(forasCategory).toBeVisible();

	// 3. スポーンレートを 10% に変更してカテゴリを有効化
	const rateSlider = forasCategory
		.getByTestId("spawn-rate-control")
		.locator('input[type="range"]');
	await rateSlider.fill("1");

	// 4. カテゴリを開く
	await forasCategory.getByRole("button", { name: "フォラス" }).click();

	// 5. アコーディオンの中身が表示されるのを待つ
	const content = forasCategory.locator(
		'[data-testid="exr-category-list-container"]',
	);
	// アコーディオンの開閉アニメーションや、レンダリングの遅延を考慮して待機
	await expect(content).toBeVisible({ timeout: 10000 });

	// 6. ID 52 のオプション（アサインウェイト）が表示されているか確認
	// 修正前は ID 50/51 の子要素として定義されているため表示されないはず
	await expect(content.getByText("アサインウェイト")).toBeVisible();
});
