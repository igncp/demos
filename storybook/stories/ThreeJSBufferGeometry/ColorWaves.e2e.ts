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
const timeout = 2 * 60 * 1000

// eslint-disable-next-line max-params
test.beforeEach(async ({ page }, testInfo) => {
  setupConsoleBeforeEach(page)

  test.setTimeout(testInfo.timeout + timeout)

  await page.goto(
    `${storybookBaseURL}?path=/story/threejs-buffergeometry-colorwaves--common`
  )

  const frame = await getFrame(page)

  await frame.waitForSelector(exampleSelector)
})

test.afterEach(setupConsoleAfterEach)

test("The canvas is present", async ({ page }) => {
  const frame = await getFrame(page)

  await expect(frame.locator(exampleSelector)).toHaveCount(1, {
    timeout,
  })
})
