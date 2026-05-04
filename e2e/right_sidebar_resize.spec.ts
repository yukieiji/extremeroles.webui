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
	await expect(rightPanel).toBeVisible();

	const handle = page.locator("div.cursor-ew-resize").first();
	await expect(handle).toBeVisible();
	const handleBox = await handle.boundingBox();
	if (!handleBox) {
		throw new Error("Handle box not found");
	}

	// ドラッグ開始
	await page.mouse.move(
		handleBox.x + handleBox.width / 2,
		handleBox.y + handleBox.height / 2,
	);
	await page.mouse.down();

	// リサイズ中は transition が none であることを確認 (style属性を確認)
	const style = await rightPanel.getAttribute("style");
	expect(style).toContain("transition: none");

	// body のカーソルが ew-resize であることを確認
	await expect(page.locator("body")).toHaveCSS("cursor", "ew-resize");

	await page.mouse.up();

	// リサイズ終了後は transition が復活することを確認
	const styleAfter = await rightPanel.getAttribute("style");
	expect(styleAfter).toContain("transition: transform 300ms ease-in-out");

	// body のカーソルが元に戻ることを確認
	await expect(page.locator("body")).toHaveCSS("cursor", "auto");
});

test("right sidebar can be resized", async ({ page }) => {
	const rightPanel = page.getByLabel("右フローティングパネル");
	const toggleButton = page.getByRole("button", { name: "パネルを開く" });

	await toggleButton.click();
	await expect(rightPanel).toBeVisible();

	const initialBox = await rightPanel.boundingBox();
	expect(initialBox?.width).toBe(320);

	const handle = page.getByTestId("resize-handle");
	const handleBox = await handle.boundingBox();
	if (!handleBox) {
		throw new Error("Handle box not found");
	}

	// 左にドラッグしてリサイズ
	await page.mouse.move(
		handleBox.x + handleBox.width / 2,
		handleBox.y + handleBox.height / 2,
	);
	await page.mouse.down();
	await page.mouse.move(handleBox.x - 100, handleBox.y + handleBox.height / 2);
	await page.mouse.up();

	const resizedBox = await rightPanel.boundingBox();
	expect(resizedBox?.width).toBeGreaterThan(400);
});
