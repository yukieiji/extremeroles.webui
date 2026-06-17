import { expect, test } from "@playwright/test";

test.describe("Role Filter Performance/Responsiveness Reproduction", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await expect(page.getByText("Loading data...")).not.toBeVisible({
			timeout: 30000,
		});
		await page
			.getByRole("button", { name: "Role Filter" })
			.or(page.getByTitle("Role Filter"))
			.click();
	});

	test("Confirm button count should match checked checkboxes and be enabled", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		await expect(page.getByText("フィルター追加: 役職の選択")).toBeVisible();

		const checkboxes = page.getByRole("checkbox");

		// 1つ目の役職をクリック
		await checkboxes.first().click();

		// DOM上でチェックされていることを確認 (data-checked属性)
		await expect(checkboxes.first()).toHaveAttribute("data-checked", "");

		// 確定ボタンが即座に(1秒以内)に有効化され、正しい数値を表示することを確認
		const confirmButton = page.getByRole("button", { name: /確定/ });

		try {
			await expect(confirmButton).toHaveText(/確定 \(1\)/, { timeout: 1000 });
			await expect(confirmButton).toBeEnabled({ timeout: 1000 });
		} catch (_e) {
			const text = await confirmButton.innerText();
			const disabled = await confirmButton.isDisabled();
			console.error(
				`BUG REPRODUCED: Button state mismatch. Text: ${text}, Disabled: ${disabled}`,
			);
			throw new Error(
				`Button state mismatch. Text: ${text}, Disabled: ${disabled}`,
			);
		}
	});

	test("Fast clicking multiple roles should result in correct count (Stale Closure Check)", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		await expect(page.getByText("フィルター追加: 役職の選択")).toBeVisible();

		const checkboxes = page.getByRole("checkbox");

		// 5つの役職を素早くクリック
		for (let i = 0; i < 5; i++) {
			await checkboxes.nth(i).click();
		}

		const confirmButton = page.getByRole("button", { name: /確定/ });

		// 最終的なカウントが5になっていることを確認
		// もし途中のクリックが stale closure で上書きされていれば、5未満になる
		await expect(confirmButton).toHaveText(/確定 \(5\)/, { timeout: 5000 });
	});

	test("Dialog closure duration after clicking confirm", async ({ page }) => {
		await page.getByRole("button", { name: "フィルターを追加" }).click();
		const checkboxes = page.getByRole("checkbox");

		// 10個選択
		for (let i = 0; i < 10; i++) {
			await checkboxes.nth(i).click();
		}

		const confirmButton = page.getByRole("button", { name: /確定 \(10\)/ });
		await expect(confirmButton).toBeEnabled();

		const startTime = Date.now();
		await confirmButton.click();

		// ダイアログが閉じるまでの時間を計測
		await expect(page.getByText("フィルター追加: 役職の選択")).not.toBeVisible({
			timeout: 15000,
		});

		const duration = Date.now() - startTime;
		console.log(`Time to close dialog with 10 roles: ${duration}ms`);

		if (duration > 1000) {
			console.log(
				`Performance Issue Identified: Dialog closure took ${duration}ms (> 1000ms)`,
			);
		}
	});
});
