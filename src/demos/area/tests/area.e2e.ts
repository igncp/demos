import { expect, test } from "@playwright/test"

import { demosBaseURL } from "../../../e2e"
import {
  CONTAINER_ID,
  HAS_VORONOI_ATTR,
  TOGGLE_BUTTON_ID,
} from "../ui-constants"

const demoPath = `${demosBaseURL}/d3js/area`

const mainSVGSelector = `#${CONTAINER_ID} > svg`

test("It has the svg", async ({ page }) => {
  await page.goto(demoPath)

  await expect(page.locator(mainSVGSelector)).toHaveCount(1)
})

test("It can toggle the display of voronoi lines on button click", async ({
  page,
}) => {
  const [selectorHasVoronoiTrue, selectorHasVoronoiFalse] = [true, false].map(
    (valueResult) =>
      `${mainSVGSelector} >> g[${HAS_VORONOI_ATTR}="${valueResult}"]`
  )

  await page.goto(demoPath)

  await page.waitForSelector(mainSVGSelector)

  await expect(page.locator(selectorHasVoronoiFalse)).toHaveCount(1)
  await expect(page.locator(selectorHasVoronoiTrue)).toHaveCount(0)

  await page.click(`#${TOGGLE_BUTTON_ID}`)

  await expect(page.locator(selectorHasVoronoiFalse)).toHaveCount(0)
  await expect(page.locator(selectorHasVoronoiTrue)).toHaveCount(1)

  await page.click(`#${TOGGLE_BUTTON_ID}`)

  await expect(page.locator(selectorHasVoronoiFalse)).toHaveCount(1)
  await expect(page.locator(selectorHasVoronoiTrue)).toHaveCount(0)
})
