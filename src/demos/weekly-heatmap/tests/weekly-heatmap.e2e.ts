import { expect, test } from "@playwright/test"

import { checkForConsoleErrors, demosBaseURL } from "../../../e2e"
import { CONTAINER_ID, TRANSITION_DURATION } from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${demosBaseURL}/d3js/weekly-heatmap`)

  await page.waitForSelector(mainSVGSelector)
})

test.afterEach(setupConsoleAfterEach)

test("UI is as expected", async ({ page }) => {
  await new Promise((resolve) => setTimeout(resolve, TRANSITION_DURATION))

  expect(await page.locator(mainSVGSelector).screenshot()).toMatchSnapshot(
    "chart.png"
  )
})

test("Generates the svg", async ({ page }) => {
  await expect(page.locator(mainSVGSelector)).toHaveCount(1)
})
