import { expect, test } from "@playwright/test"

import {
  checkForConsoleErrors,
  getFrame,
  storybookBaseURL,
} from "../common/e2e"

import { ROOT_ID } from "./constants"

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

const exampleSelector = `#${ROOT_ID} > canvas`

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${storybookBaseURL}?path=/story/threejs-terrain--common`)

  const frame = await getFrame(page)

  await frame.waitForSelector(exampleSelector)
})

test.afterEach(setupConsoleAfterEach)

test("The canvas is present", async ({ page }) => {
  const frame = await getFrame(page)

  await expect(frame.locator(exampleSelector)).toHaveCount(1)
})
