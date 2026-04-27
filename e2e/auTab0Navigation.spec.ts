import { expect, test } from "@playwright/test";

test.describe("AmongUs Tab 0 Navigation from Right Panel", () => {
	test.beforeEach(async ({ page }) => {
		// モックデータを使用するために dev:mock 相当の設定で起動している前提
		await page.goto("/");
		// 初期ロード待ち
		// testIdがうまく取れない場合を考慮して見出しを確認
		await expect(page.getByRole("heading", { name: /Options/ })).toBeVisible({
			timeout: 15000,
		});
	});

	test("navigates and highlights when an option is double-clicked in the right panel", async ({
		page,
	}) => {
		// 1. 右パネルを開く
		const rightPanelToggle = page.getByLabel("パネルを開く");
		if (await rightPanelToggle.isVisible()) {
			await rightPanelToggle.click();
		}
		await expect(page.getByLabel("右フローティングパネル")).toBeVisible();

		// 2. 「AmongUsの設定」アコーディオンを展開（デフォルトで開いているはずだが念のため）
		const auSettingsAccordion = page.getByText("AmongUsの設定");
		await expect(auSettingsAccordion).toBeVisible();

		// 3. Tab 0の内容（例: 「マップ」）が表示されていることを確認
		const mapSetting = page.getByText("マップ", { exact: true });
		await expect(mapSetting).toBeVisible();

		// 4. メインエディタで一旦 ExR Options に切り替えておく
		await page.getByRole("button", { name: "ExR Options" }).click();
		await expect(
			page.getByRole("heading", { name: "ExR Options" }),
		).toBeVisible();

		// 5. 右パネルの「マップ」をダブルクリック
		await mapSetting.dblclick();

		// 6. 自動的に Au Options に戻り、項目が表示されていることを確認
		await expect(
			page.getByRole("heading", { name: "Au Options" }),
		).toBeVisible();

		// ハイライト用のクラスやスタイルが適用されているか確認
		// id="au-option-..." の要素がリングクラスを持っているか
		const mapRow = page
			.locator('[id^="au-option-"]')
			.filter({ hasText: "マップ" });
		await expect(mapRow).toHaveClass(/ring-2/);
		await expect(mapRow).toHaveClass(/ring-blue-500/);

		// 7. 数秒後にハイライトが消えることを確認
		await expect(mapRow).not.toHaveClass(/ring-2/, { timeout: 3000 });
	});
});
