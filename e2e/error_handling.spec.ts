import { expect, test } from "@playwright/test";
import { resetMock } from "./conftest";

test.beforeEach(async ({ page }) => {
	// モックサーバーの状態をリセット
	await resetMock(page);
});

test("初期ロード時にフェッチが失敗した場合、エラー画面が表示されること", async ({
	page,
}) => {
	// APIリクエストを失敗させる
	// Service Workerが有効な場合、page.routeでは捕捉できないことがあるため
	// ブラウザ側でfetchをモックする
	await page.addInitScript(() => {
		// @ts-expect-error
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
				url = (input as { url: string }).url;
			}

			if (url.includes("au/translation/batch")) {
				return Promise.reject(new TypeError("Failed to fetch (simulated)"));
			}
			// @ts-expect-error
			return window._nativeFetch.apply(this, args);
		};
	});

	await page.goto("/");

	// エラー画面が表示されることを確認
	const errorTitle = page.getByText("ERROR");
	await expect(errorTitle).toBeVisible({ timeout: 15000 });

	const retryButton = page.getByRole("button", { name: "Retry" });
	await expect(retryButton).toBeVisible();

	// 再試行で成功するようにルートを解除
	await page.evaluate(() => {
		// fetchのモックを解除（元のfetchに戻す）
		// @ts-expect-error
		if (window._nativeFetch) {
			// @ts-expect-error
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
		// @ts-expect-error
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
				url = (input as { url: string }).url;
			}

			if (url.includes("au/translation/batch")) {
				return Promise.reject(new TypeError("Failed to fetch (simulated)"));
			}
			// @ts-expect-error
			return window._nativeFetch.apply(this, args);
		};
	});

	await page.goto("/");

	// エラー画面が表示されることを確認
	const errorTitle = page.getByText("ERROR");
	await expect(errorTitle).toBeVisible({ timeout: 15000 });

	const retryButton = page.getByRole("button", { name: "Retry" });

	// 2回再試行を試みる
	for (let i = 0; i < 2; i++) {
		await retryButton.click();
		// 再度エラー画面が表示されることを確認
		await expect(errorTitle).toBeVisible({ timeout: 15000 });
	}
});
