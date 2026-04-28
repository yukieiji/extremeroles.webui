from playwright.sync_api import Page, expect, sync_playwright

def verify_exr_viewer(page: Page):
    # 1. アプリケーションにアクセス
    page.goto("http://localhost:5173")

    # ローディングが消えるのを待つ
    expect(page.get_by_text("Loading data...")).not_to_be_visible(timeout=30000)

    # 2. 右パネルを開く
    page.get_by_role("button", name="パネルを開く").click()
    right_panel = page.get_by_label("右フローティングパネル")
    expect(right_panel).to_be_visible()

    # 3. AmongUsの設定アコーディオンを確認
    au_settings = right_panel.get_by_test_id("au-settings-accordion")
    expect(au_settings).to_be_visible()

    # インポスター役職セクションを確認
    imposter_role_section = au_settings.get_by_test_id("au-role-section-2")
    expect(imposter_role_section).to_be_visible()

    # 4. ExRの設定アコーディオンを確認
    exr_settings = right_panel.get_by_test_id("exr-settings-accordion")
    expect(exr_settings).to_be_visible()

    # スクリーンショットを撮る
    page.screenshot(path="verification/right_panel_viewer.png")
    print("Screenshot saved to verification/right_panel_viewer.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_exr_viewer(page)
        finally:
            browser.close()
