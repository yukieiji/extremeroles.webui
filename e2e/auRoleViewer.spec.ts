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
		// アイコンのSVG化によるアクセシブルネームの変化を考慮し、部分一致で検索
		const imposterRolesSection = rightPanel.getByRole("button", {
			name: /インポスター役職/,
		});
		await expect(imposterRolesSection).toBeVisible({ timeout: 10000 });

		// 3. 役職の内容を確認
		// aria-label ではなく、テキストとタイトルの組み合わせで特定する (右パネル内)
		const roleRow = rightPanel
			.getByTitle("ダブルクリックで設定場所へ移動")
			.filter({ hasText: "シェイプシフター" });
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
		// ハイライト状態（ring-2クラスを持つ）かつ、役職名を含む要素を特定する
		const highlightedRow = mainEditor
			.locator("div.ring-2")
			.filter({ hasText: "シェイプシフター" })
			.first();
		await expect(highlightedRow).toBeVisible({ timeout: 10000 });
	});

	test("toggles role sections in the right panel", async ({ page }) => {
		await page.getByRole("button", { name: "パネルを開く" }).click();

		const rightPanel = page.getByLabel("右フローティングパネル");
		const imposterRolesSection = rightPanel.getByRole("button", {
			name: /インポスター役職/,
		});

		// 最初は開いている（初期値 true）
		// 要素が表示されるまで待機してから属性を確認
		await expect(imposterRolesSection).toBeVisible({ timeout: 10000 });
		await expect(imposterRolesSection).toHaveAttribute("aria-expanded", "true");

		// クリックして閉じる
		await imposterRolesSection.click();

		// 属性が false に変わることを確認
		await expect(imposterRolesSection).toHaveAttribute("aria-expanded", "false", { timeout: 10000 });

		// 役職リストが見えなくなったことを確認
		await expect(rightPanel.getByText("シェイプシフター")).not.toBeVisible();
	});

	test("does not display inactive roles in the right panel", async ({
		page,
	}) => {
		// Au Options の 役職タブ（タブ 1）に移動
		await page.getByRole("button", { name: "1", exact: true }).first().click();

		// 科学者 (Scientist)を無効にしてチェック
		const category = page
			.getByTestId("role-category")
			.filter({ hasText: "科学者" });
		const chanceSlider = category
			.getByTestId("spawn-rate-control")
			.locator('input[type="range"]');
		const countSlider = category
			.getByTestId("spawn-count-control")
			.locator('input[type="range"]');

		await page.getByRole("button", { name: "パネルを開く" }).click();
		const rightPanel = page.getByLabel("右フローティングパネル");

		await chanceSlider.fill("0");
		await countSlider.fill("0");

		// モックデータで無効な役職（例: スポーンレート0%）が表示されていないことを確認
		await expect(rightPanel.getByText("科学者")).not.toBeVisible();
	});
});
