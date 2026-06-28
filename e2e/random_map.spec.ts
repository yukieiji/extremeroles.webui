import { expect, test } from "@playwright/test";
import { getSidebarButton } from "./conftest";

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
		const summary = page.getByTestId("right-panel-summary");
		if (!(await summary.isVisible())) {
			await page.getByTestId("right-panel-toggle").click();
		}
		// パネルが開くのを待つ
		await expect(summary).toBeVisible();

		// 2. 初期状態の確認（マップのサマリーが表示されていること）
		// モックの初期値は map: 4
		const mapSummary = page
			.locator('[data-testid="right-panel-summary"]')
			.getByText(/^(map|マップ)$/);
		await expect(mapSummary).toBeVisible();

		// 右パネル内の "ExRの設定" アコーディオンを開く
		const rightPanel = page.getByTestId("right-side-panel");
		const exrSettingsAccordion = rightPanel.getByRole("button", {
			name: "Extreme Roles",
		});
		if (
			(await exrSettingsAccordion.getAttribute("aria-expanded")) === "false"
		) {
			await exrSettingsAccordion.click();
		}

		// 3. Extreme Roles で「毎回マップがランダムに変わるか」をオンにする（サイドバー内のボタンに限定）
		// Extreme Roles Menuに切り替え（サイドバー内のボタンに限定）
		await getSidebarButton(page, "Extreme Roles").click();

		// カテゴリ「ランダムマップに関する設定」を探して開く
		const categoryHeader = page.getByText("ランダムマップに関する設定", {
			exact: true,
		});
		await categoryHeader.scrollIntoViewIfNeeded();
		await categoryHeader.click();

		// トグルをオンにする
		const optionLabel = page.getByText("毎回マップがランダムに変わるか", {
			exact: true,
		});
		await optionLabel.scrollIntoViewIfNeeded();
		const optionRow = page
			.locator("div")
			.filter({ has: optionLabel })
			.filter({ has: page.getByTestId("option-toggle") })
			.last();
		const toggleSwitch = optionRow.getByTestId("option-toggle");

		// 初期状態がオンのはずなので、一旦オフにしてからオンにする（確実に状態を変化させるため）
		// または、単にオンであることを確認する
		await expect(optionRow.getByText("オン", { exact: true })).toBeVisible();

		// 4. 右パネルのサマリー表示が「ランダム」に変わったことを確認
		await expect(summary.getByText("ランダム")).toBeVisible();

		// 5. 右パネルの ExR 設定リストから「ランダムマップに関する設定」が消えていることを確認
		// 右パネルのスクロール可能なコンテナを取得して、一番下までスクロールさせる
		const scrollContainer = rightPanel.locator(".overflow-y-scroll");
		await scrollContainer.evaluate((node) => {
			node.scrollTop = node.scrollHeight;
		});

		await expect(
			rightPanel.getByText("ランダムマップに関する設定"),
		).not.toBeVisible();

		// 6. 設定をオフにする
		await toggleSwitch.click();
		await expect(
			optionRow.getByText("オン", { exact: true }),
		).not.toBeVisible();

		// 7. 右パネルの ExR 設定リストに「ランダムマップに関する設定」が再び表示されていることを確認
		// 右パネルを上にスクロールさせて再表示を確認する
		await scrollContainer.evaluate((node) => {
			node.scrollTop = 0;
		});

		const randomMapSettingInRightPanel = page.getByText(
			"ランダムマップに関する設定",
		);
		await expect(randomMapSettingInRightPanel.first()).toBeVisible();
		await randomMapSettingInRightPanel.first().scrollIntoViewIfNeeded();
	});
});
