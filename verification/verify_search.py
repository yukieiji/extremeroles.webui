from playwright.sync_api import Page, expect, sync_playwright
import time

def test_search_bar(page: Page):
    # 1. ページにアクセス
    page.goto("http://localhost:5173")

    # 2. ロード完了を待つ (Suspenseなどがあるので)
    # 検索バーが表示されるまで待機
    expect(page.get_by_placeholder("オプションを検索...")).to_be_visible(timeout=10000)

    # 3. 検索バーに文字を入力
    search_input = page.get_by_placeholder("オプションを検索...")
    search_input.fill("map")

    # 4. 検索結果が表示されるのを待つ
    time.sleep(1) # Reactのレンダリング待ち

    # 5. 検索結果をスクリーンショット
    page.screenshot(path="verification/search_results.png")

    # 6. 検索結果の1つをクリック
    # 役職名などを含むボタンを探す
    first_result = page.locator("button:has-text('map')").first
    first_result.click()

    # 7. ナビゲーション後の状態をスクリーンショット
    time.sleep(1) # スクロール待ち
    page.screenshot(path="verification/after_navigation.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_search_bar(page)
        finally:
            browser.close()
