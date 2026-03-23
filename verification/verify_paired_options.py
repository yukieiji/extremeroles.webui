from playwright.sync_api import sync_playwright, expect
import time

def verify_paired_options():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Navigate to the app
        page.goto("http://localhost:5173")

        # Wait for the app to load
        page.wait_for_selector("text=Loading data...", state="hidden")

        # Click "ExR Options" in the sidebar
        page.get_by_text("ExR Options").click()
        page.wait_for_timeout(1000)

        # Category 5 title
        category_5_title = page.get_by_text("役職のスポーン数")
        category_5_title.wait_for(state="visible", timeout=5000)
        category_5_title.click()

        # Wait for content to be visible
        page.wait_for_timeout(2000)

        # Take a screenshot
        page.screenshot(path="verification/category_5_paired.png")

        # Find the row containing "クルーのロール数"
        row = page.get_by_text("クルーのロール数", exact=True).locator("xpath=ancestor::div[contains(@class, 'flex-row')][1]")

        min_slider = row.locator("input[type='range']").nth(0)
        max_slider = row.locator("input[type='range']").nth(1)
        min_input = row.locator("input[type='text']").nth(0)
        max_input = row.locator("input[type='text']").nth(1)

        print(f"Initial Min: {min_input.input_value()}, Max: {max_input.input_value()}")

        # Move Min slider to a high value (index 20)
        min_slider.fill("20")
        page.wait_for_timeout(500)
        print(f"After Min move - Min: {min_input.input_value()}, Max: {max_input.input_value()}")

        # Move Max slider to a low value (index 5)
        max_slider.fill("5")
        page.wait_for_timeout(500)
        print(f"After Max move - Min: {min_input.input_value()}, Max: {max_input.input_value()}")

        page.screenshot(path="verification/category_5_interacted.png")

        browser.close()

if __name__ == "__main__":
    verify_paired_options()
