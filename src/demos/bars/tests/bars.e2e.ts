import { expect, test } from "@playwright/test"

import { ProjectName, demosBaseURL } from "../../../e2e"
import { ADD_BAR_BUTTON_ID, CONTAINER_ID } from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`
const demoURL = `${demosBaseURL}/d3js/bars`

test("UI is as expected", async ({ page }) => {
  await page.goto(demoURL)

  await page.waitForSelector(mainSVGSelector)

  expect(await page.locator(mainSVGSelector).screenshot()).toMatchSnapshot(
    "chart.png"
  )
})

test("It adds a new rect each time clicking the button", async ({ page }) => {
  await page.goto(demoURL)

  await page.waitForSelector(mainSVGSelector)

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

test("Mobile: It can swipe chart when adding all bars", async ({
  page,
}, workerInfo) => {
  if (workerInfo.project.name !== ProjectName.MobileChrome) {
    return
  }

  await page.goto(`${demoURL}?interval=false`)

  await page.waitForSelector(mainSVGSelector)

  while (true) {
    const isButtonDisabled = await page.evaluate((buttonId) => {
      const button = document.querySelector(`#${buttonId}`) as HTMLButtonElement

      return button.disabled
    }, ADD_BAR_BUTTON_ID)

    if (isButtonDisabled) {
      break
    }

    await page.click(`#${ADD_BAR_BUTTON_ID}`)
  }

  // Swipe several times
  await Array.from({ length: 10 }).reduce(async (promise) => {
    await promise
    await page.mouse.move(250, 300)
    await page.mouse.down()
    await page.mouse.move(10, 300)
    await page.mouse.up()
  }, Promise.resolve())

  // Move cursor away from chart
  await page.mouse.move(1, 1)
  await new Promise((resolve) => setTimeout(resolve, 100))

  await page.evaluate(async (selector) => {
    const bars = document.querySelector(selector)!.querySelectorAll("rect")

    // Normalize bars random attrs to always have same screenshot
    ;[].forEach.call(bars, (bar: SVGRectElement) => {
      bar.setAttribute("height", "100px")
      bar.setAttribute("y", "0px")
      bar.setAttribute("fill", "orange")
    })

    await new Promise((resolve) => setTimeout(resolve, 100))
  }, mainSVGSelector)

  expect(await page.locator(mainSVGSelector).screenshot()).toMatchSnapshot(
    "chart-swipe.png"
  )
})
