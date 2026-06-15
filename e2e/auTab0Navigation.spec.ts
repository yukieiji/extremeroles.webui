import { expect, test } from "@playwright/test";

test.describe("AmongUs Tab 0 Navigation from Right Panel", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		// ローディング画面が消えるのを待つ
		await expect(page.getByText("Loading data...")).not.toBeVisible({
			timeout: 30000,
		});
	});

	test("navigates and highlights when an option is double-clicked in the right panel", async ({
		page,
	}) => {
		// 1. 右パネルを開く
		const rightPanelToggle = page.getByTestId("right-panel-toggle");
		await rightPanelToggle.click();
		const rightPanel = page.getByTestId("right-side-panel");
		await expect(rightPanel).toBeVisible({ timeout: 15000 });

		// 2. 「AmongUsの設定」アコーディオンを展開（デフォルトで開いているはずだが念のため）
		const auSettingsAccordion = page.getByRole("button", {
			name: "AmongUsの設定",
		});
		await expect(auSettingsAccordion).toBeVisible();

		// アコーディオンが閉じている場合はクリックして開く（初期値 ?? true だが開いていない可能性を考慮）
		if ((await auSettingsAccordion.getAttribute("aria-expanded")) === "false") {
			await auSettingsAccordion.click();
		}

		// 3. Tab 0の内容が表示されていることを確認 (インポスター数)
		// Summaryに移動したので、パネルを開けば直接見えるはず
		// 翻訳データに基づいているため、正規表現で柔軟にマッチング
		const impCountSetting = rightPanel
			.getByTestId("right-panel-summary")
			.getByRole("button", {
				name: /^(インポスター数|Impostor Count)/,
			});

		// スクロールが必要な場合がある
		await impCountSetting.scrollIntoViewIfNeeded();
		await expect(impCountSetting).toBeVisible({ timeout: 15000 });

		// 値が表示されていることを確認（モックデータでは1のはず）
		await expect(impCountSetting).toContainText("1");

		// 4. メインエディタで一旦 ExR Options に切り替えておく
		// パネルを一旦閉じる
		await rightPanelToggle.click();
		await page.getByRole("button", { name: "ExR Options" }).click();
		await expect(
			page.getByRole("heading", { name: "ExR Options" }),
		).toBeVisible();

		// 5. 右パネルの項目をダブルクリック
		// 再び開く
		await rightPanelToggle.click();
		await expect(rightPanel).toBeVisible({ timeout: 15000 });
		await impCountSetting.scrollIntoViewIfNeeded();
		await impCountSetting.dblclick();

		// 6. 自動的に Au Options に戻り、項目が表示されていることを確認
		await expect(page.getByRole("heading", { name: "Au Options" })).toBeVisible(
			{ timeout: 10000 },
		);

		// ハイライト用のクラスやスタイルが適用されているか確認
		// ハイライト状態（data-highlighted="true"を持つ）かつ、設定項目名を含む要素を特定する
		const highlightedRow = page
			.locator("main")
			.locator('[data-highlighted="true"]')
			.filter({ hasText: "インポスター数" })
			.first();
		await expect(highlightedRow).toBeVisible();

		// 7. 数秒後にハイライトが消えることを確認
		await expect(highlightedRow).not.toBeVisible({ timeout: 15000 });
	});
});
