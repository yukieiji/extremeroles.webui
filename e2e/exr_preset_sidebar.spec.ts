import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// モックサーバーの状態をリセット
	await page.request.post("/mock/reset", { maxRetries: 5 });
	// すべてのテストで API の遅延を設定可能にする
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 100;
	});

	await page.goto("/");

	// ローディング画面が消えるのを待つ
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});
});

test("ExR preset display in right sidebar and navigation", async ({ page }) => {
	// 1. 右パネルを開く
	const openButton = page.getByTestId("right-panel-toggle");
	await openButton.click();

	// 右パネルが表示されていることを確認
	const rightPanel = page.getByTestId("right-side-panel");
	await expect(rightPanel).toBeVisible({ timeout: 15000 });
	// アニメーション待ち
	await expect
		.poll(async () => {
			const box = await rightPanel.boundingBox();
			return box?.width;
		})
		.toBeGreaterThan(30);

	// 2. ExRの設定セクションを確認 (初期状態では開いている想定だが、必要ならスクロールして開く)
	const exrSettingsTitle = page.getByText("ExRの設定");
	await exrSettingsTitle.scrollIntoViewIfNeeded();

	// プリセット名が表示されていることを確認。モックデータでは初期値 "1"
	// ViewerOptionRow はボタンとして実装されている
	const presetRow = page.getByRole("button", { name: "使用するプリセット" });
	await expect(presetRow).toBeVisible();

	// 3. ダブルクリックでナビゲーションを確認
	await presetRow.dblclick();

	// 4. パネルが閉じているか確認 (幅が0pxに戻っているか)
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box ? box.width : -1;
			},
			{ timeout: 15000 },
		)
		.toBeLessThan(5);

	// ExR タブが選択されていることを確認
	const exrTabButton = page.getByRole("button", { name: "ExR Options" });
	await expect(exrTabButton).toHaveAttribute("data-active", "");

	// プリセットセレクターがハイライトされていることを確認
	// HighlightWrapper は data-testid は持っていないが、ID を付与している
	// ID は `exr-option-${PRESET_OPTION_UNIQUE_ID}`
	// PRESET_OPTION_UNIQUE_ID は getUniqueOptionId(0, 0, 0) で 0
	const highlightedElement = page.locator("#exr-option-0");

	// ハイライトクラス (ring-2 ring-blue-500 など) が適用されているか確認
	await expect(highlightedElement).toHaveClass(/ring-2/);
});

test("Updating preset name reflects in right sidebar", async ({ page }) => {
	const _rightPanel = page.getByTestId("right-side-panel");
	// 1. ExR タブに切り替え
	const sidebar = page.getByLabel("オプションサイドバー");
	await sidebar.getByRole("button", { name: "ExR Options" }).click();

	// 2. プリセット名を変更
	const presetInput = page.getByPlaceholder("プリセット名を入力...");
	await presetInput.fill("New Custom Preset");
	await presetInput.press("Enter");

	// 3. 右パネルを開いて確認
	const openButton = page.getByTestId("right-panel-toggle");
	await openButton.click();

	const exrSettingsTitle = page.getByText("ExRの設定");
	await exrSettingsTitle.scrollIntoViewIfNeeded();

	// 変更後の名前が表示されていることを確認
	const presetRow = page.getByRole("button", {
		name: "使用するプリセット New Custom Preset",
	});
	await expect(presetRow).toBeVisible();
});
