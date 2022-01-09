import { expect, test } from "@playwright/test"

import { ProjectName, checkForConsoleErrors, demosBaseURL } from "../../../e2e"
import { CONTAINER_ID } from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${demosBaseURL}/d3js/mareys-schedule`)

  await page.waitForSelector(mainSVGSelector)
})

test.afterEach(setupConsoleAfterEach)

test("Generates the svg", async ({ page }) => {
  await expect(page.locator(mainSVGSelector)).toHaveCount(1)
})

test("Can drag the chart horizontally on mobile, but not on desktop", async ({
  page,
}, workerInfo) => {
  const getDragTranslate = () =>
    page.evaluate(
      ([mainSVGSelectorInner]) => {
        const mainSVG = document.querySelector(mainSVGSelectorInner)!
        const transform = mainSVG.getAttribute("transform")

        if (!transform) {
          return { x: 0, y: 0 }
        }

        const translate = /translate\(([0-9.-]+),([0-9.-]+)\)/.exec(transform)

        if (!translate) {
          return { x: 0, y: 0 }
        }

        return {
          x: parseFloat(translate[1]),
          y: parseFloat(translate[2]),
        }
      },
      [`${mainSVGSelector} > g`]
    )

  expect(await getDragTranslate()).toEqual({ x: 0, y: 0 })

  // Swipe several times in diagonal
  await Array.from({ length: 10 }).reduce(async (promise) => {
    await promise
    await page.mouse.move(250, 300)
    await page.mouse.down()
    await page.mouse.move(10, 250)
    await page.mouse.up()
  }, Promise.resolve())

  const finalTranslate = await getDragTranslate()

  if (workerInfo.project.name === ProjectName.MobileChrome) {
    expect(finalTranslate.y).toEqual(0)
    expect(finalTranslate.x < 0).toEqual(true)
  } else {
    expect(finalTranslate).toEqual({ x: 0, y: 0 })
  }
})
