import { expect, test } from "@playwright/test"

import { ProjectName, checkForConsoleErrors, demosBaseURL } from "../../../e2e"
import {
  CONTAINER_ID,
  NODE_CIRCLE_CLASS,
  OPEN_CLOSE_ANIMATION_MS,
} from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${demosBaseURL}/d3js/collapsible-tree`)

  await page.waitForSelector(mainSVGSelector)
})

test.afterEach(setupConsoleAfterEach)

test("Generates the svg", async ({ page }) => {
  await expect(page.locator(mainSVGSelector)).toHaveCount(1)
})

test("Can collapse and expand the root node", async ({ page }, workerInfo) => {
  if (workerInfo.project.name !== ProjectName.DesktopChrome) {
    return
  }

  const getCirclesCount = () =>
    page.evaluate(
      (selectors) =>
        document.querySelector(selectors[0])!.querySelectorAll(selectors[1])
          .length,
      [mainSVGSelector, `.${NODE_CIRCLE_CLASS}`]
    )

  const clickRootNode = async () => {
    await page
      .locator(`${mainSVGSelector} >> .${NODE_CIRCLE_CLASS}`)
      .last()
      .click()

    await new Promise((resolve) =>
      setTimeout(resolve, OPEN_CLOSE_ANIMATION_MS * 1.5)
    )
  }

  const circlesCountInitial = await getCirclesCount()

  expect(
    typeof circlesCountInitial === "number" && circlesCountInitial > 1
  ).toEqual(true)

  await clickRootNode()

  expect(await getCirclesCount()).toEqual(1)

  await clickRootNode()

  expect(
    typeof circlesCountInitial === "number" && circlesCountInitial > 1
  ).toEqual(true)
})
