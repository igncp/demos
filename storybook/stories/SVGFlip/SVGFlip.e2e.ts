import { expect, test } from "@playwright/test"

import {
  checkForConsoleErrors,
  getFrame,
  hoverSidebarHeader,
  storybookBaseURL,
} from "../common/e2e"

import { ROOT_ID } from "./constants"

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

const svgSelector = `#${ROOT_ID} >> svg`

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${storybookBaseURL}?path=/story/svg-flip--common`)

  const frame = await getFrame(page)

  await frame.waitForSelector(svgSelector)
})

test.afterEach(setupConsoleAfterEach)

test("The initial UI is as expected", async ({ page }) => {
  const frame = await getFrame(page)

  expect(await frame.locator(svgSelector).screenshot()).toMatchSnapshot(
    "story.png"
  )
})

test("The circle changes color when the rectangle is hovered", async ({
  page,
}) => {
  const frame = await getFrame(page)

  const getCircleColor = () =>
    frame.evaluate((rootId) => {
      const circle = document
        .querySelector(`#${rootId}`)!
        .querySelector("circle")!

      return circle.getAttribute("fill")
    }, ROOT_ID)

  const rectangleSelector = `#${ROOT_ID} >> circle`

  const initialCircleColor = await getCircleColor()

  expect(initialCircleColor).toBeDefined()

  await frame.hover(rectangleSelector)

  expect(await getCircleColor()).not.toEqual(initialCircleColor)

  await hoverSidebarHeader(page)

  expect(await getCircleColor()).toEqual(initialCircleColor)
})
