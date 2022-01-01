import { expect, test } from "@playwright/test"

import { getFrame, hoverSidebarHeader, storybookBaseURL } from "../common/e2e"

import { ROOT_ID } from "./constants"

test.describe("CanvasLayerWaves", () => {
  test("The animation is present", async ({ page }) => {
    await page.goto(`${storybookBaseURL}?path=/story/svg-flip--common`)

    const frame = await getFrame(page)

    const svgSelector = `#${ROOT_ID} >> svg`

    await frame.waitForSelector(svgSelector)

    await expect(frame.locator(svgSelector)).toHaveCount(1)
  })

  test("The circle changes color when the rectangle is hovered", async ({
    page,
  }) => {
    await page.goto(`${storybookBaseURL}?path=/story/svg-flip--common`)

    const frame = await getFrame(page)

    const getCircleColor = () =>
      frame.evaluate((rootId) => {
        const circle = document
          .querySelector(`#${rootId}`)!
          .querySelector("circle")!

        return circle.getAttribute("fill")
      }, ROOT_ID)

    const svgSelector = `#${ROOT_ID} >> svg`
    const rectangleSelector = `#${ROOT_ID} >> circle`

    await frame.waitForSelector(svgSelector)

    const initialCircleColor = await getCircleColor()

    expect(initialCircleColor).toBeDefined()

    await frame.hover(rectangleSelector)

    expect(await getCircleColor()).not.toEqual(initialCircleColor)

    await hoverSidebarHeader(page)

    expect(await getCircleColor()).toEqual(initialCircleColor)
  })
})
