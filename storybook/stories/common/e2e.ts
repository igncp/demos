import { Frame, Page } from "@playwright/test"

import { checkForConsoleErrors } from "../../../src/e2e"

const storybookBaseURL = (() => {
  if (process.env.CI) {
    return "http://localhost:9000/demos/storybook"
  }

  return process.env.NODE_ENV === "production"
    ? "https://igncp.github.io/demos/storybook"
    : "http://localhost:6006"
})()

const getFrame = async (page: Page) => {
  const frameSelector = "#storybook-preview-iframe"

  await page.waitForSelector(frameSelector)

  const elementHandle = await page.$(frameSelector)
  const frame = (await elementHandle!.contentFrame()) as Frame

  return frame
}

const hoverSidebarHeader = (page: Page) => page.hover(".sidebar-header")

export { checkForConsoleErrors, getFrame, hoverSidebarHeader, storybookBaseURL }
