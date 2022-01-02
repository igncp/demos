import { expect, test } from "@playwright/test"

import { QUnitHeaderLinkSelector, demosBaseURL } from "./e2e"

test.describe("Home page", () => {
  test("The home page has the expected content", async ({ page }) => {
    await page.goto(demosBaseURL)

    await expect(page).toHaveTitle(/Demos - igncp/)

    await expect(page.locator("text=Storybook Demos")).toHaveCount(1)
    await expect(page.locator("text=Testing Page")).toHaveCount(1)
  })

  test("UI is as expected", async ({ page }) => {
    await page.goto(demosBaseURL)

    await expect(page.locator("text=Storybook Demos")).toHaveCount(1)
    await expect(
      page.locator("text=interactive data visualization demos")
    ).toHaveCount(1)
    await expect(
      page.locator("text=interactive data visualization examples")
    ).toHaveCount(1)

    expect(await page.screenshot()).toMatchSnapshot("landing.png")
  })
})

test.describe("Testing page", () => {
  test("All tests are passing", async ({ page }) => {
    await page.goto(`${demosBaseURL}/testing`)

    await expect(page.locator("text=, 0 failed.")).toHaveCount(1)
    await expect(page.locator("text=with 0 failed")).toHaveCount(1)
  })

  test("Goes to the home page when clicking in the header", async ({
    page,
  }) => {
    await page.goto(`${demosBaseURL}/testing`)

    await page.click(QUnitHeaderLinkSelector)

    expect(page.url()).toContain(demosBaseURL)
  })
})
