import { Page, expect, test } from "@playwright/test"

import { ProjectName, checkForConsoleErrors, demosBaseURL } from "../../../e2e"
import {
  ATTR_SANKEY_LINK,
  ATTR_SANKEY_NODE,
  CONTAINER_ID,
  TRANSITION_DURATION,
} from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

const { setupConsoleAfterEach, setupConsoleBeforeEach } =
  checkForConsoleErrors()

test.beforeEach(async ({ page }) => {
  setupConsoleBeforeEach(page)

  await page.goto(`${demosBaseURL}/d3js/energy-sankey`)

  await page.waitForSelector(mainSVGSelector)
})

test.afterEach(setupConsoleAfterEach)

test("UI is as expected @snapshot", async ({ page }) => {
  expect(await page.locator(mainSVGSelector).screenshot()).toMatchSnapshot(
    "chart.png"
  )
})

test("Generates the svg", async ({ page }) => {
  await expect(page.locator(mainSVGSelector)).toHaveCount(1)
})

const getLinksDisplays = (page: Page) =>
  page.evaluate(
    ({ secondSelector, selector }) => {
      const links = document
        .querySelector(selector)!
        .querySelectorAll(secondSelector)
      const displays = []

      for (let linkIndex = 0; linkIndex < links.length; linkIndex += 1) {
        const link = links[linkIndex] as HTMLElement

        displays.push(link.getAttribute("display"))
      }

      return displays
    },
    {
      secondSelector: `[${ATTR_SANKEY_LINK}]`,
      selector: mainSVGSelector,
    }
  )

test("Toggles all sankey links (except one) when clicking a link", async ({
  page,
}, workerInfo) => {
  if (workerInfo.project.name !== ProjectName.DesktopChrome) {
    return
  }

  expect(
    (await getLinksDisplays(page)).every((display) => display === null)
  ).toEqual(true)

  const clickLink = () =>
    page.locator(`${mainSVGSelector} >> [${ATTR_SANKEY_LINK}]`).first().click()

  await clickLink()

  expect(
    (await getLinksDisplays(page)).filter((display) => display === null).length
  ).toEqual(1)

  await clickLink()

  expect(
    (await getLinksDisplays(page)).every((display) => display === null)
  ).toEqual(true)
})

test("Toggles some sankey links when clicking a node", async ({
  page,
}, workerInfo) => {
  if (workerInfo.project.name !== ProjectName.DesktopChrome) {
    return
  }

  expect(
    (await getLinksDisplays(page)).every((display) => display === null)
  ).toEqual(true)

  const clickNode = () =>
    page.locator(`${mainSVGSelector} >> [${ATTR_SANKEY_NODE}]`).first().click()

  await clickNode()

  await new Promise((resolve) => setTimeout(resolve, TRANSITION_DURATION * 1.5))

  expect(
    (await getLinksDisplays(page)).every((display) => display === null)
  ).toEqual(false)

  await clickNode()

  expect(
    (await getLinksDisplays(page)).every((display) => display === null)
  ).toEqual(true)
})
