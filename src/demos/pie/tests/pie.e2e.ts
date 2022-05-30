import { expect, test } from "@playwright/test"

import { checkForConsoleErrors, demosBaseURL } from "../../../e2e"
import { BUTTON_ID, CONTAINER_ID, TRANSITION_DURATION } from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${demosBaseURL}/d3js/pie`)

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

test("One slice change when pressing the button", async ({ page }) => {
  const getSlices = () =>
    page.evaluate(
      ([selector]) => {
        const slices = document
          .querySelector(selector)!
          .querySelectorAll("text")

        return Array.from(slices).map((slice) => slice.innerHTML)
      },
      [mainSVGSelector]
    )
  const getDiffSlices = (...[slicesA, slicesB]: [string[], string[]]) =>
    slicesA.filter((...[slice, sliceIndex]) => slice !== slicesB[sliceIndex])

  const clickButtonAndWait = async () => {
    await page.click(`#${BUTTON_ID}`)
    await new Promise((resolve) => setTimeout(resolve, TRANSITION_DURATION))
  }

  const initialSlices = await getSlices()

  await clickButtonAndWait()

  const secondSlices = await getSlices()

  expect(getDiffSlices(initialSlices, secondSlices).length).toEqual(1)

  await clickButtonAndWait()

  expect(getDiffSlices(secondSlices, await getSlices()).length).toEqual(1)
})

test("It updates the translate when the viewport is resized", async ({
  page,
}) => {
  const getTranslate = () =>
    page.evaluate(
      ([selector]) => {
        const translate = document
          .querySelector(selector)!
          .querySelector("g")!
          .getAttribute("transform")!

        return /translate\(([0-9.]+),.?([0-9.]+)\)/
          .exec(translate)!
          .slice(1)
          .map(Number)
      },
      [mainSVGSelector]
    )

  const initialTranslate = await getTranslate()

  expect(initialTranslate.every((translateItem) => translateItem > 0)).toEqual(
    true
  )

  await page.setViewportSize({
    height: 2000,
    width: 2000,
  })

  expect(
    (await getTranslate()).every(
      (...[translateItem, translateIndex]) =>
        translateItem > initialTranslate[translateIndex]
    )
  ).not.toEqual(initialTranslate)
})
