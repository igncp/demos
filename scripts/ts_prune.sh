#!/bin/bash

set -e

LINES="$(./node_modules/.bin/ts-prune . | \
  grep -vE '(pages|Page404|head.tsx|onCreatePage|onCreateWebpackConfig|storybook|playwright.config)' \
  || true)"

if [ -n "$LINES" ]; then
  echo "$LINES"
  exit 1
fi
