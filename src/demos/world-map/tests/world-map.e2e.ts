import { expect, test } from "@playwright/test"

import { checkForConsoleErrors, demosBaseURL } from "../../../e2e"
import {
  COLOR_FNS_NUM,
  CONTAINER_ID,
  COUNTRY_CLASS,
  UPDATE_BUTTON_ID,
} from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${demosBaseURL}/d3js/world-map`)

  await page.waitForSelector(mainSVGSelector)
})

test.afterEach(setupConsoleAfterEach)

test("UI is as expected @snapshot", async ({ page }) => {
  expect(await page.locator(mainSVGSelector).screenshot()).toMatchSnapshot(
    "chart.png"
  )
})

test("Generates the svg", async ({ page }) => {
  await expect(page.locator(mainSVGSelector)).toHaveCount(1)
})

test("When clicking the button it loops through the colors", async ({
  page,
}) => {
  const getColorOfCountry = () =>
    page.evaluate(
      (selectors) =>
        (document
          .querySelector(selectors[0])!
          .querySelector(selectors[1]) as SVGPathElement)!.style.fill,
      [mainSVGSelector, `.${COUNTRY_CLASS}`]
    )

  const initialColor = await getColorOfCountry()
  const initialColor2 = await getColorOfCountry()

  expect(initialColor).toEqual(initialColor2)

  const lastColor = await Array.from({ length: COLOR_FNS_NUM }).reduce(
    async (promise) => {
      const prevColor = await promise

      expect(typeof prevColor === "string" && !!prevColor).toEqual(true)

      await page.click(`#${UPDATE_BUTTON_ID}`)

      const nextColor = await getColorOfCountry()

      expect(typeof nextColor === "string" && !!prevColor).toEqual(true)

      expect(prevColor).not.toEqual(nextColor)

      return nextColor
    },
    Promise.resolve(initialColor)
  )

  expect(lastColor).toEqual(initialColor)
})
