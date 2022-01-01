import { expect, test } from "@playwright/test"

import { storybookBaseURL } from "./common/e2e"

test.describe("Storybook", () => {
  test("The home page has the expected content", async ({ page }) => {
    await page.goto(storybookBaseURL)

    await expect(page).toHaveTitle(/Storybook/)
  })
})
