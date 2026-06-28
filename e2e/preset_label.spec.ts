import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// モックサーバーの状態をリセット
	await page.request.post("/mock/reset", { maxRetries: 5 });
	// タイムアウトを延長
	test.setTimeout(60000);

	await page.goto("/");

	// ローディング画面が消えるのを待つ
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 45000,
	});
});

test("PresetOption label is displayed above the preset selector", async ({
	page,
}) => {
	const sidebar = page.locator('[data-slot="sidebar"]');
	const exrButton = sidebar.getByRole("button", { name: "Extreme Roles" });
	await exrButton.click();

	// プリセットオプションラベルが表示されていることを確認
	const label = page.getByText("PresetOption");
	await expect(label).toBeVisible({ timeout: 15000 });

	// スタイリングの確認 (Typography.SMALL -> text-xs font-normal, text-text-primary)
	// getComputedStyle を使って実際のスタイルを確認することも可能ですが、
	// ここではクラスの存在を確認することにします
	const labelClasses = await label.evaluate((el) => el.className);
	expect(labelClasses).toContain("text-xs");
	expect(labelClasses).toContain("font-normal");
	expect(labelClasses).toContain("text-text-primary");

	// ラベルがセレクターの上に配置されていることを確認（大まかな位置関係）
	const presetInput = page.getByPlaceholder("プリセット名を入力...");
	const labelBox = await label.boundingBox();
	const inputBox = await presetInput.boundingBox();

	if (labelBox && inputBox) {
		expect(labelBox.y).toBeLessThan(inputBox.y);
	} else {
		throw new Error("Could not get bounding box for label or input");
	}
});
