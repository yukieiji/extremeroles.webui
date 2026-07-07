import { expect, test } from "@playwright/test";

test.describe("Mock Player Names Settings", () => {
	test("can add and delete mock player names in settings dialog", async ({
		page,
	}) => {
		await page.goto("/");

		// 設定ダイアログを開く
		await page.getByTestId("sidebar-settings-button").first().click();

		// シミュレートセクションの見出しを確認
		await expect(
			page.getByRole("heading", {
				name: "役職割り当てシュミレート時のダミープレイヤー名",
			}),
		).toBeVisible();

		// プレイヤー名を追加
		const input = page.getByPlaceholder("プレイヤーネーム");
		await input.fill("E2EPlayer1");
		await input.press("Enter");

		await input.fill("E2EPlayer2");
		await page
			.locator("button")
			.filter({ has: page.locator("svg.lucide-plus") })
			.click();

		// 追加された名前が表示されていることを確認
		await expect(page.getByText("E2EPlayer1")).toBeVisible();
		await expect(page.getByText("E2EPlayer2")).toBeVisible();

		// ダイアログを閉じて再度開く（永続性の確認）
		await page.keyboard.press("Escape");
		await page.getByTestId("sidebar-settings-button").first().click();
		await expect(page.getByText("E2EPlayer1")).toBeVisible();
		await expect(page.getByText("E2EPlayer2")).toBeVisible();

		// 削除
		await page.getByLabel("Delete E2EPlayer1").click();
		await expect(page.getByText("E2EPlayer1")).not.toBeVisible();
		await expect(page.getByText("E2EPlayer2")).toBeVisible();
	});
});
