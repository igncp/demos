import { expect, test } from "@playwright/test"

import { ProjectName, checkForConsoleErrors, demosBaseURL } from "../../../e2e"
import { ANIMATION_MS, CONTAINER_ID } from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${demosBaseURL}/d3js/trend-line`)

  await page.waitForSelector(mainSVGSelector)
})

test.afterEach(setupConsoleAfterEach)

test("UI is as expected", async ({ page }, workerInfo) => {
  if (workerInfo.project.name !== ProjectName.DesktopChrome) {
    return
  }

  // ANIMATION_MS is used for the estimated, real, and text opacity
  await new Promise((resolve) => setTimeout(resolve, ANIMATION_MS * 3.5))

  expect(await page.locator(mainSVGSelector).screenshot()).toMatchSnapshot(
    "chart.png"
  )
})

test("Generates the svg", async ({ page }) => {
  await expect(page.locator(mainSVGSelector)).toHaveCount(1)
})
