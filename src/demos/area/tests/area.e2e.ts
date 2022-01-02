import { expect, test } from "@playwright/test"

import { demosBaseURL, jQueryUITooltipSelector } from "../../../e2e"
import {
  CONTAINER_ID,
  HAS_VORONOI_ATTR,
  TOGGLE_BUTTON_ID,
  VORONOI_ITEM,
} from "../ui-constants"

const mainSVGSelector = `#${CONTAINER_ID} > svg`

test.beforeEach(async ({ page }) => {
  await page.goto(`${demosBaseURL}/d3js/area`)

  await page.waitForSelector(mainSVGSelector)
})

test("UI is as expected", async ({ page }) => {
  expect(await page.locator(mainSVGSelector).screenshot()).toMatchSnapshot(
    "chart.png"
  )
})

test("It can toggle the display of voronoi lines on button click", async ({
  page,
}) => {
  const [selectorHasVoronoiTrue, selectorHasVoronoiFalse] = [true, false].map(
    (valueResult) =>
      `${mainSVGSelector} >> [${HAS_VORONOI_ATTR}="${valueResult}"]`
  )

  await expect(page.locator(selectorHasVoronoiFalse)).toHaveCount(1)
  await expect(page.locator(selectorHasVoronoiTrue)).toHaveCount(0)

  await page.click(`#${TOGGLE_BUTTON_ID}`)

  await expect(page.locator(selectorHasVoronoiFalse)).toHaveCount(0)
  await expect(page.locator(selectorHasVoronoiTrue)).toHaveCount(1)

  await page.click(`#${TOGGLE_BUTTON_ID}`)

  await expect(page.locator(selectorHasVoronoiFalse)).toHaveCount(1)
  await expect(page.locator(selectorHasVoronoiTrue)).toHaveCount(0)
})

test("Displays the expected tooltip when overing a path", async ({ page }) => {
  await expect(page.locator(jQueryUITooltipSelector)).toHaveCount(0)

  await page.hover(`${mainSVGSelector} >> [${VORONOI_ITEM}="1"]`)

  await expect(page.locator(jQueryUITooltipSelector)).toHaveCount(1)
  await expect(page.locator(jQueryUITooltipSelector)).toHaveText(
    "Year: 1911, Percentage: 40.80%"
  )
})

test("Renders many paths", async ({ page }) => {
  await expect(page.locator(`${mainSVGSelector} >> path`)).not.toHaveCount(0)
  await expect(page.locator(`${mainSVGSelector} >> path`)).not.toHaveCount(1)
})
