#!/bin/bash

set -e

ROOT_PATH=/demos/ npm run build

npm run ts-coverage

mv coverage-ts public

(cd storybook && npm run storybook:build)

mv storybook/storybook-static public/storybook
