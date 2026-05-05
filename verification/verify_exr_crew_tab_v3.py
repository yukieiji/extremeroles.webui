from playwright.sync_api import sync_playwright, expect

def verify_exr_crew_tab():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 720})

        # Go to the application
        page.goto("http://localhost:5173")

        # Switch to ExR tab
        page.get_by_role("button", name="ExR Options").click()

        # Switch to 'クルー' tab in ExR
        crew_tab = page.locator('button:has-text("クルー")').first
        crew_tab.click()

        # Wait for role categories to appear
        page.wait_for_selector('[data-testid="role-category"]')

        # Take a screenshot
        page.screenshot(path="verification/exr_crew_tab_v3.png")

        # Check heights of role categories
        role_categories = page.locator('[data-testid="role-category"]')
        count = role_categories.count()
        print(f"Found {count} role categories in ExR Crew tab")

        for i in range(min(count, 5)):
            height = role_categories.nth(i).evaluate("el => el.getBoundingClientRect().height")
            print(f"Category {i} height: {height}")

        browser.close()

if __name__ == "__main__":
    verify_exr_crew_tab()
