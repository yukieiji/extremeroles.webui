import { expect, test } from "@playwright/test";
import { accessMainPage, getLeftSidebarButton } from "./conftest";

test.describe("Search Normalization", () => {
	test.beforeEach(async ({ page }) => {
		await accessMainPage(page);
	});

	test("オプション検索でひらがな・カタカナ、全角・半角を区別せずに検索できること", async ({
		page,
	}) => {
		const searchInput = page.getByPlaceholder("オプションを検索...");
		await searchInput.focus();

		// カタカナの「インポスター」をひらがな「いんぽすたー」で検索
		await searchInput.fill("いんぽすたー");
		await expect(page.getByRole("dialog")).toBeVisible();
		await expect(
			page.getByText("インポスター", { exact: false }).first(),
		).toBeVisible();

		// 全角「インポスター」を半角「ｲﾝﾎﾟｽﾀｰ」で検索
		await searchInput.clear();
		await searchInput.fill("ｲﾝﾎﾟｽﾀｰ");
		await expect(
			page.getByText("インポスター", { exact: false }).first(),
		).toBeVisible();

		// 英数字の全角・半角区別なし (会議 => 議 => ｷﾞ => ぎ)
		await searchInput.clear();
		await searchInput.fill("かいぎ");
		await expect(
			page.getByText("会議", { exact: false }).first(),
		).toBeVisible();
	});

	test("役職選択ダイアログでひらがな・カタカナを区別せずに検索できること", async ({
		page,
	}) => {
		// ロールフィルタータブへ移動
		await getLeftSidebarButton(page, "役職フィルター").click();

		// 新規作成ボタン
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		await expect(page.getByText("フィルター追加: 役職の選択")).toBeVisible();

		const searchInput = page.getByPlaceholder("役職を検索...");

		// 「パン屋」を「ぱんや」で検索
		await searchInput.fill("ぱんや");
		await expect(
			page.getByText("パン屋", { exact: true }).first(),
		).toBeVisible();

		// 「オープナー」を「おーぷなー」で検索
		await searchInput.clear();
		await searchInput.fill("おーぷなー");
		await expect(
			page.getByText("オープナー", { exact: true }).first(),
		).toBeVisible();

		// 半角カタカナ「ｵｰﾌﾟﾅｰ」で検索
		await searchInput.clear();
		await searchInput.fill("ｵｰﾌﾟﾅｰ");
		await expect(
			page.getByText("オープナー", { exact: true }).first(),
		).toBeVisible();
	});
});
