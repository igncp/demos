const denyList = require("./scripts/restrictedNames")

const isFindRules = process.env.FIND_RULES === "true"

const disabledRules = {
  "@typescript-eslint/ban-ts-comment": 0,
  "@typescript-eslint/explicit-module-boundary-types": 0,
  "@typescript-eslint/no-confusing-void-expression": 0,
  "@typescript-eslint/no-empty-function": 0,
  "@typescript-eslint/no-invalid-this": 0,
  "@typescript-eslint/no-non-null-assertion": 0,
  "@typescript-eslint/no-unsafe-argument": 0,
  "@typescript-eslint/no-unsafe-assignment": 0,
  "@typescript-eslint/no-unsafe-call": 0,
  "@typescript-eslint/no-unsafe-member-access": 0,
  "@typescript-eslint/no-unsafe-return": 0,
  "@typescript-eslint/restrict-plus-operands": 0,
  "@typescript-eslint/restrict-template-expressions": 0,
  "@typescript-eslint/unbound-method": 0,

  "react/no-unescaped-entities": 0,
  "react/prop-types": 0,
}

const tsRules = {
  "@typescript-eslint/array-type": [2, { default: "array-simple" }],
  "@typescript-eslint/explicit-member-accessibility": 2,
  "@typescript-eslint/lines-between-class-members": [
    2,
    "always",
    { exceptAfterSingleLine: true },
  ],
  "@typescript-eslint/member-ordering": 2,
  "@typescript-eslint/method-signature-style": 2,
  "@typescript-eslint/no-confusing-non-null-assertion": 2,
  "@typescript-eslint/no-duplicate-imports": 2,
  "@typescript-eslint/no-explicit-any": 2,
  "@typescript-eslint/no-redeclare": 2,
  "@typescript-eslint/no-shadow": 2,
  "@typescript-eslint/no-unnecessary-boolean-literal-compare": 2,
  "@typescript-eslint/no-unnecessary-condition": [
    2,
    { allowConstantLoopConditions: true },
  ],
  "@typescript-eslint/no-unnecessary-qualifier": 2,
  "@typescript-eslint/no-unnecessary-type-arguments": 2,
  "@typescript-eslint/no-unnecessary-type-assertion": 2,
  "@typescript-eslint/no-unnecessary-type-constraint": 2,
  "@typescript-eslint/no-unused-expressions": 2,
  "@typescript-eslint/no-unused-vars": 2,
  "@typescript-eslint/no-use-before-define": [
    2,
    {
      enums: true,
      ignoreTypeReferences: false,
      typedefs: true,
    },
  ],
  "@typescript-eslint/no-useless-constructor": 2,
  "@typescript-eslint/prefer-includes": 2,
  "@typescript-eslint/prefer-nullish-coalescing": 2,
  "@typescript-eslint/prefer-optional-chain": 2,
  "@typescript-eslint/prefer-readonly": 2,
  "@typescript-eslint/prefer-reduce-type-parameter": 2,
  "@typescript-eslint/prefer-return-this-type": 2,
  "@typescript-eslint/prefer-ts-expect-error": 2,
  "@typescript-eslint/sort-type-union-intersection-members": 2,
  "@typescript-eslint/switch-exhaustiveness-check": 2,
  "@typescript-eslint/unified-signatures": 2,
}

const commonExtends = ["eslint:recommended", "plugin:react/recommended"]

const tsExtends = commonExtends.concat([
  "plugin:@typescript-eslint/recommended",
  "plugin:@typescript-eslint/recommended-requiring-type-checking",
])

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: isFindRules ? tsExtends : commonExtends,
  globals: {
    $: false,
    ROOT_PATH: false,
  },
  overrides: [
    {
      files: ["**/tests/**/*.ts"],
      rules: {
        "import/no-namespace": 0,
      },
    },
    {
      files: ["**/tests/**/*.e2e.ts", "storybook/stories/**/*.e2e.ts"],
      rules: {
        "max-params": 0,
      },
    },
    {
      files: ["research/**/*.js"],
      rules: {
        "no-console": 0,
      },
    },
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/explicit-member-accessibility": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "no-shadow": 2,
      },
    },
    {
      files: ["*.d.ts"],
      rules: {
        "@typescript-eslint/init-declarations": 2,
        "init-declarations": 0,
        "no-var": 0,
      },
    },
    {
      extends: tsExtends,
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      rules: {
        ...disabledRules,
        ...tsRules,
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 9,
    sourceType: "module",
  },
  plugins: [
    "prettier",
    "sort-destructure-keys",
    "import",
    "typescript-sort-keys",
    "@typescript-eslint",
  ],
  rules: {
    ...disabledRules,
    ...(isFindRules ? tsRules : {}),

    "arrow-body-style": [2, "as-needed"],
    "block-scoped-var": 2,
    "camelcase": [2, { properties: "never" }],
    "class-methods-use-this": 2,
    "consistent-return": 2,
    "eqeqeq": 2,
    "func-names": 2,
    "id-denylist": [2, ...denyList],

    "import/exports-last": 2,
    "import/group-exports": 2,
    "import/no-cycle": 2,
    "import/no-deprecated": 2,
    "import/no-duplicates": 2,
    "import/no-namespace": [2, { ignore: ["*.module.css"] }],
    "import/no-useless-path-segments": 2,

    "init-declarations": [2, "always"],
    "max-params": [2, 1],
    "newline-before-return": 2,
    "no-console": 2,
    "no-constant-condition": [2, { checkLoops: false }],
    "no-else-return": [2, { allowElseIf: false }],
    "no-func-assign": 2,
    "no-multi-assign": 2,
    "no-nested-ternary": 2,
    "no-new-func": 2,
    "no-param-reassign": 2,
    "no-plusplus": 2,
    "no-restricted-globals": [2, "global"],
    "no-restricted-syntax": [
      "error",
      "IfStatement[consequent.type!='BlockStatement']",
    ],
    "no-return-assign": [2, "always"],
    "no-shadow": 0, // using ts plugin one
    "no-unneeded-ternary": 2,
    "no-unreachable": 2,
    "no-unreachable-loop": 2,
    "no-useless-call": 2,
    "no-useless-computed-key": 2,
    "no-useless-concat": 2,
    "no-useless-rename": 2,
    "no-useless-return": 2,
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
        AssignmentExpression: {
          array: false, // eslint-disable-line id-denylist
          object: false,
        },
        VariableDeclarator: {
          array: false, // eslint-disable-line id-denylist
          object: true,
        },
      },
      { enforceForRenamedProperties: true },
    ],
    "prefer-rest-params": 2,
    "prefer-template": 2,

    "prettier/prettier": "error",

    "quote-props": [2, "consistent-as-needed"],

    "react/jsx-boolean-value": 2,
    "react/jsx-fragments": [2, "syntax"],
    "react/jsx-handler-names": 2,
    "react/jsx-sort-props": 2,
    "react/self-closing-comp": 2,

    "require-atomic-updates": 2,

    "sort-destructure-keys/sort-destructure-keys": 2,

    "sort-imports": [
      "error",
      {
        ignoreDeclarationSort: true,
      },
    ],
    "sort-keys": 2,
    "spaced-comment": 2,

    "typescript-sort-keys/interface": "error",
    "typescript-sort-keys/string-enum": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}
