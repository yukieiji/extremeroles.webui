import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	// ローディング画面が消えるのを待つ
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 60000,
	});
});

test("right sidebar can be opened and accordions can be toggled", async ({
	page,
}) => {
	const rightPanel = page.locator('[data-testid="right-side-panel"]');
	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');

	// 初期状態では閉じている（幅が24px）
	await expect(rightPanel).toBeVisible({ timeout: 20000 });
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box?.width;
			},
			{ timeout: 15000 },
		)
		.toBeCloseTo(24, 0);

	// パネルを開く
	await toggleButton.click();

	// トグルボタン自体は常に表示されているため、パネルの中身が表示されるのを待つ
	await expect(page.getByText("Right Panel")).toBeVisible({ timeout: 15000 });

	// アニメーション完了を待つ (24px より大きくなっているはず)
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box?.width;
			},
			{ timeout: 10000 },
		)
		.toBeGreaterThan(30);

	// 設定値アコーディオンが表示され、開いていることを確認
	const settingsAccordion = page.getByRole("button", { name: "設定値" });
	await expect(settingsAccordion).toBeVisible();

	// AmongUsの設定とExRの設定が表示されている
	const auSettings = page.getByRole("button", { name: "AmongUsの設定" });
	const exrSettings = page.getByRole("button", { name: "ExRの設定" });
	await expect(auSettings).toBeVisible();
	await expect(exrSettings).toBeVisible();

	// AmongUsの設定を閉じる
	await auSettings.click();
	await expect(auSettings).toHaveAttribute("aria-expanded", "false");

	// パネルを閉じる (トグルボタンを再度クリック)
	await toggleButton.click();
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box?.width;
			},
			{ timeout: 15000 },
		)
		.toBeCloseTo(24, 0);
});
