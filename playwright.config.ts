import { PlaywrightTestConfig, devices } from "@playwright/test"

import { ProjectName } from "./src/e2e"

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  globalTimeout: 5 * 60 * 1000,
  projects: [
    {
      name: ProjectName.DesktopChrome,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: ProjectName.MobileChrome,
      use: { ...devices["Pixel 5"] },
    },
  ],
  retries: process.env.CI ? 2 : 0,
  testMatch: [/.*\.e2e\.ts/],
  timeout: (process.env.CI ? 30 : 15) * 1000,
  use: {
    trace: "on-first-retry",
  },
  ...(process.env.CI && {
    reporter: [["html", { open: "never" }], ["dot"]],
    // This depends on `npm run build:gh-pages` to have been run before
    webServer: {
      command: "./node_modules/.bin/http-server -p 9000 ci-e2e",
      port: 9000,
    },
  }),
}

export default config
