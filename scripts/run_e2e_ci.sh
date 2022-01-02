#!/bin/bash

set -e

if [ ! -d public ]; then
  echo "This script requires the 'public' directory from 'npm run build:gh-pages'"
  exit 1
fi

clean_up () {
  ARG=$?
  rm -rf ci-e2e
  exit $ARG
}

trap clean_up EXIT

rm -rf test-results
rm -rf ci-e2e
mkdir -p ci-e2e

cp -r public ci-e2e/demos

if [ -z $1 ]; then
  CI=true npm run e2e:test "$@"
else
  CI=true ./node_modules/.bin/playwright test "$@"
fi

cp -r playwright-report ./public/
