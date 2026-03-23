import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading data...')).not.toBeVisible({ timeout: 45000 });
});

test('Preset input should lose focus when interacting with dropdown', async ({ page }) => {
  const sidebar = page.getByLabel('オプションサイドバー');
  await expect(sidebar).toBeVisible({ timeout: 30000 });

  const exrButton = sidebar.getByRole('button', { name: 'ExR Options' });
  await expect(exrButton).toBeVisible({ timeout: 30000 });
  await exrButton.click();

  const presetInput = page.getByPlaceholder('プリセット名を入力...');
  await expect(presetInput).toBeVisible();

  const checkFocus = async (label: string) => {
    const isInputFocused = await page.evaluate(() => document.activeElement?.tagName === 'INPUT');
    console.log(`Is some input focused [${label}]:`, isInputFocused);
    return isInputFocused;
  };

  // 1. フォーカスを当てる
  await presetInput.click();
  await expect(presetInput).toBeFocused();

  // 2. ドロップダウンボタンをクリックして開く
  const selectButton = page.getByRole('button', { name: 'プリセットを選択' });
  await selectButton.dispatchEvent('click');
  await expect(page.getByRole('button', { name: '2', exact: true })).toBeVisible();

  const focusedAfterOpen = await checkFocus('after opening');

  // 3. 同じ項目を選択する
  // 初期状態は 1 (index 0) なので、ボタン "1" をクリック
  const preset1Button = page.getByRole('button', { name: '1', exact: true });
  await preset1Button.dispatchEvent('click');

  const focusedAfterSelectSame = await checkFocus('after selecting same');

  // 4. 再び開いて別の項目を選択
  await selectButton.dispatchEvent('click');
  const preset2Button = page.getByRole('button', { name: '2', exact: true });
  await preset2Button.dispatchEvent('click');

  const focusedAfterSelectDifferent = await checkFocus('after selecting different');

  expect(focusedAfterOpen).toBe(false);
  expect(focusedAfterSelectSame).toBe(false);
  expect(focusedAfterSelectDifferent).toBe(false);
});
