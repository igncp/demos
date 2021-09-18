import { addons } from "@storybook/addons"

import myTheme from "./myTheme"

// https://storybook.js.org/docs/react/configure/features-and-behavior

addons.setConfig({
  enableShortcuts: true,
  initialActive: "sidebar",
  isFullscreen: false,
  isToolshown: true,
  panelPosition: "bottom",
  selectedPanel: undefined,
  showNav: true,
  showPanel: true,
  sidebar: {
    collapsedRoots: ["other"],
    showRoots: false,
  },
  theme: myTheme,
  toolbar: {
    copy: { hidden: false },
    eject: { hidden: false },
    fullscreen: { hidden: false },
    title: { hidden: false },
    zoom: { hidden: false },
  },
})
