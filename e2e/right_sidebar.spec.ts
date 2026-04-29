import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	// ローディング画面が消えるのを待つ
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});
});

test("right sidebar can be opened and accordions can be toggled", async ({
	page,
}) => {
	const rightPanel = page.getByLabel("右フローティングパネル");
	const toggleButton = page.getByRole("button", { name: "パネルを開く" });

	// 初期状態では閉じている
	await expect(rightPanel).not.toBeVisible();

	// パネルを開く
	await toggleButton.click();
	await expect(rightPanel).toBeVisible();

	// 設定値アコーディオンが表示され、開いていることを確認
	const settingsAccordion = page.getByRole("button", { name: "設定値" });
	await expect(settingsAccordion).toBeVisible();
	await expect(settingsAccordion).toHaveAttribute("aria-expanded", "true");

	// AmongUsの設定とExRの設定が表示されている
	const auSettings = page.getByRole("button", { name: "AmongUsの設定" });
	const exrSettings = page.getByRole("button", { name: "ExRの設定" });
	await expect(auSettings).toBeVisible();
	await expect(exrSettings).toBeVisible();
	await expect(auSettings).toHaveAttribute("aria-expanded", "true");
	await expect(exrSettings).toHaveAttribute("aria-expanded", "true");

	// AmongUsの設定を閉じる
	await auSettings.click();
	await expect(auSettings).toHaveAttribute("aria-expanded", "false");

	// ExRの設定を閉じる
	await exrSettings.click();
	await expect(exrSettings).toHaveAttribute("aria-expanded", "false");

	// 設定値アコーディオンを閉じる
	await settingsAccordion.click();
	await expect(settingsAccordion).toHaveAttribute("aria-expanded", "false");
	await expect(auSettings).not.toBeVisible();

	// Escapeキーでパネルを閉じる
	await page.keyboard.press("Escape");
	// 完全に隠れるのを待つ
	await expect(rightPanel).toHaveClass(/translate-x-full/);
});
