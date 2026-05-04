import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	// ローディング画面が消えるのを待つ
	await expect(page.getByText("Loading data...")).not.toBeVisible({
		timeout: 30000,
	});
});

test("isResizing state is correctly managed", async ({ page }) => {
	const rightPanel = page.getByLabel("右フローティングパネル");
	const toggleButton = page.getByRole("button", { name: "パネルを開く" });

	await toggleButton.click();
	// パネルが開くのを待つ（アニメーション完了を待機）
	await expect(page.getByText("Right Panel")).toBeVisible();

	// transition: transform 300ms が完了し、右端に密着するまで待機
	await expect
		.poll(async () => {
			const box = await rightPanel.boundingBox();
			const viewport = page.viewportSize();
			if (!box || !viewport) {
				return -1;
			}
			return box.x + box.width;
		})
		.toBe(page.viewportSize()?.width);

	const handle = page.getByTestId("resize-handle");
	await expect(handle).toBeVisible();
	const handleBox = await handle.boundingBox();
	if (!handleBox) {
		throw new Error("Handle box not found");
	}

	// ドラッグ開始
	await page.mouse.move(handleBox.x, handleBox.y + handleBox.height / 2);
	await page.mouse.down();

	// マウスを動かしてリサイズ状態をトリガーする
	await page.mouse.move(handleBox.x - 50, handleBox.y + handleBox.height / 2, {
		steps: 5,
	});

	// body のカーソルが ew-resize であることを確認
	await expect(page.locator("body")).toHaveCSS("cursor", "ew-resize");

	await page.mouse.up();

	// body のカーソルが元に戻ることを確認
	await expect(page.locator("body")).toHaveCSS("cursor", "auto");
});

test("right sidebar can be resized", async ({ page }) => {
	const rightPanel = page.getByLabel("右フローティングパネル");
	const toggleButton = page.getByRole("button", { name: "パネルを開く" });

	await toggleButton.click();
	// パネルが開くのを待つ
	await expect(page.getByText("Right Panel")).toBeVisible();

	// transition: transform 300ms が完了し、右端に密着するまで待機
	await expect
		.poll(async () => {
			const box = await rightPanel.boundingBox();
			const viewport = page.viewportSize();
			if (!box || !viewport) {
				return -1;
			}
			return box.x + box.width;
		})
		.toBe(page.viewportSize()?.width);

	const initialBox = await rightPanel.boundingBox();
	expect(initialBox?.width).toBe(320);

	const handle = page.getByTestId("resize-handle");
	const handleBox = await handle.boundingBox();
	if (!handleBox) {
		throw new Error("Handle box not found");
	}

	// 左にドラッグして幅を広げる (左へ200px)
	await page.mouse.move(handleBox.x, handleBox.y + handleBox.height / 2);
	await page.mouse.down();
	await page.mouse.move(handleBox.x - 200, handleBox.y + handleBox.height / 2, {
		steps: 20,
	});
	await page.mouse.up();

	// リサイズ後の幅を確認
	await expect
		.poll(
			async () => {
				const box = await rightPanel.boundingBox();
				return box?.width;
			},
			{ timeout: 5000 },
		)
		.toBeGreaterThan(400);

	// 右にドラッグして幅を狭める (MIN_WIDTH付近になるはず)
	const newHandleBox = await handle.boundingBox();
	if (!newHandleBox) {
		throw new Error("New handle box not found");
	}
	await page.mouse.move(
		newHandleBox.x,
		newHandleBox.y + newHandleBox.height / 2,
	);
	await page.mouse.down();
	await page.mouse.move(
		newHandleBox.x + 300,
		newHandleBox.y + newHandleBox.height / 2,
		{ steps: 20 },
	);
	await page.mouse.up();

	const narrowBox = await rightPanel.boundingBox();
	expect(narrowBox?.width).toBeLessThanOrEqual(325);
});
