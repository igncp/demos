module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:eslint-comments/recommended",
    "plugin:react/recommended",
  ],
  globals: {
    $: false,
    ROOT_PATH: false,
    d3: false,
    nv: false,
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/explicit-member-accessibility": 0,
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 9,
    sourceType: "module",
  },
  plugins: ["prettier", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/explicit-member-accessibility": 2,
    "@typescript-eslint/no-explicit-any": 0, // too many at the moment to have this
    "@typescript-eslint/no-shadow": 2,
    "@typescript-eslint/no-unused-vars": 2,

    "arrow-body-style": [2, "as-needed"],
    "block-scoped-var": 2,
    camelcase: [2, { properties: "never" }],
    "class-methods-use-this": 2,
    "consistent-return": 2,
    "eslint-comments/no-unused-disable": 2,
    "init-declarations": [2, "always"],
    "newline-before-return": 2,
    "no-console": 2,
    "no-else-return": 2,
    "no-func-assign": 2,
    "no-multi-assign": 2,
    "no-restricted-globals": [2, "global"],
    "no-return-assign": [2, "always"],
    "no-shadow": 0, // using ts plugin one
    "no-useless-computed-key": 2,
    "no-var": 2,
    "object-shorthand": [2, "always"],
    "one-var": [2, "never"],
    "padding-line-between-statements": [
      2,
      {
        blankLine: "always",
        next: ["const", "let"],
        prev: "*",
      },
      {
        blankLine: "always",
        next: "*",
        prev: ["const", "let"],
      },
      {
        blankLine: "any",
        next: ["const", "let"],
        prev: ["const", "let"],
      },
      {
        blankLine: "always",
        next: "function",
        prev: "multiline-block-like",
      },
      {
        blankLine: "always",
        next: "multiline-block-like",
        prev: "multiline-block-like",
      },
      {
        blankLine: "always",
        next: "block-like",
        prev: "block-like",
      },
      {
        blankLine: "always",
        next: "class",
        prev: "*",
      },
      {
        blankLine: "always",
        next: "*",
        prev: "class",
      },
      {
        blankLine: "always",
        next: "*",
        prev: "multiline-block-like",
      },
      {
        blankLine: "always",
        next: "multiline-block-like",
        prev: "*",
      },
      {
        blankLine: "always",
        next: "default",
        prev: "*",
      },
      {
        blankLine: "always",
        next: "function",
        prev: "*",
      },
    ],
    "prefer-arrow-callback": 2,
    "prefer-const": 2,
    "prefer-destructuring": [
      2,
      {
        array: false,
        object: true,
      },
    ],
    "prefer-template": 2,

    "prettier/prettier": "error",

    "react/jsx-handler-names": 2,
    "react/jsx-sort-props": 2,
    "react/no-unescaped-entities": 0,
    "react/prop-types": 0,
    "react/self-closing-comp": 2,

    "sort-keys": 2,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}
