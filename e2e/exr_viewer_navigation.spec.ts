import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.request.post("/mock/reset", { maxRetries: 5 });
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 100;
	});
	await page.goto("/");
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});
});

test("ExR viewer in right panel can navigate to settings in main editor", async ({
	page,
}) => {
	const rightPanel = page.getByLabel("右フローティングパネル");
	const toggleButton = page.getByRole("button", { name: "パネルを開く" });

	// 1. 右パネルを開く
	await toggleButton.click();
	await expect(rightPanel).toBeVisible();

	// 2. "ExRの設定" アコーディオンを展開（デフォルトで開いているはずだが念のため）
	const exrSettingsAccordion = rightPanel.getByRole("button", {
		name: "ExRの設定",
	});
	if ((await exrSettingsAccordion.getAttribute("aria-expanded")) === "false") {
		await exrSettingsAccordion.click();
	}

	// 3. 一般タブのオプションを探す（Mockデータ: "強力なシャッフルを使用する"）
	// 右パネル内のオプション行を探す。data-testid が付与されている。
	const viewerOption = rightPanel
		.locator("[data-testid^='right-panel-exr-option-']")
		.first();
	const testId = await viewerOption.getAttribute("data-testid");
	const uniqueOptionId = testId?.replace("right-panel-exr-option-", "");
	const optionTitle = await viewerOption
		.locator("span.truncate")
		.first()
		.innerText();

	// 4. ダブルクリックしてナビゲーションを実行
	// force: true を指定して、アニメーション中やオーバーレイがあっても実行できるようにする
	await viewerOption.dblclick({ force: true });

	// 5. 右パネルが自動で閉じることを確認
	await expect(rightPanel).toHaveClass(/translate-x-full/);

	// 6. メインエディターが ExR タブに切り替わっていることを確認
	await expect(
		page.getByRole("heading", { name: "ExR Options" }),
	).toBeVisible();

	// 7. メインエディター内で該当のオプションがハイライトされていることを確認
	const highlightedOption = page.locator(`#exr-option-${uniqueOptionId}`);
	await expect(highlightedOption).toBeVisible();
	await expect(highlightedOption).toHaveClass(/ring-2/);
	await expect(highlightedOption).toHaveClass(/ring-blue-500/);
	await expect(highlightedOption).toContainText(optionTitle);

	// 8. 数秒後にハイライトが消えることを確認
	await expect(highlightedOption).not.toHaveClass(/ring-2/, { timeout: 5000 });
});
