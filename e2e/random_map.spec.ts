import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.request.post("/mock/reset", { maxRetries: 5 });
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 0;
	});
	await page.goto("/");
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});
});

test.describe("Random Map Display and Hiding", () => {
	test("should display 'ランダム' in summary and hide from ExR list in right panel", async ({
		page,
	}) => {
		// 1. 右サイドパネルを開く
		const toggleButton = page.getByRole("button", { name: "パネルを開く" });
		if (await toggleButton.isVisible()) {
			await toggleButton.click();
		}
		await expect(page.getByTestId("right-panel-summary")).toBeVisible();

		// 2. 初期状態の確認（マップのサマリーが表示されていること）
		// モックの初期値は map: 4
		// 実際には AuOptionSummaryRow は fallbackTitle="マップ" を使っているので "マップ" または "map"
		const mapSummary = page
			.locator('[data-testid="right-panel-summary"]')
			.getByText(/^(map|マップ)$/);
		await expect(mapSummary).toBeVisible();

		// 3. ExR Options で「毎回マップがランダムに変わるか」をオンにする
		await page.getByRole("button", { name: "ExR Options" }).click();

		// カテゴリ「ランダムマップに関する設定」を探して開く
		const categoryHeader = page.getByText("ランダムマップに関する設定");
		await categoryHeader.scrollIntoViewIfNeeded();
		await categoryHeader.click();

		// トグルをオンにする
		const optionLabel = page.getByText("毎回マップがランダムに変わるか", {
			exact: true,
		});
		const optionRow = page
			.locator("div")
			.filter({ has: optionLabel })
			.filter({ has: page.getByTestId("option-toggle") })
			.last();
		const toggleSwitch = optionRow.getByTestId("option-toggle");
		await expect(optionRow.getByText("オフ", { exact: true })).toBeVisible();
		await toggleSwitch.click();
		await expect(optionRow.getByText("オン", { exact: true })).toBeVisible();

		// 4. 右パネルのサマリー表示が「ランダム」に変わったことを確認
		const summary = page.getByTestId("right-panel-summary");
		await expect(summary.getByText("ランダム")).toBeVisible();

		// 5. 右パネルの ExR 設定リストから「ランダムマップに関する設定」が消えていることを確認
		// 右パネル内の "ExRの設定" アコーディオンの中身を確認
		const rightPanel = page.getByTestId("right-side-panel");
		const exrSettingsInRightPanel = rightPanel
			.locator("div")
			.filter({ hasText: "ExRの設定" })
			.locator("..");
		await expect(
			exrSettingsInRightPanel.getByText("ランダムマップに関する設定"),
		).not.toBeVisible();
	});
});
