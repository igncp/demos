#!/bin/bash

set -e

./node_modules/.bin/tcm src
./node_modules/.bin/tcm storybook/stories

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
