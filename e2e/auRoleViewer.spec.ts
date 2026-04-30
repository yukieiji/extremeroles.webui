import { expect, test } from "@playwright/test";

test.describe("Au Role Viewer in Right Panel", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		// ローディング画面が消えるのを待つ
		await expect(page.getByText("Loading data...")).not.toBeVisible({
			timeout: 30000,
		});
	});

	test("displays active roles from Tab 1 and 2 and navigates on double-click", async ({
		page,
	}) => {
		// 1. 右パネルを開く
		const rightPanelToggle = page.getByRole("button", { name: "パネルを開く" });
		await rightPanelToggle.click();
		const rightPanel = page.getByLabel("右フローティングパネル");
		await expect(rightPanel).toBeVisible();

		// 2. 「インポスター役職」セクションが表示されていることを確認
		// モックデータでは「シェイプシフター」が有効なはず
		// 日本語環境なので「開く」または「閉じる」を使用
		const imposterRolesSection = rightPanel.getByRole("button", {
			name: /^(開|閉)じる インポスター役職$/,
		});
		await expect(imposterRolesSection).toBeVisible();

		// 3. 役職の内容を確認
		// aria-label ではなく、テキストとタイトルの組み合わせで特定する (右パネル内)
		const roleRow = rightPanel.getByTitle("ダブルクリックで設定場所へ移動").filter({ hasText: "シェイプシフター" });
		await expect(roleRow).toBeVisible();
		await expect(roleRow).toContainText("シェイプシフター");
		// 50% / 15 のような表示形式
		await expect(roleRow).toContainText("50%");
		await expect(roleRow).toContainText("15");

		// 4. ダブルクリックしてメインビューのタブが切り替わるか確認
		// 現在は Au Tab 0 が選択されているはず
		await expect(
			page.getByRole("heading", { name: "Au Options" }),
		).toBeVisible();

		await roleRow.dblclick();

		// 5. 自動的に該当タブ（インポスター役職は Tab 2）に切り替わり、ハイライトされるか確認
		// メインエディター内の「シェイプシフター」を確認 (getByRole('button', ...) でアコーディオンを探す)
		const mainEditor = page.locator("main");
		await expect(
			mainEditor.getByRole("button", { name: /シェイプシフター/ }),
		).toBeVisible();

		// ハイライトの確認
		// 役職名を含むアコーディオンコンテナを探し、その親の HighlightWrapper を特定する
		const targetCategory = mainEditor
			.getByTestId("role-category")
			.filter({ hasText: "シェイプシフター" })
			.locator("xpath=ancestor::div[contains(@class, 'transition-all')]")
			.first();
		await expect(targetCategory).toBeVisible({ timeout: 10000 });
		await expect(targetCategory).toHaveClass(/ring-2/);
	});

	test("toggles role sections in the right panel", async ({ page }) => {
		await page.getByRole("button", { name: "パネルを開く" }).click();

		const rightPanel = page.getByLabel("右フローティングパネル");
		const imposterRolesSection = rightPanel.getByRole("button", {
			name: /^(開|閉)じる インポスター役職$/,
		});

		// 最初は開いている（初期値 true）
		await expect(imposterRolesSection).toHaveAttribute("aria-expanded", "true");

		// クリックして閉じる
		await imposterRolesSection.click();

		// ラベルが「開く インポスター役職」に変わることを確認
		const collapsedSection = rightPanel.getByRole("button", {
			name: "開く インポスター役職",
		});
		await expect(collapsedSection).toBeVisible();
		await expect(collapsedSection).toHaveAttribute(
			"aria-expanded",
			"false",
		);

		// 役職リストが見えなくなったことを確認
		await expect(rightPanel.getByText("シェイプシフター")).not.toBeVisible();
	});

	test("does not display inactive roles in the right panel", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "パネルを開く" }).click();
		const rightPanel = page.getByLabel("右フローティングパネル");

		// モックデータで無効な役職（例: スポーンレート0%）が表示されていないことを確認
		// 注意: モックデータの全ての役職名を把握している必要があるが、
		// ここでは「クルー役職」セクション自体が存在しない（有効な役職がないため）ことを確認する
		await expect(rightPanel.getByText("クルー役職")).not.toBeVisible();
	});
});
