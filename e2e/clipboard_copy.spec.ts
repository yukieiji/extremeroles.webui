import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	// Wait for loading screen to disappear
	await expect(page.locator("body")).not.toContainText("Loading data...", {
		timeout: 60000,
	});
	// Ensure main content is loaded
	await expect(page.getByRole("heading", { name: "Among Us" })).toBeVisible({
		timeout: 30000,
	});
});

test("clipboard copy button works and shows toast", async ({
	page,
	context,
	browserName,
}) => {
	const isChromium = browserName === "chromium";

	if (isChromium) {
		// Grant clipboard permissions - only supported in Chromium
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	}

	// Open the panel
	const toggleButton = page.locator('[data-testid="right-panel-toggle"]');
	await toggleButton.click();
	await page.waitForTimeout(500);

	// Find the copy button
	const copyButton = page.getByRole("button", {
		name: "クリップボードにコピー",
	});
	await expect(copyButton).toBeVisible();

	// Click the copy button
	await copyButton.click();

	// Check for toast notification
	await expect(
		page.getByText("設定をクリップボードにコピーしました"),
	).toBeVisible();

	if (isChromium) {
		// Verify clipboard content (only possible in Chromium in headless CI)
		const clipboardText = await page.evaluate("navigator.clipboard.readText()");
		expect(clipboardText).toContain("# 設定");
		expect(clipboardText).toContain("## 陣営数");
	}
});
