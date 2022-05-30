import { expect, test } from "@playwright/test"

import { ProjectName, checkForConsoleErrors, demosBaseURL } from "../../../e2e"
import { CONTAINER_ID } from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${demosBaseURL}/d3js/multiline-voronoi`)

  await page.waitForSelector(mainSVGSelector)
})

test.afterEach(setupConsoleAfterEach)

test("UI is as expected @snapshot", async ({ page }, workerInfo) => {
  if (workerInfo.project.name !== ProjectName.DesktopChrome) {
    return
  }

  expect(await page.locator(mainSVGSelector).screenshot()).toMatchSnapshot(
    "chart.png"
  )
})

test("Generates the svg", async ({ page }) => {
  await expect(page.locator(mainSVGSelector)).toHaveCount(1)
})
