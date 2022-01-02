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

test(`The SVG is present`, async ({ page }) => {
  await page.goto(`${storybookBaseURL}?path=/story/svg-text-filter--common`)

  const frame = await getFrame(page)

  await frame.waitForSelector(svgSelector)

  await expect(frame.locator(svgSelector)).toHaveCount(1)
})
