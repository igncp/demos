import { expect, test } from "@playwright/test"

import { checkForConsoleErrors, demosBaseURL } from "../../../e2e"
import { CONTAINER_ID } from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${demosBaseURL}/d3js/collapsible-tree`)

  await page.waitForSelector(mainSVGSelector)
})

test.afterEach(setupConsoleAfterEach)

test("Generates the svg", async ({ page }) => {
  await expect(page.locator(mainSVGSelector)).toHaveCount(1)
})
