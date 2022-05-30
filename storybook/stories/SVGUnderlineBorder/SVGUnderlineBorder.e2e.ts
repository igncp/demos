import { expect, test } from "@playwright/test"

import {
  checkForConsoleErrors,
  getFrame,
  storybookBaseURL,
} from "../common/e2e"

import { ROOT_ID } from "./constants"

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

const svgSelector = `#${ROOT_ID} > div > svg`

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(
    `${storybookBaseURL}?path=/story/svg-underline-border--common`
  )

  const frame = await getFrame(page)

  await frame.waitForSelector(svgSelector)
})

test.afterEach(setupConsoleAfterEach)

test("The initial UI is as expected @snapshot", async ({ page }) => {
  const frame = await getFrame(page)

  expect(await frame.locator(svgSelector).screenshot()).toMatchSnapshot(
    "story.png"
  )
})

test("The SVG is present", async ({ page }) => {
  const frame = await getFrame(page)

  await expect(frame.locator(svgSelector)).toHaveCount(1)
})
