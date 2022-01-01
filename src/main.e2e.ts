import { expect, test } from "@playwright/test"

import { demosBaseURL } from "./e2e"

test.describe("Home page", () => {
  test("The home page has the expected content", async ({ page }) => {
    await page.goto(demosBaseURL)

    await expect(page).toHaveTitle(/Demos - igncp/)

    await expect(page.locator("text=Storybook Demos").first()).toBeVisible()
    await expect(page.locator("text=Testing Page").first()).toBeVisible()
  })
})
