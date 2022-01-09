#!/bin/bash

set -e

# Remove previous files in case any of them was renamed
find src storybook/stories -type f -name '*.css.d.ts' -print0 | while read -d $'\0' FILE_PATH
do
  rm -rf "$FILE_PATH"
done

./node_modules/.bin/tcm src
./node_modules/.bin/tcm storybook/stories
