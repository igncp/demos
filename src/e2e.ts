import { Page } from "@playwright/test"

const demosBaseURL = (() => {
  if (process.env.CI) {
    return "http://localhost:9000/demos"
  }

  return process.env.NODE_ENV === "production"
    ? "https://igncp.github.io/demos"
    : "http://localhost:8000"
})()

const jQueryUITooltipSelector = ".ui-tooltip"

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

export {
  demosBaseURL,
  jQueryUITooltipSelector,
  QUnitHeaderLinkSelector,
  checkForConsoleErrors,
}
