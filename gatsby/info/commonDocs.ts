const getCommonCSS = (name: string) => [
  `${name} CSS property`,
  `https://developer.mozilla.org/en-US/docs/Web/CSS/${name}`,
]

const getCommonSVGAttribute = (name: string) => [
  `${name} SVG attribute`,
  `https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/${name}`,
]

export const chromaItems = [
  ["chroma-js API reference", "https://vis4.net/chromajs/#api"],
  [
    "chroma-js Types",
    `https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/chroma-js/index.d.ts`,
  ],
]

export const animeItems = [
  ["animejs API reference", "https://animejs.com/documentation/"],
  [
    "animejs Types",
    `https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/animejs/index.d.ts`,
  ],
]

export const hotkeysItems = [
  [
    "hotkeys API reference",
    "https://github.com/jaywcjlove/hotkeys#api-reference",
  ],
  [
    "hotkeys Types",
    "https://github.com/jaywcjlove/hotkeys/blob/master/index.d.ts",
  ],
]

export const mixBlendModeCSS = getCommonCSS("mix-blend-mode")

export const gradientUnitsSVGAttribute = getCommonSVGAttribute("gradientUnits")
