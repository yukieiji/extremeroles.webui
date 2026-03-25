import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// すべてのテストで API の遅延を設定可能にする
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 100;
	});

	await page.goto("/");

	// メインコンテンツが表示されるまで待つ (Suspenseの解決を待つ)
	await expect(page.getByTestId("main-content-section")).toBeVisible({
		timeout: 30000,
	});
});

test("ExR option update flow", async ({ page }) => {
	const sidebar = page.getByLabel("オプションサイドバー");
	await sidebar.getByRole("button", { name: "ExR Options" }).click();

	// カテゴリを展開
	const shuffleCategory = page.getByRole("button", {
		name: "乱数に関する設定",
	});
	await shuffleCategory.click();

	const toggle = page.getByTestId("option-toggle").first();

	// 初期状態を確認
	await expect(toggle).toHaveAttribute("aria-checked", "false");

	// PUTリクエストを監視
	const putRequestPromise = page.waitForRequest(
		(request) =>
			request.url().includes("/exr/option/") && request.method() === "PUT",
	);

	// トグルを切り替え
	await toggle.click();

	// リクエストが送信されたことを確認
	const request = await putRequestPromise;
	const body = JSON.parse(request.postData() || "{}");
	expect(body.Selection).toBe(1);

	// UIが更新されることを確認 (オンに切り替わる)
	await expect(toggle).toHaveAttribute("aria-checked", "true");
	await expect(page.getByText("オン", { exact: true })).toBeVisible();
});

test("ExR slider update with debouncing", async ({ page }) => {
	const sidebar = page.getByLabel("オプションサイドバー");
	await sidebar.getByRole("button", { name: "ExR Options" }).click();

	// インポスター役職設定タブに切り替え
	await page
		.getByRole("button", { name: "インポスター役職設定", exact: true })
		.click();

	// カテゴリ内のスライダーコントロールを探す
	// 役職スポーンコントロールはヘッダーにある
	const spawnCountFieldset = page.getByTestId("spawn-count-control").first();
	const slider = spawnCountFieldset.locator("input[type='range']");
	const input = spawnCountFieldset.locator("input[type='text']");

	// PUTリクエストを監視
	const sliderPutRequestPromise = page.waitForRequest(
		(request) =>
			request.url().includes("/exr/option/") && request.method() === "PUT",
	);

	// スライダーを操作
	await slider.fill("5");

	// リクエストが送信されるのを待つ (デバウンス後)
	await sliderPutRequestPromise;

	// 値が反映されていることを確認
	await expect(input).toHaveValue("5");
});
