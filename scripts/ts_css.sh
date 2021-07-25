#!/bin/bash

set -e

./node_modules/.bin/tcm src

# need to do several passes due to `eslint-plugin-typescript-sort-keys`
./node_modules/.bin/eslint --fix src/**/*.css.d.ts 2>&1 > /dev/null || \
  ./node_modules/.bin/eslint --fix src/**/*.css.d.ts 2>&1 > /dev/null || \
  ./node_modules/.bin/eslint --fix src/**/*.css.d.ts 2>&1 > /dev/null || \
  ./node_modules/.bin/eslint --fix src/**/*.css.d.ts
