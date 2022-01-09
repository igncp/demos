#!/bin/bash

set -e

sh ./scripts/ts_css_only.sh

linter_fix() {
  ./node_modules/.bin/eslint \
    --fix \
    "src/**/*.css.d.ts" \
    "storybook/stories/**/*.css.d.ts" \
    2>&1
}

# need to do several passes due to `eslint-plugin-typescript-sort-keys`
linter_fix > /dev/null || \
  linter_fix > /dev/null || \
  linter_fix > /dev/null || \
  linter_fix
