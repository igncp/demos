// https://stylelint.io/user-guide/rules/list/

// Existing:

// https://github.com/stylelint/stylelint-config-standard/blob/master/index.js
// https://github.com/stylelint/stylelint-config-recommended/blob/master/index.js

const commonPattern = "^[a-z][a-zA-Z0-9]*$"

module.exports = {
  extends: "stylelint-config-standard",
  plugins: ["stylelint-order", "stylelint-scss"],
  rules: {
    "block-closing-brace-newline-after": "always",
    "block-closing-brace-newline-before": "always",
    "block-opening-brace-newline-after": "always",

    "order/order": [
      "custom-properties",
      "dollar-variables",
      "declarations",
      "rules",
      "at-rules",
    ],
    "order/properties-alphabetical-order": true,

    "scss/dollar-variable-colon-space-after": "always",
    "scss/dollar-variable-empty-line-after": "always",
    "scss/dollar-variable-pattern": commonPattern,

    "selector-class-pattern": commonPattern,
    "selector-id-pattern": commonPattern,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
  },
}
