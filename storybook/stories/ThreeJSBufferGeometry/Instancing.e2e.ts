import { expect, test } from "@playwright/test"

import {
  ProjectName,
  checkForConsoleErrors,
  getFrame,
  storybookBaseURL,
} from "../common/e2e"

import { ROOT_ID } from "./constants"

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

const exampleSelector = `#${ROOT_ID} > canvas`
const timeout = 2 * 60 * 1000

test.beforeEach(async ({ page }, workerInfo) => {
  if (workerInfo.project.name !== ProjectName.DesktopChrome) {
    return
  }

  setupConsoleBeforeEach(page)

  test.setTimeout(workerInfo.timeout + timeout)

  await page.goto(
    `${storybookBaseURL}?path=/story/threejs-buffergeometry-instancing--common`
  )

  const frame = await getFrame(page)

  await frame.waitForSelector(exampleSelector)
})

test.afterEach(setupConsoleAfterEach)

test("The canvas is present", async ({ page }, workerInfo) => {
  if (workerInfo.project.name !== ProjectName.DesktopChrome) {
    return
  }

  const frame = await getFrame(page)

  await expect(frame.locator(exampleSelector)).toHaveCount(1, {
    timeout,
  })
})
