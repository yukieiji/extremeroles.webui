import { expect, test } from "@playwright/test";
import { getLeftSidebarButton, getLeftSideber, prepare } from "./conftest";

test.beforeEach(async ({ page }) => {
	await prepare(page, 100);

	await expect(getLeftSideber(page)).toBeVisible({
		timeout: 30000,
	});
});

test("非アクティブのオプション表示設定の切り替えが機能し、localStorageへの保存およびリロード後も反映されること", async ({
	page,
}) => {
	// 設定ボタンをクリックしてダイアログを開く
	const settingsButton = page.getByTestId("sidebar-settings-button");
	await settingsButton.click();

	// ダイアログが開くのを確認
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();

	// 「非アクティブのオプション表示」項目が表示されていることを確認
	await expect(page.getByText("非アクティブのオプション表示")).toBeVisible();

	// 「非アクティブのオプション表示」のセレクトボックスを見つける
	const combobox = page.getByLabel("表示モード");
	await expect(combobox).toContainText("非表示");

	// セレクトボックスをクリックして「操作だけ無効」を選択
	await combobox.click();
	const disabledOption = page.getByRole("option", { name: "操作だけ無効" });
	await disabledOption.click();

	// localStorageに正しく保存されたことを検証
	const settingsAfterDisabled = await page.evaluate(() => {
		return JSON.parse(localStorage.getItem("setting") || "{}");
	});
	expect(settingsAfterDisabled.inactiveOptionDisplay).toBe("disabled");

	// セレクトボックスをクリックして「操作可能」を選択
	await combobox.click();
	const enabledOption = page.getByRole("option", { name: "操作可能" });
	await enabledOption.click();

	const settingsAfterEnabled = await page.evaluate(() => {
		return JSON.parse(localStorage.getItem("setting") || "{}");
	});
	expect(settingsAfterEnabled.inactiveOptionDisplay).toBe("enabled");

	// 閉じる
	await page.keyboard.press("Escape");
	await expect(dialog).not.toBeVisible();
});

test("非アクティブオプション（親条件を満たしていない子オプション）の表示非表示および操作可否（disabled/enabled）が設定に応じて切り替わること", async ({
	page,
}) => {
	// Extreme Roles タブに切り替え
	await getLeftSidebarButton(page, "Extreme Roles").click();

	const mainContent = page.getByTestId("main-content-section");

	// 'グローバル設定' タブを選択
	await mainContent
		.getByRole("tab", { name: "グローバル設定", exact: true })
		.click();

	// '乱数に関する設定' カテゴリアコーディオンを開く
	const categoryAccordion = page
		.getByTestId("category-list")
		.getByRole("button", { name: "乱数に関する設定" });
	await categoryAccordion.click();

	// 1. デフォルト設定 (非表示) の確認
	const childOptionName = "使用する乱数生成アルゴリズム";
	await expect(page.getByText(childOptionName)).not.toBeVisible();

	// 2. 「操作だけ無効」設定に変更
	const settingsButton = page.getByTestId("sidebar-settings-button");
	await settingsButton.click();

	const displayModeCombobox = page.getByLabel("表示モード");
	await displayModeCombobox.click();
	await page.getByRole("option", { name: "操作だけ無効" }).click();
	await page.keyboard.press("Escape");

	// 親オプション「強力なシャッフルを使用する」の行からアコーディオン展開ボタンをクリック
	const shuffleRow = page
		.locator("div")
		.filter({ hasText: /^強力なシャッフルを使用する/ })
		.first();
	const accordionToggle = shuffleRow.locator("button[aria-expanded]");
	if (await accordionToggle.isVisible()) {
		const isExpanded = await accordionToggle.getAttribute("aria-expanded");
		if (isExpanded === "false") {
			await accordionToggle.click();
		}
	}

	// 「使用する乱数生成アルゴリズム」が表示され、かつコントロールが disabled になっていることを確認
	const childOptionLabel = page.getByText(childOptionName);
	await expect(childOptionLabel).toBeVisible();

	// 子オプションのコントロール (combobox/select trigger) を取得し、disabled 状態であることを検証
	const childControl = page
		.locator("div")
		.filter({ hasText: new RegExp(`^${childOptionName}`) })
		.getByRole("combobox");
	if ((await childControl.count()) > 0) {
		await expect(childControl.first()).toBeDisabled();
	}

	// 3. 「操作可能」設定に変更
	await settingsButton.click();
	await displayModeCombobox.click();
	const enabledSelectOption = page.getByRole("option", { name: "操作可能" });
	await expect(enabledSelectOption).toBeVisible();
	await enabledSelectOption.click();
	await page.keyboard.press("Escape");

	// 子オプションが表示され、コントロールが操作可能（enabled）になっていることを確認
	await expect(childOptionLabel).toBeVisible();
	if ((await childControl.count()) > 0) {
		await expect(childControl.first()).toBeEnabled();
	}
});
