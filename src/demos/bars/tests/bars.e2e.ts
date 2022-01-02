import { expect, test } from "@playwright/test"

import { demosBaseURL } from "../../../e2e"
import { ADD_BAR_BUTTON_ID, CONTAINER_ID } from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

test.beforeEach(async ({ page }) => {
  await page.goto(`${demosBaseURL}/d3js/bars`)

  await page.waitForSelector(mainSVGSelector)
})

test("UI is as expected", async ({ page }) => {
  expect(await page.locator(mainSVGSelector).screenshot()).toMatchSnapshot(
    "chart.png"
  )
})

test("It adds a new rect each time clicking the button", async ({ page }) => {
  const barsSelector = `${mainSVGSelector} >> rect`
  const buttonSelector = `#${ADD_BAR_BUTTON_ID}`

  const getBarsCount = () =>
    page.evaluate((barsSelectorInner) => {
      const [chartSelector, rectSelector] = barsSelectorInner.split(" >> ")
      const chart = document.querySelector(chartSelector)!

      return chart.querySelectorAll(rectSelector).length
    }, barsSelector)

  const initialBarsCount = await getBarsCount()

  expect(initialBarsCount).toBeGreaterThan(1)

  await page.click(buttonSelector)

  expect(await getBarsCount()).toEqual(initialBarsCount + 1)

  await page.click(buttonSelector)

  expect(await getBarsCount()).toEqual(initialBarsCount + 2)
})
