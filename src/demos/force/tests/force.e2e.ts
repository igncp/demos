import { expect, test } from "@playwright/test"

import { checkForConsoleErrors, demosBaseURL } from "../../../e2e"
import { CONTAINER_ID, RADIUS_SELECT_ID } from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${demosBaseURL}/d3js/force`)

  await page.waitForSelector(mainSVGSelector)
})

test.afterEach(setupConsoleAfterEach)

test("Generates the svg", async ({ page }) => {
  await expect(page.locator(mainSVGSelector)).toHaveCount(1)
})

test("Can change the radius of the nodes with the select input", async ({
  page,
}) => {
  const getSelectValue = () =>
    page.evaluate(
      ([selectId]) => {
        const select = document.getElementById(selectId) as HTMLSelectElement
        const { value: currentValue } = select

        return Number(currentValue)
      },
      [RADIUS_SELECT_ID]
    )
  const getCircleRadius = () =>
    page.evaluate(
      ([svgSelector]) => {
        const circleSelector = `${svgSelector} circle`
        const circle = document.querySelector(
          circleSelector
        ) as SVGCircleElement

        return Number(circle.getAttribute("r"))
      },
      [mainSVGSelector]
    )

  const initialSelectValue = await getSelectValue()

  expect(await getCircleRadius()).toEqual(initialSelectValue)
  expect(initialSelectValue > 0).toEqual(true)

  // Changes the radius of the nodes
  await page.evaluate(
    ([selectId, valToExclude]) => {
      const select = document.getElementById(selectId) as HTMLSelectElement
      const options = Array.from(select.options).map((option) =>
        Number(option.value)
      )

      // eslint-disable-next-line id-denylist
      select.value = options
        .find((option) => option !== valToExclude)!
        .toFixed()

      const changeEvent = new Event("change")

      select.dispatchEvent(changeEvent)
    },
    [RADIUS_SELECT_ID, initialSelectValue] as const
  )

  const finalSelectValue = await getSelectValue()

  expect(finalSelectValue !== initialSelectValue).toEqual(true)
  expect(await getCircleRadius()).toEqual(finalSelectValue)
  expect(finalSelectValue > 0).toEqual(true)
})
