import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.request.post("/mock/reset");
	await page.goto("/");
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});
});

test("can open simulation dialog and run simulation", async ({ page }) => {
	// 右サイドパネルが開いていない場合は開く
	const rightPanel = page.getByTestId("right-side-panel");
	const toggleButton = page.getByTestId("right-panel-toggle");

	// パネル本体が隠れている（幅が狭いなど）場合はトグルボタンを押す
	// 実際には transition があるので、少し待つか状態を確認する
	if (await rightPanel.evaluate((el) => el.clientWidth <= 30)) {
		await toggleButton.click();
	}

	// シミュレートボタンをクリック
	const simulateButton = page.getByRole("button", { name: "シミュレート" });
	await expect(simulateButton).toBeVisible();
	await simulateButton.click();

	// ダイアログが表示されることを確認
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible({ timeout: 15000 });
	await expect(dialog.getByText("シミュレート")).toBeVisible();

	// 初期表示のメッセージを確認
	await expect(
		dialog.getByText("シュミレートボタンを押して下さい"),
	).toBeVisible();

	// スライダーの設定を確認 (Cycle: 1, Player Num: 15 がデフォルト)
	// ロビー情報が表示されることを確認
	await expect(dialog.getByText("ロビー情報")).toBeVisible();
	await expect(dialog.getByText("サーバー")).toBeVisible();
	await expect(dialog.getByText("ExR専用(東京)")).toBeVisible();
	await expect(dialog.getByText("ルームコード")).toBeVisible();
	await expect(dialog.getByText("KLCQYH")).toBeVisible();
	await expect(dialog.getByText("現在のプレイヤー")).toBeVisible();
	await expect(dialog.getByText("Lochbass")).toBeVisible();

	// スライダーの設定を確認 (OnlineInfoがある場合は MaxPlayerNum=15)
	const cycleInput = dialog.getByLabel("Cycle");
	await expect(cycleInput).toHaveValue("1");
	const playerNumInput = dialog.getByLabel("Player Num");
	await expect(playerNumInput).toHaveValue("15");

	// 設定を変更してみる
	await cycleInput.fill("3");
	await cycleInput.blur();
	await expect(cycleInput).toHaveValue("3");

	// 実行ボタンをクリック
	const executeButton = dialog.getByRole("button", { name: "Execute" });
	await executeButton.click();

	// 実行中の状態（ローディングサイクルとメッセージの非表示）を確認
	// 非常に速い場合があるので、Executing... または 結果 1 が出ればOKとする
	await expect(
		dialog.getByText("Executing...").or(dialog.getByText("結果 1")),
	).toBeVisible();

	await expect(
		dialog.getByText("シュミレートボタンを押して下さい"),
	).not.toBeVisible();

	// 結果が表示されるまで待機
	await expect(dialog.getByText("結果 1")).toBeVisible({ timeout: 10000 });

	// 結果カードの内容を確認
	// Lochbassはバッジ（ロビー情報）とテーブルセル（結果）の両方にあるので first() を使う
	await expect(dialog.getByText("Lochbass").first()).toBeVisible();
	// handlers.ts のモックデータでは Team も翻訳対象になる可能性があるが、
	// SimulateResultCard.tsx では translationMetaData[team] || team となっている
	// モックでは Team: 'Impostor' で translationMetaData.Impostor = "インポスター" (mockTranslations.ts)
	// 複数ヒットする場合があるので、first() を使用するか、ロールを指定する
	await expect(dialog.getByText("インポスター").first()).toBeVisible();

	// コピーボタンのクリック（動作確認のみ、実際にクリップボードを検証するのは環境により難しい場合がある）
	const copyButton = dialog.getByRole("button", { name: "コピー" });
	await expect(copyButton).toBeVisible();
	await copyButton.click();

	// 成功トーストの確認（もし実装されていれば）
	// SimulationDialog自体にはトーストはないが、SimulateResultCardで navigator.clipboard.writeText している
});
