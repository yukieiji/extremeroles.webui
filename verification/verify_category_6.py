from playwright.sync_api import sync_playwright

def verify_category_6():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:5173", wait_until="networkidle")
            page.get_by_text("ExR Options").click()
            page.wait_for_timeout(1000)
            page.get_by_text("幽霊役職のロール数設定").click()
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/category_6_paired.png")
        except Exception as e:
            print(f"EXCEPTION: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_category_6()
