import { expect, test } from "@playwright/test"

import { checkForConsoleErrors, demosBaseURL } from "../../../e2e"
import { CONTAINER_ID, TRANSITION_DURATION, TYPE_FORM } from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${demosBaseURL}/d3js/partition`)

  await page.waitForSelector(mainSVGSelector)
})

test.afterEach(setupConsoleAfterEach)

test("UI is as expected", async ({ page }) => {
  expect(await page.locator(mainSVGSelector).screenshot()).toMatchSnapshot(
    "chart.png"
  )
})

test("UI is as expected for the other radio button", async ({ page }) => {
  const radios = await page.$$(`#${TYPE_FORM} >> input[type="radio"]`)

  await radios[0].check()

  await new Promise((resolve) =>
    setTimeout(resolve, TRANSITION_DURATION + TRANSITION_DURATION / 10)
  )

  expect(await page.locator(mainSVGSelector).screenshot()).toMatchSnapshot(
    "chart-other-radio.png"
  )
})

test("Generates the svg", async ({ page }) => {
  await expect(page.locator(mainSVGSelector)).toHaveCount(1)
})
