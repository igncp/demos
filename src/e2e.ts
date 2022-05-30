import { Page } from "@playwright/test"

import { BACK_HOME_ATTR } from "./ui-constants"

enum ProjectName {
  DesktopChrome = "desktop-chrome",
  MobileChrome = "mobile-chrome",
}

const demosBaseURL = (() => {
  if (process.env.CI) {
    return "http://localhost:9000/demos"
  }

  if (process.env.NODE_ENV === "production") {
    return "https://igncp.github.io/demos"
  }

  return process.env.BASE_URL ?? "http://localhost:8000"
})()

const jQueryUITooltipSelector = ".ui-tooltip"
const homeDemoSelector = ".list-group-item"
const backButtonWrapperSelector = `[${BACK_HOME_ATTR}]`

const QUnitHeaderLinkSelector = "#qunit-header a:first-child"

const checkForConsoleErrors = () => {
  const consoleErrors: Error[] = []

  const setupConsoleBeforeEach = (page: Page) => {
    page.on("pageerror", (error) => {
      consoleErrors.push(error)
    })
  }

  const setupConsoleAfterEach = () => {
    if (consoleErrors.length) {
      // eslint-disable-next-line no-console
      console.log("Throwing in checkForConsoleErrors")
      throw new Error(consoleErrors.join(""))
    }

    consoleErrors.length = 0
  }

  return {
    setupConsoleAfterEach,
    setupConsoleBeforeEach,
  }
}

// Depending on the environment (local, built) there can be a trailing slash
const getIsInHomePage = (page: Page) =>
  [demosBaseURL, `${demosBaseURL}/`].includes(page.url())

export {
  ProjectName,
  QUnitHeaderLinkSelector,
  backButtonWrapperSelector,
  checkForConsoleErrors,
  demosBaseURL,
  getIsInHomePage,
  homeDemoSelector,
  jQueryUITooltipSelector,
}
