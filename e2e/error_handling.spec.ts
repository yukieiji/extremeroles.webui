import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	// モックサーバーの状態をリセット
	await page.request.post("/mock/reset", { maxRetries: 5 });
});

test("初期ロード時にフェッチが失敗した場合、エラー画面が表示されること", async ({
	page,
}) => {
	// APIリクエストを失敗させる
	// Service Workerが有効な場合、page.routeでは捕捉できないことがあるため
	// ブラウザ側でfetchをモックする
	await page.addInitScript(() => {
		// @ts-ignore
		window._nativeFetch = window.fetch;
		window.fetch = function (...args) {
			const input = args[0];
			let url = "";
			if (typeof input === "string") {
				url = input;
			} else if (input instanceof URL) {
				url = input.href;
			} else if (input && typeof input === "object" && "url" in input) {
				// Request-like object
				url = (input as any).url;
			}

			if (url.includes("au/translation/batch")) {
				return Promise.reject(new TypeError("Failed to fetch (simulated)"));
			}
			// @ts-ignore
			return window._nativeFetch.apply(this, args);
		};
	});

	await page.goto("/");

	// エラー画面が表示されることを確認
	const errorTitle = page.getByText("エラーが発生しました");
	await expect(errorTitle).toBeVisible({ timeout: 15000 });

	const retryButton = page.getByRole("button", { name: "再試行" });
	await expect(retryButton).toBeVisible();

	// 再試行で成功するようにルートを解除
	await page.evaluate(() => {
		// fetchのモックを解除（元のfetchに戻す）
		// @ts-ignore
		if (window._nativeFetch) {
			// @ts-ignore
			window.fetch = window._nativeFetch;
		}
	});

	await retryButton.click();

	// エラー画面が消えることを確認
	await expect(errorTitle).not.toBeVisible();
});

test("再試行してもフェッチが失敗し続ける場合、エラー画面が再度表示されること", async ({
	page,
}) => {
	// APIリクエストを永続的に失敗させる
	await page.addInitScript(() => {
		// @ts-ignore
		window._nativeFetch = window.fetch;
		window.fetch = function (...args) {
			const input = args[0];
			let url = "";
			if (typeof input === "string") {
				url = input;
			} else if (input instanceof URL) {
				url = input.href;
			} else if (input && typeof input === "object" && "url" in input) {
				// Request-like object
				url = (input as any).url;
			}

			if (url.includes("au/translation/batch")) {
				return Promise.reject(new TypeError("Failed to fetch (simulated)"));
			}
			// @ts-ignore
			return window._nativeFetch.apply(this, args);
		};
	});

	await page.goto("/");

	// エラー画面が表示されることを確認
	const errorTitle = page.getByText("エラーが発生しました");
	await expect(errorTitle).toBeVisible({ timeout: 15000 });

	const retryButton = page.getByRole("button", { name: "再試行" });

	// 2回再試行を試みる
	for (let i = 0; i < 2; i++) {
		await retryButton.click();
		// 再度エラー画面が表示されることを確認
		await expect(errorTitle).toBeVisible({ timeout: 15000 });
	}
});
