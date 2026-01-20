import { test, expect } from "@playwright/test";

test.describe("Hero Section", () => {
  test("should look correct on load", async ({ page }) => {
    // Navigate to home page
    // Set a consistent viewport size if needed, though projects usually handle this
    await page.goto("/");

    // Wait for the hero title to be visible
    await expect(page.locator(".hero-title")).toBeVisible();

    // Wait for animations to settle
    // Title: 0.8s
    // ScrambleText: 0.8s delay + 2.0s duration = 2.8s
    // Giving it 4s to be safe and ensure everything is static.
    await page.waitForTimeout(4000);

    // Prepare for screenshot:
    // 1. Hide the moving WebGL canvas to avoid flaky tests and the "pink mask" issue
    await page.locator("canvas").evaluate((canvas) => (canvas.style.opacity = "0"));

    // 2. Hide the scroll indicator arrow because it has an infinite bounce animation
    // which causes snapshot mismatches depending on the exact frame captured.
    await page.locator(".scroll-indicator-arrow").evaluate((el) => (el.style.opacity = "0"));

    // 3. Hide Next.js dev indicator/badge (bottom-left) to clean up screenshot
    await page.addStyleTag({
      content: `
        [data-nextjs-toast],
        .nextjs-toast-errors-parent,
        nextjs-portal,
        #nextjs-route-announcer {
          display: none !important;
          opacity: 0 !important;
        }
      `,
    });

    await expect(page).toHaveScreenshot("hero-usage.png", {
      fullPage: false,
    });
  });
});
