import { expect, test } from "@playwright/test"

import {
  checkForConsoleErrors,
  getFrame,
  storybookBaseURL,
} from "../common/e2e"

import { ROOT_ID } from "./constants"

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

const svgSelector = `#${ROOT_ID} > svg`

test.beforeEach(({ page }) => {
  setupConsoleBeforeEach(page)
})

test.afterEach(setupConsoleAfterEach)

const storyNames = ["first", "second", "third"]

storyNames.forEach((storyName) => {
  test(`The SVG is present for ${storyName}`, async ({ page }) => {
    await page.goto(
      `${storybookBaseURL}?path=/story/svg-spinners--${storyName}`
    )

    const frame = await getFrame(page)

    await frame.waitForSelector(svgSelector)

    await expect(frame.locator(svgSelector)).toHaveCount(1)
  })
})
