import { expect, test } from "@playwright/test";
import { accessMainPage, getLeftSidebarButton } from "./conftest";

test.describe("Role Filter Responsive Design", () => {
	test.beforeEach(async ({ page }) => {
		// 初期ビューポート設定
		await page.setViewportSize({ width: 1280, height: 720 });
		await accessMainPage(page);
	});

	test("RoleFilter grid layout should adapt to container size when sidebar is resized", async ({
		page,
	}) => {
		// Role Filter タブに切り替え
		await getLeftSidebarButton(page, "役職フィルター").click();

		const list = page.getByTestId("role-filter-list");
		await expect(list).toBeVisible();

		// ヘルパー関数: 現在のグリッド列数とカード幅を取得
		const getGridLayoutInfo = async () => {
			const cols = await list.evaluate((el) => {
				const style = window.getComputedStyle(el);
				return style.gridTemplateColumns.split(" ").length;
			});
			const firstCard = page.getByTestId("role-filter-card").first();
			const cardWidth = await firstCard.evaluate((el) => el.clientWidth);
			return { cols, cardWidth };
		};

		// 1. 初期状態 (サイドバーが閉じている / ウィンドウ 1280px)
		// 通常は3列表示されるはず
		const initial = await getGridLayoutInfo();
		console.log(
			`Initial columns: ${initial.cols}, Card width: ${initial.cardWidth}`,
		);

		// 2. サイドバーを開く
		const toggleButton = page.locator('[data-testid="right-panel-toggle"]');
		await toggleButton.click();

		// 3. サイドバーを大幅に広げてメインコンテンツを狭くする
		const handle = page.getByTestId("resize-handle");
		await expect(handle).toBeVisible();
		const handleBox = await handle.boundingBox();
		if (!handleBox) {
			throw new Error("Resize handle bounding box not found");
		}

		const startX = handleBox.x + handleBox.width / 2;
		const startY = handleBox.y + 100;

		// 左方向にドラッグ (サイドバーを広げる)
		await page.mouse.move(startX, startY);
		await page.mouse.down();
		await page.mouse.move(startX - 600, startY);
		await page.mouse.up();

		// レイアウトの再計算を待つ
		await page.waitForTimeout(500);

		// 4. リサイズ後の状態を確認
		const resized = await getGridLayoutInfo();
		console.log(
			`Resized columns: ${resized.cols}, Card width: ${resized.cardWidth}`,
		);

		// 検証:
		// - 列数が減少していること (Container Queryが効いている証拠)
		// - 列数が減ることで、カード1枚あたりの幅が極端に狭くなる(200px以下など)のを防げていること
		expect(resized.cols).toBeLessThan(initial.cols);
		expect(resized.cardWidth).toBeGreaterThan(250);
	});
});
