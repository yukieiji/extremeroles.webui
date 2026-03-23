import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// すべてのテストで API の遅延を設定可能にする
	await page.addInitScript(() => {
		// @ts-expect-error - window has no __API_DELAY__ property
		window.__API_DELAY__ = 100;
	});

	await page.goto("/");

	// ローディング画面が消えるのを待つ
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});
});

test("has sidebar and json viewer", async ({ page }) => {
	// サイドバーが表示されていることを確認
	const sidebar = page.getByLabel("オプションサイドバー");
	await expect(sidebar).toBeVisible({ timeout: 15000 });

	// サイドバー内のボタンを明示的に指定
	await expect(
		sidebar.getByRole("button", { name: "Au Options" }),
	).toBeVisible();
	await expect(
		sidebar.getByRole("button", { name: "ExR Options" }),
	).toBeVisible();

	// Au Options が初期で表示されることを確認する
	await expect(page.getByRole("heading", { name: "Au Options" })).toBeVisible();
	// 以前のデータには "ゲーム設定" があったが、新しいデータには "インポスター" などがある
	await expect(page.getByTestId("au-json-pre")).toContainText(
		'"TranslatedTitle": "インポスター"',
	);

	// ExR Options に切り替え
	await sidebar.getByRole("button", { name: "ExR Options" }).click();
	await expect(
		page.getByRole("heading", { name: "ExR Options" }),
	).toBeVisible();
	// JSON pre はなくなったので、アコーディオンが表示されていることを確認
	await expect(page.getByText("グローバル設定")).toBeVisible();

	// サイドバーの開閉
	await page.getByRole("button", { name: "サイドバーを閉じる" }).click();
	await expect(sidebar.getByRole("navigation")).not.toBeAttached({
		timeout: 10000,
	});

	await page.getByRole("button", { name: "サイドバーを開く" }).click();
	await expect(sidebar.getByRole("navigation")).toBeVisible({ timeout: 10000 });
});
