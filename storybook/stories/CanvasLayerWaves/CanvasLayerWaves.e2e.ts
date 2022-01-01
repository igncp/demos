import { expect, test } from "@playwright/test"

import { getFrame, storybookBaseURL } from "../common/e2e"

import { ROOT_ID } from "./constants"

test.describe("CanvasLayerWaves", () => {
  test("The animation is present", async ({ page }) => {
    await page.goto(`${storybookBaseURL}?path=/story/canvas-layerwaves--common`)

    const frame = await getFrame(page)

    const exampleSelector = `#${ROOT_ID} > canvas`

    await frame.waitForSelector(exampleSelector)

    await expect(frame.locator(exampleSelector)).toBeVisible()
  })
})
