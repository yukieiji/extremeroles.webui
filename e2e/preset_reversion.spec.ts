import { expect, test } from "@playwright/test";
import { getLeftSidebarButton, getLeftSideber, prepare } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);
	test.setTimeout(60000);
});

test("Preset name reversion to default when cleared", async ({ page }) => {
	const sidebar = getLeftSideber(page);
	await expect(sidebar).toBeVisible({ timeout: 30000 });

	const exrButton = getLeftSidebarButton(page, "Extreme Roles");
	await expect(exrButton).toBeVisible({ timeout: 30000 });
	await exrButton.click();

	// ヘッダーのプリセットセレクターを確認
	const presetInput = page.getByPlaceholder("プリセット名を入力...");
	await expect(presetInput).toBeVisible({ timeout: 15000 });
	const curValue = await presetInput.inputValue();

	// 1. プリセットにカスタム名を付ける
	await presetInput.fill("Custom Preset");
	await presetInput.press("Enter");
	await expect(presetInput).toHaveValue("Custom Preset");

	// 2. 入力欄を空にして確定（Enter）すると初期名に戻るか確認
	await presetInput.fill("");
	await presetInput.press("Enter");
	// 初期値はcurValue(index 0) なのでcurValueに戻るはず
	await expect(presetInput).toHaveValue(curValue);

	// 3. 再度カスタム名を付けて、今度は onBlur で戻るか確認
	await presetInput.fill("Another Name");
	await presetInput.press("Enter");
	await expect(presetInput).toHaveValue("Another Name");

	await presetInput.fill("   "); // スペースのみ
	await presetInput.blur();
	await expect(presetInput).toHaveValue(curValue);

	// 4. ページリロード後も初期名（カスタム名なし）が維持されているか確認
	await page.goto("/");
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 45000,
	});
	await expect(sidebar).toBeVisible({ timeout: 30000 });
	await exrButton.click();
	await expect(presetInput).toHaveValue(curValue);
});
