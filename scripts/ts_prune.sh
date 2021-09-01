#!/bin/bash

set -e

LINES="$(./node_modules/.bin/ts-prune . | \
  ag -v '(pages|Page404|head.tsx|onCreatePage|onCreateWebpackConfig|storybook)' \
  || true)"

if [ -n "$LINES" ]; then
  echo "$LINES"
  exit 1
fi