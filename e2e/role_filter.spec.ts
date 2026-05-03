import { test, expect } from '@playwright/test';

test.describe('Role Filter Tab', () => {
  test.beforeEach(async ({ page }) => {
    // モックを使用する設定でページを開く
    await page.goto('http://localhost:5173/');
    // データの読み込みを待つ
    await page.waitForSelector('text=Au Options');
  });

  test('should display Role Filter data when the tab is selected', async ({ page }) => {
    // Role Filter タブをクリック (ショートカット 'R')
    const roleFilterTab = page.getByRole('button', { name: 'Role Filter' });
    if (await roleFilterTab.isVisible()) {
        await roleFilterTab.click();
    } else {
        await page.getByTitle('Role Filter').click();
    }

    // Role Filter のタイトルが表示されていることを確認
    await expect(page.getByRole('heading', { name: 'Role Filter' })).toBeVisible();

    // JSONデータが表示されていることを確認 (PREタグ内)
    const preElement = page.locator('pre');
    await expect(preElement).toBeVisible();

    const content = await preElement.textContent();
    expect(content).toContain('FilterSet');
    expect(content).toContain('c521f29a-4a3d-4896-a642-8fc8a22aa8e6');
    expect(content).toContain('Bakary');
    expect(content).toContain('Opener');
    expect(content).toContain('Carpenter');
  });
});
