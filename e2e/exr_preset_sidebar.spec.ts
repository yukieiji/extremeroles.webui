import { expect, test } from "@playwright/test";
import { getLeftSidebarButton, getLeftSideber, prepare } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);
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
	const exrSettingsTitle = rightPanel.getByText("Extreme Roles");
	await exrSettingsTitle.scrollIntoViewIfNeeded();

	// プリセット名が表示されていることを確認。モックデータでは初期値 "1"
	// Summaryに移動したので、名前が変わっている
	// 翻訳データに基づいているため、正規表現で柔軟にマッチング
	const presetRow = page
		.getByTestId("right-panel-summary")
		.getByRole("button", { name: /プリセット|Preset/ });
	await expect(presetRow).toBeVisible();

	// 3. ダブルクリックでナビゲーションを確認
	await presetRow.dblclick();

	// 4. パネルが開いているか
	await expect(rightPanel).toBeVisible();

	// ExR タブが選択されていることを確認
	const exrTabButton = getLeftSidebarButton(page, "Extreme Roles");
	await expect(exrTabButton).toHaveAttribute("data-active", "");

	// プリセットセレクターがハイライトされていることを確認
	// HighlightWrapper は data-testid は持っていないが、ID を付与している
	// ID は `exr-option-${PRESET_OPTION_UNIQUE_ID}`
	// PRESET_OPTION_UNIQUE_ID は getUniqueOptionId(0, 0, 0) で 0
	const highlightedElement = page.locator("#exr-option-0");

	// ハイライトクラス (ring-2 ring-search-highlight など) が適用されているか確認
	await expect(highlightedElement).toHaveClass(/ring-2/);
});

test("Updating preset name reflects in right sidebar", async ({ page }) => {
	// 1. ExR タブに切り替え
	const sidebar = getLeftSideber(page);
	await sidebar.getByRole("button", { name: "Extreme Roles" }).click();

	// 2. プリセット名を変更
	const presetInput = page.getByPlaceholder("プリセット名を入力...");
	await presetInput.fill("New Custom Preset");
	await presetInput.press("Enter");

	// 3. 右パネルを開いて確認
	const openButton = page.getByTestId("right-panel-toggle");
	await openButton.click();

	const exrSettingsTitle = page
		.getByTestId("right-side-panel")
		.getByText("Extreme Roles");
	await exrSettingsTitle.scrollIntoViewIfNeeded();

	// 変更後の名前が表示されていることを確認
	// 翻訳データに基づいているため、正規表現で柔軟にマッチング
	const presetRow = page
		.getByTestId("right-panel-summary")
		.getByRole("button", {
			name: /(プリセット|Preset) New Custom Preset/,
		});
	await expect(presetRow).toBeVisible();
});
