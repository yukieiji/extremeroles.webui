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
		const rightPanelToggle = page.getByRole("button", { name: "パネルを開く" });
		await rightPanelToggle.click();
		await expect(page.getByLabel("右フローティングパネル")).toBeVisible();

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
		// インポスターカテゴリを展開する必要がある
		// 右パネル内のアコーディオンを指定する
		// 日本語環境なので「開く」または「閉じる」を使用
		const imposterCategory = page
			.getByLabel("右フローティングパネル")
			.getByRole("button", {
				name: /^(開|閉)じる インポスター$/,
			});
		if ((await imposterCategory.getAttribute("aria-expanded")) === "false") {
			await imposterCategory.click();
		}

		// テキストとタイトルの組み合わせで特定 (右パネル内)
		const impCountSetting = page
			.getByLabel("右フローティングパネル")
			.getByTitle("ダブルクリックで設定場所へ移動")
			.filter({ hasText: "インポスター数" });
		// スクロールが必要な場合がある
		await impCountSetting.scrollIntoViewIfNeeded();
		await expect(impCountSetting).toBeVisible({ timeout: 15000 });

		// 値が表示されていることを確認（モックデータでは1のはず）
		await expect(impCountSetting).toContainText("1");

		// 4. メインエディタで一旦 ExR Options に切り替えておく
		// 右パネルのオーバーレイが邪魔をする可能性があるので、一旦右パネルを閉じる
		await page.getByRole("button", { name: "閉じる", exact: true }).click();
		await page.getByRole("button", { name: "ExR Options" }).click();
		await expect(
			page.getByRole("heading", { name: "ExR Options" }),
		).toBeVisible();

		// 5. 右パネルの項目をダブルクリック
		// 再び開く
		await page.getByRole("button", { name: "パネルを開く" }).click();
		await impCountSetting.scrollIntoViewIfNeeded();
		await impCountSetting.dblclick({ force: true });

		// 6. 自動的に Au Options に戻り、項目が表示されていることを確認
		await expect(page.getByRole("heading", { name: "Au Options" })).toBeVisible(
			{ timeout: 10000 },
		);

		// ハイライト用のクラスやスタイルが適用されているか確認
		// テキストで特定し、その親の HighlightWrapper を探す
		const impCountRow = page
			.locator("main")
			.locator("div")
			.filter({ hasText: "インポスター数" })
			.locator("xpath=ancestor::div[contains(@class, 'transition-all')]")
			.first();
		await expect(impCountRow).toHaveClass(/ring-2/);
		await expect(impCountRow).toHaveClass(/ring-blue-500/);

		// 7. 数秒後にハイライトが消えることを確認
		await expect(impCountRow).not.toHaveClass(/ring-2/, { timeout: 15000 });
	});
});
