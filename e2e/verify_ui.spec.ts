import { test } from "@playwright/test";

test("verify role colors page", async ({ page }) => {
	await page.goto("http://localhost:3000/color/role");
	await page.waitForSelector("h2");
	await page.screenshot({ path: "role_colors_verify.png", fullPage: true });
});
